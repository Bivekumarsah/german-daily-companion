/* DeutschDaily language-content integrity audit (not a qualified German/Nepali proofread).
   Validates all local study-bank entries, articles, review tasks and a known spelling correction.
   Run: node scripts/a1-content-qa.mjs -- optional --json for structured output.
   No Goethe book content is reproduced; no user data is accessed. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const context={window:{}};
vm.createContext(context);
for(const name of [
 'a1-course-data.js','a1-themes-data.js','a1-essentials-data.js',
 'a1-grammar-bridge-data.js','productive-guides.js'
])vm.runInContext(read(name),context,{filename:name});
const source=context.window;
const units=source.DEUTSCH_A1.units;
const nouns=source.DEUTSCH_A1_THEME_PACKS;
const essentials=source.DEUTSCH_A1_ESSENTIALS;
const grammar=source.DEUTSCH_A1_GRAMMAR_BRIDGE;
const guides=source.DEUTSCH_PRODUCTIVE_GUIDES;
const findings=[];
const fail=(location,error)=>findings.push({location,error});
function meaningful(value,location){
 if(typeof value!=='string'||value.trim().length===0)fail(location,'missing or blank translation/content');
 else{
  if(value!==value.trim())fail(location,'unexpected leading/trailing whitespace');
  if(value.includes('\uFFFD'))fail(location,'invalid replacement character');
  if(value.includes('undefined')||value.includes('[object Object]'))fail(location,'unresolved data placeholder');
 }
}
function bilingual(de,en,ne,label){
 meaningful(de,label+'.de');meaningful(en,label+'.en');meaningful(ne,label+'.ne');
 if(typeof ne==='string'&&!/[\u0900-\u097F]/u.test(ne))fail(label+'.ne','Nepali Devanagari script missing');
}
const seenUnits=new Set();
for(const unit of units){
 if(seenUnits.has(unit.id))fail(unit.id,'duplicate unit ID');seenUnits.add(unit.id);
 meaningful(unit.title,unit.id+'.title');
 for(const [i,entry] of unit.vocab.entries())bilingual(entry.de,entry.en,entry.ne,unit.id+'.vocab['+i+']');
 const g=unit.grammar;
 bilingual(g.example,g.exampleEn,g.exampleNe,unit.id+'.grammar.example');
 meaningful(g.en,unit.id+'.grammar.English');meaningful(g.ne,unit.id+'.grammar.Nepali');
 for(const key of ['listening','reading']){
  const q=unit[key];
  meaningful(q.text,unit.id+'.'+key+'.text');
  meaningful(q.question,unit.id+'.'+key+'.question');
  if(!Array.isArray(q.choices)||q.choices.length!==3||!Number.isInteger(q.answer)||q.answer<0||q.answer>2)
   fail(unit.id+'.'+key,'invalid 3-answer multiple choice');
 }
 for(const skill of ['writing','speaking']){
  meaningful(unit[skill].prompt,unit.id+'.'+skill+'.prompt');
  meaningful(unit[skill].model,unit.id+'.'+skill+'.model');
 }
 const goals=guides.writingGoals[unit.id];
 if(!Array.isArray(goals)||goals.length<2)fail(unit.id+'.writing','missing task goals');
}
for(const pack of nouns){
 for(const [i,item] of pack.items.entries()){
  const [de,en,ne,plural]=item;
  bilingual(de,en,ne,pack.id+'.nouns['+i+']');
  if(!/^(der|die|das) /u.test(de))fail(pack.id+'.nouns['+i+'].de','noun lacks nominative article');
  if(typeof plural!=='string'||!(plural==='—'||/^die \S/u.test(plural)))
   fail(pack.id+'.nouns['+i+'].plural','plural must be die ... or explicit mass/noncount marker');
 }
}
for(const group of essentials){
 for(const [i,row] of group.items.entries()){
  const [de,en,ne,example,translation]=row;
  const label=group.id+'.essential['+i+']';
  bilingual(de,en,ne,label);
  meaningful(example,label+'.example');
  meaningful(translation,label+'.exampleEnglish');
  if(typeof example==='string'&&!/[.!?]$/u.test(example))fail(label+'.example','example lacks final punctuation');
 }
}
for(const topic of grammar){
 bilingual(topic.tip,topic.en,topic.ne,topic.id+'.grammarTip');
 for(const [i,q] of topic.questions.entries()){
  const [sentence,options,answer,en,ne,feedback]=q;
  bilingual(sentence,en,ne,topic.id+'.question['+i+']');
  meaningful(feedback,topic.id+'.feedback['+i+']');
  if(!sentence.includes('___')||!Array.isArray(options)||options.length!==3||!Number.isInteger(answer)||answer<0||answer>2)
   fail(topic.id+'.question['+i+']','invalid fill-in-the-blank format');
 }
}
const spelling=guides.dialogues['a1-mock-2'][0].turns[1][3];
if(spelling!=='S-H-A-R-M-A.')fail('mock-2.spelling','surname Sharma requires S-H-A-R-M-A, not S-C-H-A-R-M-A');
const report={
 type:'automated-local-integrity-only',
 entries:{units:units.length,unitVocab:units.reduce((n,x)=>n+x.vocab.length,0),
 nounPacks:nouns.length,nounEntries:nouns.reduce((n,x)=>n+x.items.length,0),
 essentialPacks:essentials.length,essentialEntries:essentials.reduce((n,x)=>n+x.items.length,0),
 grammarTopics:grammar.length,grammarQuestions:grammar.reduce((n,x)=>n+x.questions.length,0)},
 spellingSample:spelling,
 errors:findings,
 limitations:[
  'Structural and script checks do not validate German or Nepali semantics.',
  'Noun articles, plurals, grammar and pronunciation need qualified human editors.',
  'This check does not establish Goethe A1 examination readiness.'
 ]
};
if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
else console.log('Local A1 content check: '+Object.entries(report.entries).map(([k,v])=>k+'='+v).join(', '));
console.log('Detected structural/script errors: '+findings.length);
for(const x of findings.slice(0,20))console.error(x.location+': '+x.error);
assert.equal(units.length,36);assert.equal(report.entries.unitVocab,260);
assert.equal(report.entries.nounEntries,100);assert.equal(report.entries.essentialEntries,216);
assert.equal(report.entries.grammarQuestions,36);
assert.deepEqual(findings,[], 'Fix missing or malformed study content before deploying');
