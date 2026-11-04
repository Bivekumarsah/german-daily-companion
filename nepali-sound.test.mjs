import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read = filename => fs.readFileSync(new URL(filename,import.meta.url),'utf8');
const context={window:{},console,Map,Set};
vm.createContext(context);
for(const file of ['phrases.js','a1-course-data.js','nepali-sound.js']){
 vm.runInContext(read(file),context,{filename:file});
}
const helper=context.window.DEUTSCH_NEPALI_SOUND;
const syllabus=context.window.DEUTSCH_A1;
assert(helper&&typeof helper.guide==='function','Shared Nepali pronunciation module must load');
assert.equal(helper.uniqueCourseCount,244,'A1 core lexical sound bank must cover exactly 244 distinct entries');
const words=new Map(syllabus.units.flatMap(u=>u.vocab).map(w=>[w.de.toLocaleLowerCase('de-DE'),w]));
assert.equal(words.size,244,'Check the number of unique original course vocabulary strings');
for(const word of words.values()){
 const pron=helper.guide(word.de);
 assert.equal(pron.source,'authored','Original A1 word lacks an authored Nepali sound aid: '+word.de);
 assert.match(pron.nepali,/[\u0900-\u097F]/u,'No Devanagari sound text for '+word.de);
 assert.notEqual(pron.nepali,word.ne,'Nepali SOUND must not be confused with Nepali MEANING for '+word.de);
}
const sample=helper.guide('Wie geht es dir?');
assert.equal(sample.nepali,'वी गेट एस डियर');
assert.equal(sample.source,'authored');
assert.equal(helper.guide('Hallo!').nepali,'हालो');
assert.equal(helper.guide('Guten Tag!').nepali,'गूटन टाक');
assert.equal(helper.guide('Wie heißt du?').nepali,'वी हाइस्ट डू');
assert.equal(helper.guide('Ich lerne Deutsch.').nepali,'इख लेर्ने डोइच.');
const novel=helper.guide('Fantasiewortxyz');
assert.equal(novel.source,'estimated','Unknown German should never be labeled as curated');
assert.match(novel.nepali,/[\u0900-\u097F]/u);
assert(!helper.guide('').nepali);
const html=read('index.html'),sw=read('sw.js');
for(const file of ['nepali-sound.js','nepali-sound.css']){
 assert(html.includes(file),'Missing HTML asset '+file);
 assert(sw.includes(file),'Offline precache missing '+file);
}
assert(html.indexOf('src="a1-course-data.js"')<html.indexOf('src="nepali-sound.js"'),'Course data before phonetics');
assert(html.indexOf('src="nepali-sound.js"')<html.indexOf('src="app.js"'),'Phonetics before translator and course rendering');
assert(read('app.js').includes('window.DEUTSCH_NEPALI_SOUND?.guide(data.german)'),'Translator must expose Nepali script even for new text');
const moduleText=read('nepali-sound.js');
for(const excluded of ['#a1MockRoot','#a1ExamContent','#lessonOptions','.dj-choices']){
 assert(moduleText.includes(excluded),'No-hints exam/answer guard missing: '+excluded);
}
console.log('Nepali-script pronunciation checks passed for all 244 A1 core words, known phrases, online fallback, translation, exam safeguards and offline assets.');
