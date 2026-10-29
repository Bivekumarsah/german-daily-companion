import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class FakeNode{
 constructor(tag='div'){
  this.tag=tag;this.className='';this.children=[];this.events={};this._text='';
  this.hidden=false;this.disabled=false;this.checked=false;this.value='';
 }
 set textContent(s){this._text=String(s);this.children=[]}
 get textContent(){return this._text+this.children.map(v=>v.textContent).join('')}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 addEventListener(k,f){this.events[k]=f}
 setAttribute(){}
 click(){if(!this.disabled)this.events.click?.()}
 querySelector(cls){if(!cls.startsWith('.'))throw Error('Only class selectors');
  if(this.className.split(' ').includes(cls.slice(1)))return this;
  for(const n of this.children){const x=n.querySelector(cls);if(x)return x;}return null;}
}
const values=new Map();
const context={
 window:{},document:{createElement:tag=>new FakeNode(tag)},
 localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)},
 navigator:{},console,Set,Map
};
vm.createContext(context);
for(const file of ['a1-course-data.js','productive-guides.js','speaking-reflection-data.js','writing-hints.js','productive-coach.js'])
 vm.runInContext(read(file),context,{filename:file});
const unitData=context.window.DEUTSCH_A1.units;
const guide=context.window.DEUTSCH_PRODUCTIVE_GUIDES;
const coach=context.window.DEUTSCH_PRODUCTIVE_COACH;
assert.equal(unitData.length,36);
assert.equal(Object.keys(guide.writingGoals).length,36);
assert.equal(coach.wordCount('Ich heiße Anna.'),3);
assert.equal(coach.wordCount('Ich wohne in Köln.'),4);
for(const unit of unitData){
 const goals=guide.writingGoals[unit.id];
 assert(goals&&goals.length>=2,'Task-specific writing goals for '+unit.id);
 const host=new FakeNode(),editor=new FakeNode('textarea');
 coach.addWriting(host,editor,{key:unit.id,goals});
 assert(host.querySelector('.productive-checklist').children.length===goals.length+1);
 assert(host.textContent.includes('0 German words'));
 editor.value=unit.writing.model;
 editor.events.input();
 assert(host.textContent.includes('German words'));
 assert(host.querySelector('.productive-language-hints'),'Bilingual guidance container should be present');
 if(unit.id==='a1-03'){
  editor.value='Ich habe 20 Jahre alt.';editor.events.input();
  assert(host.querySelector('.productive-language-hints').textContent.includes('Ich bin 20 Jahre alt.'),'Age correction example shown');
  editor.value='Ich bin 20 Jahre alt.';editor.events.input();
  assert(host.querySelector('.productive-language-hints').textContent.includes('No supported common patterns detected'),'Correct example not flagged');
  editor.value=unit.writing.model;editor.events.input();
 }
 const checks=host.querySelector('.productive-checklist').children.slice(1);
 for(const item of checks){item.children[0].checked=true;item.children[0].events.change();}
 assert(host.querySelector('.productive-review').textContent.includes('All goals checked'));
 if(unit.id==='a1-03'){
  const save=host.querySelector('.productive-actions').children[0];
  save.click();
  assert(values.get('deutschdaily-draft-a1-03')===unit.writing.model);
  const nextHost=new FakeNode(),nextEditor=new FakeNode('textarea');
  coach.addWriting(nextHost,nextEditor,{key:unit.id,goals});
  assert.equal(nextEditor.value,unit.writing.model,'Explicitly saved draft should restore locally');
  const remove=nextHost.querySelector('.productive-actions').children[1];remove.click();
  assert(!values.has('deutschdaily-draft-a1-03'));
 }
}
assert.equal(Object.keys(guide.dialogues).length,2);
const cueData=context.window.DEUTSCH_SPEAKING_CUES;
assert.equal(Object.keys(cueData).length,2,'All mock speaking sets need specific cue coverage');
let interactions=0;
for(const setId of ['a1-mock-1','a1-mock-2']){
 assert.equal(guide.dialogues[setId].length,3);
 for(let taskIndex=0;taskIndex<3;taskIndex++){
  const host=new FakeNode(),spoken=[];
  coach.addSpeaking(host,{setId,taskIndex,speak:(s,slow)=>spoken.push({s,slow})});
  assert(host.querySelector('.productive-count').textContent.includes('Turn 1 of 3'));
  for(let turn=0;turn<3;turn++){
   const question=guide.dialogues[setId][taskIndex].turns[turn];
   const specific=cueData[setId][taskIndex][turn];
   assert(specific.length===3&&specific.every(s=>s.length>8),'Every dialogue turn needs English, Nepali and a German pattern');
   assert(/[\u0900-\u097F]/u.test(specific[1]),'Nepali guidance is required');
   const panel=host.querySelector('.productive-turn');
   assert(panel.querySelector('.productive-transcript').hidden,'German prompt text hidden initially');
   const actions=panel.querySelector('.productive-actions');
   actions.children[0].click();assert.equal(spoken.at(-1).s,question[0]);
   actions.children[1].click();assert(spoken.at(-1).slow===true);
   const readText=panel.children.find(n=>n.textContent==='Read the partner’s words');
   readText.click();
   assert(!panel.querySelector('.productive-transcript').hidden);
   const typed=panel.querySelector('.productive-reflection-input');
   assert(typed&&typed.maxLength===320,'Per-turn optional text reflection remains bounded and separate from recording');
   typed.value='Ich habe 20 Jahre alt.';
   const confirmed=panel.children.find(n=>n.textContent==='✓ I answered aloud');
   confirmed.click();
   const example=panel.querySelector('.productive-example');
   assert(example&&example.textContent.includes(question[3]),'Model only after self-confirmation');
   assert(example.querySelector('.productive-speaking-goal').textContent.includes(specific[0]));
   assert(example.querySelector('.productive-spoken-review').textContent.includes('Ich bin 20 Jahre alt.'),
    'Typed reflection receives only existing narrow rule-based reminders, not a score');
   panel.children.at(-1).click();
   interactions++;
  }
  assert(host.querySelector('.productive-finished').textContent.includes('three conversation turns'));
  host.querySelector('.productive-primary').click();
  assert(host.querySelector('.productive-count').textContent.includes('Turn 1 of 3'),'Restart all three turns');
 }
}
assert.equal(interactions,18);
assert(!read('productive-coach.js').includes('fetch('),'Coach must never upload student text');
assert(!read('productive-coach.js').includes('localStorage.setItem(safeKey+'),'Speaking reflection must not be stored');
assert(!read('speaking-reflection-data.js').includes('fetch('),'Scenario cues stay available offline');
assert(!read('productive-coach.js').includes('getUserMedia'),'Coach does not activate microphone');
const html=read('index.html');
for(const f of ['productive-guides.js','productive-coach.js','productive-coach.css'])assert(html.includes(f));
assert(html.indexOf('src="productive-guides.js"')<html.indexOf('src="productive-coach.js"'));
assert(html.indexOf('src="productive-coach.js"')<html.indexOf('src="a1-mock.js"'));
assert(html.indexOf('src="productive-coach.js"')<html.indexOf('src="a1-course.js"'));
assert(read('sw.js').includes('productive-coach.js'));
console.log('Productive A1 tests passed: 36 tailored writing guides, optional local drafts, 6 trilingual dialogues/18 turns, hidden prompt transcripts, audio/replay and offline privacy.');
