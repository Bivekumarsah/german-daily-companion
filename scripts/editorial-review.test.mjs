import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'deutsch-a1-editorial-'));
try{
 const file=path.join(root,'review.tsv');
 const proc=spawnSync(process.execPath,['scripts/export-editorial-review.mjs','--out',file],{cwd:new URL('..',import.meta.url).pathname,encoding:'utf8'});
 assert.equal(proc.status,0,proc.stderr||'Export process failed');
 const text=fs.readFileSync(file,'utf8').replace(/\n$/u,'');
 const lines=text.split('\n');
 assert.equal(lines.length,763,'Exactly 762 original study rows plus header');
 const header=lines[0].split('\t');
 assert.equal(header.length,15);
 const key=id=>header.indexOf(id);
 assert(key('germanReview')>=0&&key('nepaliReview')>=0);
 const rows=lines.slice(1).map(line=>{
  const parts=line.split('\t');
  assert.equal(parts.length,header.length,'Reviewer export must have predictable column count');
  return Object.fromEntries(header.map((h,i)=>[h,parts[i]]));
 });
 const counts={};const seen=new Set();
 for(const row of rows){
  assert(!seen.has(row.id),'Each reviewer key must be unique '+row.id);seen.add(row.id);
  counts[row.category]=(counts[row.category]||0)+1;
  assert.equal(row.germanReview,'pending','Never silently approve German content');
  assert.equal(row.nepaliReview,'pending','Never silently approve Nepali content');
  assert.equal(row.editor,'','Reviewer signatures cannot be invented');
  assert.equal(row.reviewDate,'','Editor review dates cannot be invented');
  assert(!/^[=+\-@]/u.test(row.german),'TSV formulas must be escaped');
 }
 for(const [cat,count] of Object.entries({
  'unit-vocabulary':260,'grammar-model':36,'writing-model':36,'speaking-model':36,
  'thematic-noun':100,'essential-expression':216,'grammar-question':36,
  'speaking-dialogue':18,'pronunciation-example':24
 })){assert.equal(counts[cat],count,cat+' entry coverage');}
 const parents=rows.find(x=>x.category==='thematic-noun'&&x.german==='die Eltern');
 const wort=rows.find(x=>x.category==='thematic-noun'&&x.german==='das Wort');
 const track=rows.find(x=>x.category==='thematic-noun'&&x.german==='das Gleis');
 assert(parents&&parents.plural==='plural-only');
 assert(parents.notes.includes('ein Elternteil'));
 assert(wort.notes.includes('die Worte'));
 assert(track.nepali.includes('लिक'));
 for(const row of [parents,wort,track])assert(row.source.startsWith('https://www.duden.de/'));
 console.log('Reviewer worksheet passed: 762 pending bilingual content rows, unique IDs, no preapproval, 3 documented editorial changes.');
}finally{fs.rmSync(root,{recursive:true,force:true})}
