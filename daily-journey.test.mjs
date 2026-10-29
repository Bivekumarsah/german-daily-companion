import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=f=>fs.readFileSync(new URL(f,import.meta.url),'utf8');
class Node{
 constructor(tag='div'){
  this.tag=tag;this.children=[];this.events={};this.attrs={};this.style={};
  this.className='';this._text='';this.hidden=false;this.disabled=false;
 }
 set textContent(s){this._text=String(s);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...arr){this.children.push(...arr)}
 replaceChildren(...arr){this.children=arr}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,fn){this.events[k]=fn}
 click(){if(!this.disabled)this.events.click?.()}
 querySelector(selector){
  assert(selector.startsWith('.'));const cls=selector.slice(1);
  if(this.className.split(' ').includes(cls))return this;
  for(const c of this.children){const a=c.querySelector(selector);if(a)return a;}
  return null;
 }
 findAll(cls){
  const out=[];if(this.className.split(' ').includes(cls))out.push(this);
  for(const child of this.children)out.push(...child.findAll(cls));return out;
 }
 findButton(text){
  const all=(node)=>node.tag==='button'&&node.textContent.includes(text)?node:node.children.map(all).find(Boolean);
  const item=all(this);
  assert(item,'Missing button: '+text+' in '+this.textContent.slice(0,250));
  return item;
 }
}
const root=new Node(),store=new Map(),events={},documentEvents={};
const mock={
 window:{addEventListener:(event,fn)=>{events[event]=fn},DEUTSCH_SPEAKING_RECORDER:{mount:()=>({dispose(){}})}},
 document:{
  createElement:tag=>new Node(tag),
  getElementById:id=>id==='dailyJourneyRoot'?root:null,
  addEventListener:(event,fn)=>{documentEvents[event]=fn},
  dispatchEvent:()=>{}
 },
 Event:class{constructor(type){this.type=type}},
 location:{hash:'#/dashboard'},
 localStorage:{getItem:key=>store.get(key)||null,setItem:(key,v)=>store.set(key,v)},
 console,Date,Set,Map
};
vm.createContext(mock);
for(const f of ['a1-course-data.js','daily-journey-data.js','daily-journey.js']){
 vm.runInContext(read(f),mock,{filename:f});
}
const logic=mock.window.DEUTSCH_DAILY_LOGIC;
const units=mock.window.DEUTSCH_A1.units;
const app=mock.window.DEUTSCH_DAILY_JOURNEY;
assert.equal(units.length,36);
assert.equal(logic.steps.length,6);
assert.equal(logic.steps.reduce((n,s)=>n+s.minutes,0),10);
assert.equal(app.state.step,0);
assert.equal(app.state.unitId,'a1-01');
assert(root.textContent.includes('One small German lesson today'));
const courseState={};
assert.equal(logic.selectUnit(units,courseState).id,'a1-01');
courseState['a1-01']={vocabulary:true,grammar:true,listening:true,reading:true,writing:true,speaking:true};
assert.equal(logic.selectUnit(units,courseState).id,'a1-02');
assert.equal(logic.normalizeSession(units,courseState,null,'2026-10-30').unitId,'a1-02');
assert.equal(logic.normalizeSession(units,courseState,{date:'2026-10-30',unitId:'a1-04',step:3},'2026-10-30').step,3);
const shuffled=logic.questions(units[0],'listening','today');
assert.equal(shuffled.options.length,3);
assert(shuffled.options.some(x=>x.index===shuffled.correct));
assert.equal(new Set(shuffled.options.map(x=>x.label)).size,3);
app.start();
assert(root.textContent.includes('Discover useful words'));
assert.equal(root.findAll('dj-word').length,4);
root.findButton('I studied these words').click();
assert.equal(app.state.step,1);
const question=units[0].listening;
root.findButton(question.choices.find((x,i)=>i!==question.answer)).click();
assert.equal(app.missed,1,'First wrong answer added to review queue');
assert(root.textContent.includes('Not quite'));
root.findButton(question.choices[question.answer]).click();
root.findButton('Next activity').click();
assert.equal(app.state.step,2);
const phrase=units[0].grammar.example.split(/\s+/u);
for(const token of phrase){
 const matches=root.findAll('dj-choice').filter(x=>x.textContent===token&&!x.disabled);
 assert(matches.length>0,'Word builder needs '+token);
 matches[0].click();
}
root.findButton('Check order').click();
assert(root.textContent.includes('Richtig!'));
root.findButton('Continue').click();
assert.equal(app.state.step,3);
const reading=units[0].reading;
root.findButton(reading.choices[reading.answer]).click();
root.findButton('Next activity').click();
assert.equal(app.state.step,4);
assert(root.textContent.includes('Say it yourself'));
root.findButton('I spoke aloud').click();
assert(root.textContent.includes(units[0].speaking.model));
root.findButton('I compared my answer').click();
assert.equal(app.state.step,5);
assert(root.textContent.includes('Review a tricky listening question'),'Prioritizes mistaken listening comprehension');
root.findButton(question.choices[question.answer]).click();
root.findButton('Next activity').click();
assert.equal(app.state.step,6);
assert.equal(app.missed,0,'Successful later recall resolves stored listening mistake');
assert(root.textContent.includes('You practised German today!'));
assert.equal(store.has('deutschdaily-a1-pathway-v1'),false,'Guided practise must never silently change official course progress');
const day=JSON.parse(store.get('deutschdaily-daily-journey-v1'));
assert.equal(day.step,6);assert.equal(day.unitId,'a1-01');
root.findButton('Practise the next unit').click();
assert.equal(app.state.unitId,'a1-02');
assert.equal(app.state.step,0);
assert(root.textContent.includes('Discover useful words'));
const review=logic.recap(units[0],[{unitId:'a1-02',kind:'vocab',value:'Hallo'}],'2026-10-29',units);
assert.equal(review.target.de,'Hallo','Cross-unit mistaken words must be prioritized');
assert.equal(review.options.length,3);
assert.equal(logic.recordMistake([{unitId:'a1-01',kind:'vocab',value:'B'}],{unitId:'a1-01',kind:'vocab',value:'B'},true).length,0);
assert(!/fetch\s*\(/.test(read('daily-journey.js')),'Daily journey must be offline-only');
assert(read('index.html').includes('id="dailyJourneyRoot"'));
assert(read('sw.js').includes('daily-journey.js'));
console.log('Six-step daily learning tests passed: guided 10 minutes, 36-unit selection, listening mistake review, sentence order, reading, speaking, local resume and progress isolation.');
