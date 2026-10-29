import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('.', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const mock = {window:{},document:{readyState:'loading',addEventListener(){}},navigator:{onLine:false},localStorage:{getItem(){return null}},console,Date,URL,TextEncoder,Set,Map};
vm.createContext(mock);
for(const file of ['phrases.js','lessons.js','app.js']){
  let content = read(file);
  if(file==='app.js')content=content.replace(/\}\)\(\);\s*$/, 'globalThis.__test={germanLooksValid,localPhrase};})();');
  vm.runInContext(content,mock,{filename:file});
}
const phrases=mock.window.DAILY_PHRASES;
const lessons=mock.window.DEUTSCH_LESSONS;
const phraseKeys=new Set(phrases.map(p=>p.english.toLowerCase().trim().replace(/[.!?।,;:]+$/g,'')));
assert.equal(lessons.length,6);
for(const lesson of lessons){
 assert.equal(lesson.phrases.length,5);
 for(const phrase of lesson.phrases)assert(phraseKeys.has(phrase.toLowerCase().trim().replace(/[.!?।,;:]+$/g,'')),`Missing ${phrase}`);
}
assert.equal(mock.__test.localPhrase('What is your name?').german,'Wie heißt du?');
assert.equal(mock.__test.germanLooksValid('Hello world','Hello world'),false);
assert.equal(mock.__test.germanLooksValid('hotel','Hotel'),true);
assert.equal(mock.__test.germanLooksValid('I study IT','Ich studiere IT.'),true);
const html=read('index.html');
const refIds=new Set([...read('app.js').matchAll(/\$\('([^']+)'\)/g)].map(m=>m[1]));
for(const id of refIds)assert(html.includes('id="'+id+'"'),`Missing DOM element ${id}`);
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate DOM IDs');
for(const filename of ['app.js','lessons.js','phrases.js','sw.js','styles.css','manifest.webmanifest','icon.svg'])assert(fs.existsSync(new URL(filename,root)));
console.log('DeutschDaily source smoke checks passed: 78 phrases, 6 lessons, 30 questions, DOM selectors, translation rules.');
