/* Export original DeutschDaily learning content for a qualified German + Nepali editor.
   No Goethe official wordlist or external text is copied. No personal learner data.
   Run: node scripts/export-editorial-review.mjs --out audit-results/a1-editorial-review.tsv
   The output is a REVIEW QUEUE, not an approval record. */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const file=n=>fs.readFileSync(new URL('../'+n,import.meta.url),'utf8');
const scope={window:{}};vm.createContext(scope);
for(const name of [
 'a1-course-data.js','a1-themes-data.js','a1-essentials-data.js',
 'a1-grammar-bridge-data.js','productive-guides.js','pronunciation-data.js'
])vm.runInContext(file(name),scope,{filename:name});
const data=scope.window;
const entries=[];
function add(id,category,german,english,nepali,{plural='',example='',exampleEnglish='',source='',notes=''}={}){
 entries.push({id,category,german,english,nepali,plural,example,exampleEnglish,source,notes,
  germanReview:'pending',nepaliReview:'pending',editor:'',reviewDate:'',changesNeeded:''});
}
for(const u of data.DEUTSCH_A1.units){
 u.vocab.forEach((v,i)=>add('unit:'+u.id+':vocab:'+i,'unit-vocabulary',v.de,v.en,v.ne));
 add('unit:'+u.id+':grammar-example','grammar-model',u.grammar.example,u.grammar.exampleEn,u.grammar.exampleNe,{
  notes:'Review grammar explanation in original lesson separately.'});
 add('unit:'+u.id+':writing-model','writing-model',u.writing.model,'','',{
  notes:u.writing.prompt});
 add('unit:'+u.id+':speaking-model','speaking-model',u.speaking.model,'','',{
  notes:u.speaking.prompt});
}
for(const p of data.DEUTSCH_A1_THEME_PACKS)for(const [i,v] of p.items.entries()){
 const note=data.DEUTSCH_A1_NOUN_USAGE_NOTES?.[v[0]];
 add('noun:'+p.id+':'+i,'thematic-noun',v[0],v[1],v[2],{
  plural:v[3],source:note?.source||'',notes:note?(note.en+' | '+note.ne):''});
}
for(const p of data.DEUTSCH_A1_ESSENTIALS)for(const [i,v] of p.items.entries())
 add('essential:'+p.id+':'+i,'essential-expression',v[0],v[1],v[2],{
  example:v[3],exampleEnglish:v[4]});
for(const p of data.DEUTSCH_A1_GRAMMAR_BRIDGE)for(const [i,q] of p.questions.entries()){
 const [de,opts,index,en,ne,feedback]=q;
 add('grammar:'+p.id+':question:'+i,'grammar-question',de.replace('___',opts[index]),en,ne,{notes:feedback});
}
for(const [setId,scenes] of Object.entries(data.DEUTSCH_PRODUCTIVE_GUIDES.dialogues))
 for(const [i,scene] of scenes.entries())for(const [j,turn] of scene.turns.entries())
 add('roleplay:'+setId+':'+i+':'+j,'speaking-dialogue',turn[0],turn[1],turn[2],{
  example:turn[3],notes:scene.title});
for(const s of data.DEUTSCH_PRONUNCIATION_DATA)
 for(const [i,word] of s.words.entries())
 add('pronunciation:'+s.id+':'+i,'pronunciation-example',word[0],word[1],word[2],{
  notes:'Approximate English sound: '+word[3]+' | Approximate Nepali pronunciation: '+word[4]+' | Target '+s.ipa});
const ids=new Set();
for(const [i,r] of entries.entries()){
 if(ids.has(r.id))throw Error('Duplicate editorial queue ID '+r.id);ids.add(r.id);
 if(!r.german||!r.category)throw Error('Missing German text at '+i);
 if(!['pending'].includes(r.germanReview)||r.nepaliReview!=='pending')throw Error('Never pre-approve editorial content');
}
const counts={};
for(const x of entries)counts[x.category]=(counts[x.category]||0)+1;
const expected={
 'unit-vocabulary':260,'grammar-model':36,'writing-model':36,'speaking-model':36,
 'thematic-noun':100,'essential-expression':216,'grammar-question':36,
 'speaking-dialogue':18,'pronunciation-example':24
};
for(const [name,n] of Object.entries(expected))
 if(counts[name]!==n)throw Error(name+' should be '+n+', got '+counts[name]);
if(entries.length!==762)throw Error('Expected 762 editorial review rows, got '+entries.length);
function cell(value){
 const s=String(value??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu,' ')
  .replace(/\r?\n/g,' ⏎ ').replace(/\t/g,'  ').trim();
 // Spreadsheet apps may interpret leading = + - @ as a formula. This is a reviewer worksheet.
 return /^[=+\-@]/u.test(s)?"'"+s:s;
}
const columns=['id','category','german','english','nepali','plural','example','exampleEnglish','source','notes',
 'germanReview','nepaliReview','editor','reviewDate','changesNeeded'];
const tsv=[columns.join('\t'),...entries.map(r=>columns.map(k=>cell(r[k])).join('\t'))].join('\n')+'\n';
const outIndex=process.argv.indexOf('--out');
if(outIndex>=0){
 const out=process.argv[outIndex+1];
 if(!out||out.startsWith('--'))throw Error('--out requires a filename');
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,tsv,'utf8');
 console.error('Wrote '+entries.length+' rows to '+out+'; both language-review statuses remain pending.');
}else process.stdout.write(tsv);
export {entries,counts,columns};
