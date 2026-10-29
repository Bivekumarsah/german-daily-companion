import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class FakeNode{
 constructor(tag='div'){
  this.tag=tag;this.className='';this._text='';this.children=[];
  this.events={};this.attributes={};this.disabled=false;this.hidden=false;
  this.classList={add:klass=>{this.className+=' '+klass;}};
 }
 set textContent(v){this._text=String(v);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...x){this.children.push(...x)}
 replaceChildren(...x){this.children=x}
 setAttribute(k,v){this.attributes[k]=String(v)}
 addEventListener(k,f){this.events[k]=f}
 click(){if(!this.disabled)this.events.click?.()}
 querySelector(sel){
  assert(sel.startsWith('.'));const cls=sel.slice(1);
  if(this.className.split(' ').includes(cls))return this;
  for(const c of this.children){const found=c.querySelector(sel);if(found)return found}
  return null;
 }
}
const words=new FakeNode(),rules=new FakeNode(),audio=[];
const fake={
 window:{speechSynthesis:{getVoices:()=>[{lang:'de-DE',voiceURI:'de-1'}],cancel(){},speak:s=>audio.push(s)}},
 document:{createElement:tag=>new FakeNode(tag),getElementById:id=>id==='a1EssentialsRoot'?words:id==='a1GrammarBridgeRoot'?rules:id==='germanVoice'?{value:'de-1'}:null},
 SpeechSynthesisUtterance:class{constructor(text){this.text=text}},
 console,Set,Map
};
vm.createContext(fake);
for(const path of ['a1-course-data.js','a1-essentials-data.js','a1-grammar-bridge-data.js','a1-bridge.js'])vm.runInContext(read(path),fake,{filename:path});
const vocab=fake.window.DEUTSCH_A1_ESSENTIALS;
const grammar=fake.window.DEUTSCH_A1_GRAMMAR_BRIDGE;
const units=new Set(fake.window.DEUTSCH_A1.units.map(u=>u.id));
assert.equal(fake.window.DEUTSCH_A1_BRIDGE.wordGroups,16);
assert.equal(fake.window.DEUTSCH_A1_BRIDGE.grammarTopics,12);
assert.equal(vocab.length,16);
assert.equal(grammar.length,12);
const ids=new Set(),wordCount=[];
for(const group of vocab){
 assert(!ids.has(group.id),'Each word topic needs a distinct ID');
 ids.add(group.id);
 assert(group.title&&group.items.length===8,'Each topic requires eight expressions');
 for(const w of group.items){
  assert.equal(w.length,5);
  assert(w.every(v=>typeof v==='string'&&v.trim().length>=1));
  wordCount.push(w[0]);
 }
}
assert.equal(wordCount.length,128);
assert.equal(new Set(wordCount.map(v=>v.toLowerCase())).size,128,'No duplicate essential words');
const grammarIds=new Set();
for(const topic of grammar){
 assert(topic.title&&topic.en.length>=40&&topic.ne.length>=25&&topic.tip);
 assert(units.has(topic.unit),'Every workshop must relate to an existing A1 unit');
 assert(!grammarIds.has(topic.id));
 grammarIds.add(topic.id);
 assert.equal(topic.questions.length,3);
 for(const [sentence,choices,correct,en,ne,why] of topic.questions){
  assert(sentence.includes('___'),'Sentence must have fillable blank');
  assert(choices.length===3&&new Set(choices).size===3);
  assert(Number.isInteger(correct)&&correct>=0&&correct<3);
  assert(en&&ne&&why);
  const resolved=sentence.replace('___',choices[correct]);
  assert(!resolved.includes('___'),'Answer fills the complete sentence');
 }
}
const wordTabs=words.querySelector('.a1-bridge-tabs');
const wordCards=words.querySelector('.a1-bridge-cards');
const wordPractice=words.querySelector('.a1-bridge-practice');
const grammarTabs=rules.querySelector('.a1-bridge-tabs');
const grammarPracticeInitial=rules.querySelector('.a1-bridge-practice');
assert(grammarPracticeInitial);
assert(wordTabs&&grammarTabs);
assert.equal(wordTabs.children.length,16);
assert.equal(grammarTabs.children.length,12);
let wordQuestions=0,ruleQuestions=0;
for(let t=0;t<16;t++){
 wordTabs.children[t].click();
 const group=vocab[t];
 const cards=words.querySelector('.a1-bridge-cards');
 assert.equal(cards.children.length,8);
 const controls=cards.children[0].querySelector('.a1-bridge-actions');
 controls.children[0].click();
 assert.equal(audio.at(-1).text,group.items[0][0]);
 controls.children[1].click();
 assert.equal(audio.at(-1).rate,0.68);
 for(let q=0;q<5;q++){
  assert(wordPractice.textContent.includes('Question '+(q+1)+' of 5'));
  const expected=group.items[(q*3)%8][0];
  const options=wordPractice.querySelector('.a1-bridge-choices');
  assert.equal(options.children.length,3);
  const wrong=options.children.find(x=>x.textContent!==expected);
  wrong.click();
  assert(wordPractice.querySelector('.a1-bridge-feedback').textContent.includes('Not quite'));
  const correct=options.children.find(x=>x.textContent===expected);
  assert(correct,'Correct choice must exist');
  correct.click();
  assert(wordPractice.querySelector('.a1-bridge-feedback').textContent.includes('Richtig'));
  assert(wordPractice.querySelector('.a1-bridge-primary'),'Next button unlocked');
  wordPractice.querySelector('.a1-bridge-primary').click();
  wordQuestions++;
 }
 assert(wordPractice.textContent.includes('0 of 5'),'A wrong first try should not count');
}
for(let t=0;t<12;t++){
 grammarTabs.children[t].click();
 const grammarPractice=rules.querySelector('.a1-bridge-practice');
 const topic=grammar[t];
 assert(rules.textContent.includes(topic.en),'English grammar explanation must appear');
 assert(rules.textContent.includes(topic.ne),'Nepali grammar explanation must appear');
 assert(rules.querySelector('.a1-bridge-unit-link').href==='#/course/'+topic.unit);
 for(let q=0;q<3;q++){
  assert(grammarPractice.textContent.includes('Exercise '+(q+1)+' of 3'));
  const [stem,choices,index]=topic.questions[q];
  const opts=grammarPractice.querySelector('.a1-bridge-choices');
  assert.equal(opts.children.length,3);
  opts.children[(index+1)%3].click();
  assert(grammarPractice.querySelector('.a1-bridge-feedback').textContent.includes('Try again'));
  opts.children[index].click();
  const resolved=stem.replace('___',choices[index]);
  assert(grammarPractice.querySelector('.a1-bridge-sentence').textContent===resolved);
  assert(grammarPractice.querySelector('.a1-bridge-feedback').textContent.includes('✓'));
  grammarPractice.querySelector('.a1-bridge-primary').click();
  ruleQuestions++;
 }
 assert(grammarPractice.textContent.includes('0 of 3'),'First-try feedback must be honest');
}
assert.equal(wordQuestions,80);
assert.equal(ruleQuestions,36);
console.log('A1 grammar/essentials checks passed: 128 bilingual cards, 12 grammar workshops, 80 word + 36 rule interactions, German audio and responsive practice controls.');
