import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class Node {
  constructor(tag='div'){
    this.tag=tag;this.children=[];this.events={};this.attributes={};
    this.hidden=false;this.disabled=false;this.className='';this._text='';
    this.classList={add:name=>this.className+=' '+name};
  }
  set textContent(v){this._text=String(v);this.children=[]}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
  append(...nodes){this.children.push(...nodes)}
  replaceChildren(...nodes){this.children=nodes}
  setAttribute(k,v){this.attributes[k]=String(v)}
  addEventListener(k,fn){this.events[k]=fn}
  click(){if(!this.disabled)this.events.click?.()}
  querySelector(selector){
    assert(selector.startsWith('.'));
    if(this.className.split(' ').includes(selector.slice(1)))return this;
    for(const c of this.children){const n=c.querySelector(selector);if(n)return n}
    return null;
  }
}
const mock={window:{},document:{createElement:tag=>new Node(tag)}};
vm.createContext(mock);
for(const filename of ['a1-course-data.js','visual-stories.js','listening-lab.js','visual-lab.js']){
 vm.runInContext(read(filename),mock,{filename});
}
const d=mock.window.DEUTSCH_A1,visual=mock.window.DEUTSCH_VISUAL_LAB;
const listening=mock.window.DEUTSCH_LISTENING_LAB;
assert.equal(d.units.length,36);
assert.equal(listening.render(new Node(),null,[],()=>{}),false);
assert.equal(listening.render(new Node(),{id:'test'},[['a','a','same','क'],['b','b','same','क'],['c','c','other','क']],()=>{}),false);
let wordsAnswered=0,mistakes=0;
for(const unit of d.units){
 const scene=visual.sceneFor(unit);
 assert(scene,'Scene must exist: '+unit.id);
 const host=new Node(),spoken=[];
 assert.equal(listening.render(host,unit,scene.items,(word,slow)=>spoken.push({word,slow})),true);
 const ear=host.querySelector('.visual-lab-ears');
 assert(ear);
 assert.equal(ear.tag,'details');
 const controls=ear.querySelector('.visual-lab-turn-actions');
 const choices=ear.querySelector('.visual-lab-options');
 const report=ear.querySelector('.visual-lab-feedback');
 const progress=ear.querySelector('.visual-lab-ear-progress');
 const reveal=ear.querySelector('.visual-lab-ear-reveal');
 const next=ear.querySelector('.visual-lab-ear-next');
 const targetOrder=[1,2,0];
 const answerPositions=[];
 for(let round=0;round<3;round++){
  const expected=scene.items[targetOrder[round]];
  assert(progress.textContent.includes((round+1)+' of 3'),unit.id+' round '+round);
  assert.equal(choices.children.length,3);
  assert.equal(reveal.hidden,true,'Transcript must be hidden before answer');
  // The displayed options are English only, not the German answer.
  assert(choices.children.every(n=>scene.items.some(item=>item[2]===n.textContent)));
  controls.children[0].click();
  controls.children[1].click();
  assert.equal(spoken.at(-2).word,expected[1]);
  assert.equal(spoken.at(-2).slow,false);
  assert.equal(spoken.at(-1).slow,true);
  answerPositions.push(choices.children.findIndex(n=>n.textContent===expected[2]));
  if(round===0&&Number(unit.number)%2===0){
   const wrong=choices.children.find(n=>n.textContent!==expected[2]);
   wrong.click();
   assert(report.textContent.includes('Not quite'),unit.id+' wrong answer should explain');
   mistakes++;
  }else{
   choices.children.find(n=>n.textContent===expected[2]).click();
   assert(report.textContent.includes('Correct!'),unit.id+' correct answer should explain');
  }
  assert(!reveal.hidden,'German transcript must reveal after choosing');
  assert(reveal.textContent.includes(expected[1]));
  assert(reveal.textContent.includes(expected[3]),'Nepali explanation must appear after choosing');
  assert(choices.children.every(n=>n.disabled),'All answer buttons must lock');
  assert(!next.hidden);
  next.click();
  wordsAnswered++;
 }
 assert.equal(new Set(answerPositions).size,3,'Correct answer location must rotate across three rounds');
 assert(progress.textContent.includes('complete'));
 assert(controls.hidden);
 const expectedScore=Number(unit.number)%2===0?2:3;
 assert(report.textContent.includes(expectedScore+' of 3'));
 next.click();
 assert(!controls.hidden,'Replay must restore listening buttons');
 assert(progress.textContent.includes('1 of 3'));
 assert(reveal.hidden);
 assert.equal(choices.children.length,3);
}
assert.equal(wordsAnswered,108);
assert.equal(mistakes,18);
console.log('Three-round A1 listening checks passed: 36 units, 108 items, '+mistakes+' deliberate mistakes, answer-position variation, transcript hiding, slow speech and replay.');
