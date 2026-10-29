import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class Node {
 constructor(tag='div'){
  this.tag=tag;this.children=[];this.events={};this.attributes={};this._text='';
  this.hidden=false;this.disabled=false;this.className='';this.value='';this.style={};this.dataset={};
  this.classList={add:n=>this.className+=' '+n};
 }
 set textContent(v){this._text=String(v);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=els}
 setAttribute(name,value){this.attributes[name]=String(value)}
 addEventListener(event,cb){this.events[event]=cb}
 click(){if(!this.disabled)this.events.click?.()}
 focus(){this.focused=true}
 querySelector(selector){
  assert(selector.startsWith('.'));
  const target=selector.slice(1);
  if(this.className.split(' ').includes(target))return this;
  for(const child of this.children){const found=child.querySelector(selector);if(found)return found}
  return null;
 }
}
const root=new Node(),spoken=[];
const sandbox={
 window:{speechSynthesis:{getVoices:()=>[{voiceURI:'de',lang:'de-DE'}],cancel(){},speak:s=>spoken.push(s)}},
 document:{getElementById:id=>id==='a1MockRoot'?root:id==='germanVoice'?{value:'de'}:null,createElement:tag=>new Node(tag)},
 SpeechSynthesisUtterance:class {constructor(value){this.text=value}},
 setInterval:()=>1,clearInterval(){},Date,console,Set,Map
};
vm.createContext(sandbox);
for(const script of ['a1-mock-data.js','a1-exam-german-data.js']){
 vm.runInContext(read(script),sandbox,{filename:script});
}
const sets=sandbox.window.DEUTSCH_A1_MOCK_SETS,exam=sandbox.window.DEUTSCH_A1_EXAM_DE;
assert.equal(Object.keys(exam).length,2);
let total=0;
for(const set of sets){
 assert(exam[set.id]);
 for(const skill of ['listening','reading']){
  const pairs=exam[set.id][skill];
  assert.equal(pairs.length,15,'All 15 items translated for '+set.id+' '+skill);
  for(let i=0;i<15;i++){
   const [prompt,options]=pairs[i];
   assert(typeof prompt==='string' && prompt.includes('?'),'A German A1 question is required');
   assert(!/\b(When|What|Which|Where|How|Can)\b/.test(prompt),'No English prompts');
   assert(Array.isArray(options)&&options.length===3);
   assert.equal(new Set(options).size,3,'Every answer choice unique');
   assert(options.every(s=>typeof s==='string'&&s.length>=2));
   total++;
  }
 }
}
assert.equal(total,60);
vm.runInContext(read('a1-mock.js'),sandbox,{filename:'a1-mock.js'});
assert.equal(sandbox.window.DEUTSCH_A1_MOCK.countSets,2);
const content=root.querySelector('.a1-mock-content');
const language=root.querySelector('.a1-mock-language');
const choices=()=>content.querySelector('.a1-mock-options');
assert.equal(language.querySelector('.a1-mock-language-options').children.length,2);
assert(content.textContent.includes('When does the consultation begin?'),'Guided English remains default');
language.querySelector('.a1-mock-language-options').children[1].click();
assert(content.textContent.includes('Wann beginnt die Sprechstunde?'));
assert(!content.textContent.includes('When does the consultation begin?'));
assert(!content.textContent.includes('Guten Tag! Die Sprechstunde beginnt'),'Listening transcript must remain hidden');
assert(choices().children.every(x=>x.lang==='de'),'Answer choices must be marked as German for pronunciation tools');
assert(choices().children[1].textContent==='Um neun Uhr');
content.querySelector('.a1-mock-audio').children[0].click();
assert.equal(spoken.at(-1).text,sets[0].listening[0][0]);
choices().children[1].click();
assert(choices().children[1].attributes['aria-pressed']==='true','Selected choice retained');
content.querySelector('.a1-mock-navigation').children[1].click();
assert(content.textContent.includes('Aufgabe 2 von 15'));
content.querySelector('.a1-mock-navigation').children[0].click();
assert(content.textContent.includes('Aufgabe 1 von 15'));
assert.equal(choices().children[1].attributes['aria-pressed'],'true');
language.querySelector('.a1-mock-language-options').children[0].click();
assert(content.textContent.includes('Question 1 of 15'),'Language toggle restarts question index');
assert.equal(choices().children.every(b=>b.attributes['aria-pressed']==='false'),true,'Language switch clears prior answers');
language.querySelector('.a1-mock-language-options').children[1].click();
const item=sets[0].listening[0];
choices().children[item[3]].click();
for(let i=0;i<15;i++){
 if(i>0)choices().children[sets[0].listening[i][3]].click();
 content.querySelector('.a1-mock-navigation').children[1].click();
}
const result=content.querySelector('.a1-mock-result');
assert(result&&result.textContent.includes('15 / 15'),'Correct German answers must map to original answer indices');
assert(result.textContent.includes('German')===false||result.textContent.includes('English'),'Result bilingual review available');
const review=result.querySelector('.a1-mock-review');
assert(review.textContent.includes('English: When does the consultation begin?'));
assert(review.textContent.includes('Guten Tag! Die Sprechstunde beginnt'));
assert(review.textContent.includes('Richtig: Um neun Uhr'));
assert(review.textContent.includes('English answer: At 9:00'));
const tabs=root.querySelector('.a1-mock-skills');
tabs.children[1].click();
assert(content.textContent.includes('Aufgabe 1 von 15'),'German mode persists when selecting reading');
assert(content.textContent.includes('Ist das Büro am Samstag geöffnet?'));
assert(content.querySelector('.a1-mock-passage').textContent.includes('Öffnungszeiten:'));
tabs.children[2].click();
assert(language.children.length===0,'Writing practice does not show irrelevant language toggle');
assert(content.querySelector('.a1-mock-form'),'Original writing form remains accessible');
const examSets=root.querySelector('.a1-mock-sets');
examSets.children[1].click();
assert(content.querySelector('.a1-mock-audio'));
assert(content.textContent.includes('Wann beginnt der Deutschkurs?'),'Second mock has German listening language');
console.log('German A1 rehearsal tests passed: 60 original German question/answer translations, mode resets, hidden transcripts, correct bilingual review, timer navigation and 4-skill compatibility.');
