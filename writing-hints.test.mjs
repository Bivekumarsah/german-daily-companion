import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const read=(path)=>fs.readFileSync(new URL(path,import.meta.url),'utf8');
const scope={window:{},console};
vm.createContext(scope);
vm.runInContext(read('writing-hints.js'),scope,{filename:'writing-hints.js'});
const tool=scope.window.DEUTSCH_WRITING_HINTS;
assert(tool && tool.ruleCount===7);
const flagged=[
 ['Ich bist Student.','sein-ich'],
 ['ich sind müde.','sein-ich'],
 ['Du bin Student.','sein-du'],
 ['Er bin Lehrer.','sein-third'],
 ['Ich habe 20 Jahre alt.','age'],
 ['Ich habe zwanzig Jahre alt.','age'],
 ['Ich habe müde.','feeling'],
 ['Ich komme von Nepal.','origin-nepal'],
 ['Ich kann sprechen Deutsch.','modal-order']
];
for(const [input,id] of flagged)assert(tool.analyze(input).some(x=>x.id===id),'Missing A1 hint for '+id);
assert(tool.analyze('ich lerne Deutsch.').some(x=>x.id==='capital-start'));
assert(tool.analyze('Ich lerne heute Deutsch').some(x=>x.id==='ending-punctuation'));
const valid=[
 'Ich bin 20 Jahre alt.',
 'Ich bin müde.',
 'Ich komme aus Nepal.',
 'Ich kann Deutsch sprechen.',
 'Ich habe 20 Jahre Erfahrung.',
 'Ich habe Hunger.',
 'Du bist sehr freundlich.',
 'Ich wohne in Kathmandu.',
 'Ich lerne Deutsch.',
 'Liebe Anna, ich komme morgen. Liebe Grüße!'
];
for(const phrase of valid)assert.equal(tool.analyze(phrase).length,0,'Avoid false positive on valid example: '+phrase);
assert.equal(tool.analyze('').length,0,'No hints for empty draft');
assert(tool.analyze('Ich habe 20 Jahre alt').length<=5,'Limit hints for cognitive load');
for(const h of tool.analyze('ich habe 20 Jahre alt')){
 assert(h.en && h.ne && h.example && h.id,'Every hint includes original trilingual content');
}
assert(!/fetch\s*\(/.test(read('writing-hints.js')),'No internet upload');
assert(!/getUserMedia\s*\(/.test(read('writing-hints.js')),'No microphone access');
const html=read('index.html');
assert(html.indexOf('src="writing-hints.js"')<html.indexOf('src="productive-coach.js"'));
assert(read('sw.js').includes('writing-hints.js'));
console.log('A1 writing feedback checks passed: 7 rules, 9 triggered examples, 10 valid non-hits, trilingual output, privacy, offline script order.');
