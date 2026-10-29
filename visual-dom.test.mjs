import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
class FakeNode {
  constructor(tag='div') {
    this.tag=tag; this.children=[]; this.events={}; this.attributes={};
    this.hidden=false; this.disabled=false; this.type=''; this.className=''; this._text='';
    this.classList={add:c=>{this.className+=' '+c},remove:c=>{this.className=this.className.split(' ').filter(v=>v!==c).join(' ')}};
  }
  set textContent(value) {this._text=String(value);this.children=[]}
  get textContent() {return this._text+this.children.map(x=>x.textContent).join('')}
  append(...nodes) {this.children.push(...nodes)}
  replaceChildren(...nodes) {this.children=nodes}
  setAttribute(key,value) {this.attributes[key]=String(value)}
  addEventListener(event,callback) {this.events[event]=callback}
  click() {if(!this.disabled)this.events.click?.()}
  scrollIntoView() {this.scrolled=true}
  querySelector(selector) {
    const classname=selector.slice(1);
    if(!selector.startsWith('.'))throw new Error('Unsupported query '+selector);
    if(this.className.split(' ').includes(classname))return this;
    for(const child of this.children){const found=child.querySelector(selector);if(found)return found}
    return null;
  }
}
const mock={window:{},document:{createElement:tag=>new FakeNode(tag)}};
vm.createContext(mock);
for(const filename of ['visual-stories.js','visual-lab.js'])
  vm.runInContext(read(filename),mock,{filename});
const scenes=mock.window.DEUTSCH_VISUAL_LAB.scenes;
const stories=mock.window.DEUTSCH_VISUAL_STORIES;
assert.equal(Object.keys(stories).length,8);
assert.deepEqual(Object.keys(scenes).sort(),Object.keys(stories).sort());
const texts=new Set();
for(const [id,scene] of Object.entries(scenes)){
  const story=stories[id];
  assert.equal(story.turns.length,3);
  assert(story.scene&&story.goal);
  for(const t of story.turns){
    assert.equal(t.length,6);
    assert(t.every(x=>typeof x==='string'&&x.trim().length>0));
    texts.add(t[1]);
  }
  const host=new FakeNode(),spoken=[];
  assert.equal(mock.window.DEUTSCH_VISUAL_LAB.render(host,{id,number:Number(id.slice(3))},(text,slow)=>spoken.push({text,slow})),true);
  const lab=host.querySelector('.visual-lab');
  assert(lab,'Lab must be rendered');
  const cards=lab.querySelector('.visual-lab-cards');
  assert.equal(cards.children.length,3);
  cards.children[0].click();
  assert.equal(spoken[0].text,scene.items[0][1]);
  const storyEl=lab.querySelector('.visual-lab-conversation');
  assert.equal(storyEl.children.length,3);
  const controls=storyEl.children[0].querySelector('.visual-lab-turn-actions');
  controls.children[0].click();
  controls.children[1].click();
  assert.equal(spoken.at(-2).slow,false);
  assert.equal(spoken.at(-1).slow,true);
  controls.children[2].click();
  assert(storyEl.children[0].querySelector('.visual-lab-meaning').hidden,'Meanings must toggle');
  controls.children[2].click();
  assert(!storyEl.children[0].querySelector('.visual-lab-meaning').hidden,'Meanings must reappear');
  const title=lab.querySelector('.visual-lab-practice-title');
  const options=lab.querySelector('.visual-lab-options');
  const feedback=lab.querySelector('.visual-lab-feedback');
  const next=lab.querySelector('.visual-lab-next');
  // Test a wrong guess before finding the answer, and ensure it cannot be clicked again.
  const incorrect=options.children.find(x=>x.textContent!==scene.items[0][1]);
  incorrect.click();
  assert(incorrect.disabled);
  assert(feedback.textContent.includes('try another'));
  for(let i=0;i<scene.items.length;i++){
    const answer=options.children.find(x=>x.textContent===scene.items[i][1]);
    assert(answer,'German choice should be present');
    answer.click();
    assert(!next.hidden,'Next should unlock after correct answer');
    next.click();
  }
  assert(title.textContent.includes('completed'));
  assert(lab.querySelector('.visual-lab-question').textContent.includes('2 of 3'),'One deliberate mistake must reduce first-try count');
  next.click();
  assert(title.textContent.includes('1 of 3'),'Repeat should reset the challenge');
}
assert(texts.size>=20);
const nonexistent=new FakeNode();
assert.equal(mock.window.DEUTSCH_VISUAL_LAB.render(nonexistent,{id:'a1-99'},()=>{}),false);
console.log('Visual dialogue checks passed: 8 scenes, 24 conversation turns, audio/slow actions, translation toggles, wrong-answer feedback, challenge completion and replay.');
