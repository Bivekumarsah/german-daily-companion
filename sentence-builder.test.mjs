import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8');
class MockNode {
  constructor(tag='div') {
    this.tag=tag;this.children=[];this.events={};this.attributes={};
    this.dataset={};this.hidden=false;this.disabled=false;this._text='';
    this.className='';this.type='';this.lang='';
  }
  set textContent(text){this._text=String(text);this.children=[]}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join('')}
  append(...children){this.children.push(...children)}
  replaceChildren(...children){this.children=children}
  addEventListener(name,callback){this.events[name]=callback}
  setAttribute(name,value){this.attributes[name]=String(value)}
  click(){if(!this.disabled)this.events.click?.()}
  querySelector(selector){
    const klass=selector.startsWith('.')?selector.slice(1):null;
    if(!klass)throw new Error('Unsupported selector: '+selector);
    if(this.className.split(' ').includes(klass))return this;
    for(const child of this.children){const found=child.querySelector(selector);if(found)return found}
    return null;
  }
}
const testContext={window:{},document:{createElement:tag=>new MockNode(tag)}};
vm.createContext(testContext);
for(const filename of ['a1-course-data.js','sentence-builder.js'])
 vm.runInContext(read(filename),testContext,{filename});
const builder=testContext.window.DEUTSCH_SENTENCE_BUILDER;
const units=testContext.window.DEUTSCH_A1.units;
assert.equal(units.length,36);
assert.equal(builder.render(new MockNode(),null,()=>{}),false);
assert.equal(builder.render(new MockNode(),{grammar:{example:'Hi'}},()=>{}),false);
assert.deepEqual(Array.from(builder.tokensOf('  Guten Tag!  ')),['Guten','Tag!']);
assert.deepEqual(Array.from(builder.tokensOf('')),[]);
let total=0,positive=0,negative=0;
for(const unit of units){
 const tokens=Array.from(builder.tokensOf(unit.grammar.example));
 assert(tokens.length>=3&&tokens.length<=18,'Valid word-count '+unit.id);
 const seeded=builder.mixTokens(tokens,unit.id);
 assert.equal(seeded.length,tokens.length);
 assert.equal(new Set(Array.from(seeded,x=>x.index)).size,tokens.length,'Unique source IDs');
 if(tokens.length>1)assert(!seeded.every((x,i)=>x.index===i),'Shuffled order should differ');
 const parent=new MockNode(),audio=[];
 assert.equal(builder.render(parent,unit,(sentence,slow)=>audio.push([sentence,slow])),true,unit.id);
 const lab=parent.querySelector('.sentence-builder');
 assert(lab,'Missing word order lab '+unit.id);
 const bank=lab.querySelector('.sb-bank'),built=lab.querySelector('.sb-built');
 assert.equal(bank.children.length,tokens.length);
 assert(lab.querySelector('.sb-english').textContent.length);
 assert(lab.querySelector('.sb-nepali').textContent.length);
 const listen=lab.querySelector('.sb-actions');
 listen.children[0].click();
 listen.children[1].click();
 assert.equal(audio.length,2);
 assert.equal(audio[0][0],unit.grammar.example);
 assert.equal(audio[0][1],false);
 assert.equal(audio[1][1],true);
 const check=lab.querySelector('.sb-check'),feedback=lab.querySelector('.sb-feedback');
 const controls=lab.querySelector('.sb-controls');
 const undo=controls.children[1],reset=controls.children[2],show=controls.children[3];
 assert(check.disabled,'Cannot check an incomplete sentence');
 const findSource=(i)=>bank.children.find(b=>Number(b.dataset.wordIndex)===i);
 // Wrong attempt: add last word first, then the others.
 for(const index of [tokens.length-1,...Array.from({length:tokens.length-1},(_,i)=>i)]){
   const word=findSource(index);assert(word,'Source word missing '+unit.id);
   word.click();
 }
 assert(!check.disabled);
 check.click();
 assert(feedback.textContent.includes('Not quite'),'Bad word order must not pass '+unit.id);
 assert.equal(show.hidden,false,'Reveal becomes available after a failed attempt');
 negative++;
 show.click();
 assert.equal(lab.querySelector('.sb-answer').hidden,false);
 reset.click();
 assert.equal(built.children.length,1,'Reset empties the sentence');
 assert(check.disabled);
 findSource(0).click();
 assert.equal(built.children.length,1);
 undo.click();
 assert.equal(built.children.length,1,'Undo must clear first word');
 for(let i=0;i<tokens.length;i++)findSource(i).click();
 assert.equal(built.children.length,tokens.length);
 assert.equal(check.disabled,false);
 check.click();
 assert(feedback.textContent.includes('Richtig'),'Correct sequence must pass '+unit.id);
 assert.equal(lab.querySelector('.sb-answer').hidden,false);
 assert(check.disabled);
 reset.click();
 assert(check.disabled);
 assert(!findSource(0).disabled);
 total++;positive++;
}
console.log('Sentence builder checks passed: '+total+' A1 units, '+positive+' successful solutions, '+negative+' incorrect-answer retries, normal/slow audio, undo/reset and bilingual prompts.');
