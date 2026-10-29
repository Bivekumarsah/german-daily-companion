import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('.', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const mock = {window:{},document:{readyState:'loading',addEventListener(){}},navigator:{onLine:false},localStorage:{getItem(){return null}},console,Date,URL,TextEncoder,Set,Map};
vm.createContext(mock);
for(const file of ['phrases.js','lessons.js','a1-course-data.js','app.js','a1-course.js']){
 let content=read(file);
 if(file==='app.js')content=content.replace(/\}\)\(\);\s*$/, 'globalThis.__legacyTest={germanLooksValid,localPhrase};})();');
 vm.runInContext(content,mock,{filename:file});
}
const phrases=mock.window.DAILY_PHRASES;
assert(phrases.length>=70);
const lessons=mock.window.DEUTSCH_LESSONS;
assert.equal(lessons.length,6);
const a1=mock.window.DEUTSCH_A1;
assert.equal(a1.units.length,36);
assert(a1.units.reduce((sum,u)=>sum+u.vocab.length,0)>=250);
assert.equal(a1.exam.reading.length,10);
assert.equal(a1.exam.listening.length,10);
assert.equal(a1.exam.writing.length,3);
assert.equal(a1.exam.speaking.length,3);
const names=new Set(), ids=new Set();
const answerPositions={reading:new Set(),listening:new Set()};
for(const u of a1.units){
 assert(!ids.has(u.id));ids.add(u.id);
 assert(u.group.length&&u.grammar.en.length>=20&&u.grammar.ne.length&&u.grammar.example&&u.grammar.exampleEn&&u.grammar.exampleNe);
 assert(u.vocab.length>=7);
 for(const v of u.vocab)assert(v.de&&v.en&&v.ne,`Missing vocabulary meaning ${u.id}`);
 for(const part of ['reading','listening']){
  const q=u[part];assert(q.text.length>=20&&q.question.length&&q.choices.length===3);
  assert(q.answer>=0&&q.answer<=2);assert(new Set(q.choices).size===3);answerPositions[part].add(q.answer);
 }
 for(const part of ['writing','speaking'])assert(u[part].prompt.length&&u[part].model.length>=20);
 names.add(u.title);
}
assert.equal(names.size,a1.units.length);
assert.equal(answerPositions.reading.size,3);
assert.equal(answerPositions.listening.size,3);
assert.equal(mock.__legacyTest.localPhrase('What is your name?').german,'Wie heißt du?');
assert.equal(mock.__legacyTest.germanLooksValid('Hello world','Hello world'),false);
assert.equal(mock.__legacyTest.germanLooksValid('hotel','Hotel'),true);
const html=read('index.html');
const referenced=new Set([...read('app.js').matchAll(/\$\('([^']+)'\)/g),...read('a1-course.js').matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]));
for(const id of referenced)assert(html.includes('id="'+id+'"'),`Missing DOM element ${id}`);
const allIds=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(allIds.length,new Set(allIds).size,'Duplicate DOM IDs');
for(const filename of ['app.js','lessons.js','phrases.js','a1-course.js','a1-course-data.js','sw.js','styles.css','manifest.webmanifest','icon.svg'])assert(fs.existsSync(new URL(filename,root)),`${filename} missing`);
const sw=read('sw.js');for(const file of ['a1-course.js','a1-course-data.js'])assert(sw.includes(file),`Offline cache missing ${file}`);
assert(html.includes('https://www.goethe.de/en/spr/prf/ueb/pa1.html'));
assert(html.includes('not an official Goethe course'));
console.log(`DeutschDaily checks passed: ${a1.units.length} units, ${a1.units.reduce((n,u)=>n+u.vocab.length,0)} vocabulary entries, 4 exam skills, 6 quick drills, 3 answer positions, accessible IDs and offline cache.`);
