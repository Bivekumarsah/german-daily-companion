import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class Node {
 constructor(tag='div'){
  this.tag=tag;this.children=[];this.attributes={};this.events={};this._text='';
  this.hidden=false;this.disabled=false;this.className='';this.value='';this.dataset={};this.style={};
  this.classList={add:n=>this.className+=' '+n};
 }
 set textContent(v){this._text=String(v);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=items}
 setAttribute(k,v){this.attributes[k]=String(v)}
 addEventListener(k,f){this.events[k]=f}
 click(){if(!this.disabled)this.events.click?.()}
 querySelector(sel){assert(sel.startsWith('.'));const cls=sel.slice(1);
  if(this.className.split(' ').includes(cls))return this;
  for(const child of this.children){const match=child.querySelector(sel);if(match)return match}return null;}
}
const root=new Node();
const spoken=[];
const context={
 window:{speechSynthesis:{getVoices:()=>[{voiceURI:'de',lang:'de-DE'}],cancel(){},speak:utter=>spoken.push(utter)}},
 document:{getElementById:id=>id==='a1MockRoot'?root:id==='germanVoice'?{value:'de'}:null,createElement:tag=>new Node(tag)},
 SpeechSynthesisUtterance:class{constructor(text){this.text=text}},
 setInterval:()=>1,clearInterval:()=>{},Date,console,Set,Map
};
vm.createContext(context);
vm.runInContext(read('a1-mock-data.js'),context,{filename:'a1-mock-data.js'});
const sets=context.window.DEUTSCH_A1_MOCK_SETS;
assert.equal(sets.length,2,'Two independently authored practice sets');
const seenScripts=new Set(),seenReading=new Set();
for(const mock of sets){
 assert(mock.id&&mock.title);
 assert.equal(mock.listening.length,15,'15 listening questions in '+mock.id);
 assert.equal(mock.reading.length,15,'15 reading questions in '+mock.id);
 assert.equal(mock.writing.length,2,'Two writing tasks in '+mock.id);
 assert.equal(mock.speaking.length,3,'Three speaking tasks in '+mock.id);
 const listeningKinds=new Set(),readingKinds=new Set();
 for(const kind of ['listening','reading']){
  const questions=mock[kind];
  const seen=kind==='listening'?seenScripts:seenReading;
  for(const [i,q] of questions.entries()){
   assert(q.length===5&&q.every(x=>x!==null&&x!==undefined),kind+' valid fields '+i);
   assert(q[0].length>=24&&q[1].length>=12,'Sufficient original context');
   assert.equal(q[2].length,3,'Three answer choices');
   assert.equal(new Set(q[2].map(x=>x.toLowerCase())).size,3,'No duplicate choices');
   assert(Number.isInteger(q[3])&&q[3]>=0&&q[3]<3,'Correct answer index');
   assert(!seen.has(q[0]),'No duplicate German passages across practice sets');
   seen.add(q[0]);
   (kind==='listening'?listeningKinds:readingKinds).add(q[4]);
  }
 }
 assert(listeningKinds.size>=3,'Mixed audio scenarios');
 assert(readingKinds.size>=3,'Mixed everyday written formats');
 for(const task of [...mock.writing,...mock.speaking]){
  assert(task.title&&task.prompt&&task.model&&task.tips.length>=2);
 }
 for(const task of mock.writing){
  assert(['form','message'].includes(task.type));
  if(task.type==='form')assert.equal(task.fields.length,5);
 }
}
assert.equal(seenScripts.size,30);
assert.equal(seenReading.size,30);
vm.runInContext(read('a1-mock.js'),context,{filename:'a1-mock.js'});
assert.equal(context.window.DEUTSCH_A1_MOCK.countSets,2);
const sections=root.querySelector('.a1-mock-skills');
const setChoices=root.querySelector('.a1-mock-sets');
assert.equal(sections.children.length,4);
assert.equal(setChoices.children.length,2);
const content=root.querySelector('.a1-mock-content');
// No German transcript revealed in listening until section submission.
for(let mockIndex=0;mockIndex<2;mockIndex++){
 if(mockIndex)setChoices.children[mockIndex].click();
 for(const skill of ['listening','reading']){
  sections.children[skill==='listening'?0:1].click();
  const questions=sets[mockIndex][skill];
  for(let i=0;i<questions.length;i++){
   assert(content.textContent.includes('Question '+(i+1)+' of 15'));
   assert.equal(content.querySelector('.a1-mock-options').children.length,3);
   if(skill==='listening'){
     assert(!content.textContent.includes(questions[i][0]),'Listening transcript concealed until submit');
     content.querySelector('.a1-mock-audio').children[0].click();
     assert.equal(spoken.at(-1).text,questions[i][0]);
     if(i===0){content.querySelector('.a1-mock-audio').children[1].click();assert.equal(spoken.at(-1).rate,0.7);}
   }else{
     assert(content.querySelector('.a1-mock-passage').textContent.includes(questions[i][0]));
   }
   const selected=i===0?(questions[i][3]+1)%3:questions[i][3];
   content.querySelector('.a1-mock-options').children[selected].click();
   if(i===14)content.querySelector('.a1-mock-navigation').children[1].click();
   else content.querySelector('.a1-mock-navigation').children[1].click();
  }
  const result=content.querySelector('.a1-mock-result');
  assert(result,'Submitted section should display self-check');
  assert(result.textContent.includes('14 / 15'),'Only correct MCQ answers count');
  assert(result.querySelector('.a1-mock-breakdown').textContent.includes('Practice feedback by text type'));
  assert(result.querySelector('.a1-mock-breakdown').textContent.includes('Suggested next practice'));
  assert(result.textContent.includes('not a Goethe examination grade'));
  assert(result.querySelector('.a1-mock-review'),'Answer review is available');
 }
 const skills=[...sections.children];
 skills[2].click(); // Writing
 assert(content.textContent.includes('Task 1 of 2'));
 const form=content.querySelector('.a1-mock-form');
 assert(form&&form.children.length===5);
 const sample=content.querySelector('.a1-mock-model');
 assert(sample.hidden,'Writing example initially hidden');
 content.querySelector('.a1-mock-primary').click();
 assert(!sample.hidden,'Writing example reveals on user action');
 content.querySelector('.a1-mock-navigation').children[1].click();
 assert(content.querySelector('.a1-mock-textarea'),'Second writing task is email/message');
 skills[3].click(); // Speaking
 assert(content.textContent.includes('Task 1 of 3'));
 assert(content.textContent.includes('Speak your answer aloud first'));
 assert(content.querySelector('.a1-mock-model').hidden);
}
console.log('A1 mock tests passed: 2 original sets, 60 unique graded MCQs (15 listening + 15 reading each), writing forms/messages, 6 speaking tasks, hidden listening scripts and honest feedback.');
