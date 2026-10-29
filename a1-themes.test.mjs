import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class Node {
 constructor(tag='div'){
  this.tag=tag;this.children=[];this.events={};this.attributes={};
  this._text='';this.className='';this.hidden=false;this.disabled=false;this.value='';
  this.classList={add:cls=>this.className+=' '+cls};
 }
 set textContent(v){this._text=String(v);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(k,v){this.attributes[k]=String(v)}
 addEventListener(k,fn){this.events[k]=fn}
 click(){if(!this.disabled)this.events.click?.()}
 querySelector(selector){
  assert(selector.startsWith('.'));
  const cls=selector.slice(1);
  if(this.className.split(' ').includes(cls))return this;
  for(const child of this.children){const match=child.querySelector(selector);if(match)return match}
  return null;
 }
}
const root=new Node(),spoken=[];
const context={window:{speechSynthesis:{getVoices:()=>[{lang:'de-DE',voiceURI:'german'}],cancel(){},speak:v=>spoken.push(v)}},
 document:{getElementById:id=>id==='a1ThemesRoot'?root:id==='germanVoice'?{value:'german'}:null,createElement:tag=>new Node(tag)},
 SpeechSynthesisUtterance:class{constructor(text){this.text=text}},
 console,Set,Map};
vm.createContext(context);
for(const filename of ['a1-themes-data.js','a1-themes.js'])vm.runInContext(read(filename),context,{filename});
const packs=context.window.DEUTSCH_A1_THEME_PACKS;
assert.equal(packs.length,10);
const unique=new Set();
for(const pack of packs){
 assert(pack.id&&pack.title&&pack.items.length===10,'Every topic has ten entries');
 for(const row of pack.items){
  assert.equal(row.length,4);
  assert(row.every(v=>typeof v==='string'&&v.trim().length>0));
  assert(/^(der |die |das )/u.test(row[0]),'German nouns must include nominative articles');
  assert(!unique.has(row[0]),'No duplicate topic-bank items: '+row[0]);
  unique.add(row[0]);
  assert(row[3]==='—'||/^(die )/u.test(row[3]),'Plural noun includes article or dash');
 }
}
assert.equal(unique.size,100);
assert.equal(context.window.DEUTSCH_A1_THEMES.packCount,10);
const tabs=root.querySelector('.a1-theme-tabs'),list=root.querySelector('.a1-theme-list'),challenge=root.querySelector('.a1-theme-challenge');
assert(tabs&&list&&challenge);
assert.equal(tabs.children.length,10);
for(let packIndex=0;packIndex<10;packIndex++){
 tabs.children[packIndex].click();
 const pack=packs[packIndex];
 const cards=list.querySelector('.a1-theme-cards');
 assert.equal(cards.children.length,10);
 assert(cards.children[0].textContent.includes(pack.items[0][2]));
 assert(cards.children[0].textContent.includes('Plural:')||cards.children[0].textContent.includes('No common'));
 cards.children[0].querySelector('.a1-theme-actions').children[0].click();
 assert.equal(spoken.at(-1).text,pack.items[0][0]);
 cards.children[0].querySelector('.a1-theme-actions').children[1].click();
 assert.equal(spoken.at(-1).rate,0.68);
 for(let round=0;round<5;round++){
  assert(challenge.textContent.includes('Question '+(round+1)+' of 5'));
  const target=pack.items[(round*2)%10];
  const options=challenge.querySelector('.a1-theme-options');
  assert.equal(options.children.length,3);
  const wrong=options.children.find(o=>o.textContent!==target[0]);
  wrong.click();
  assert(challenge.querySelector('.a1-theme-feedback').textContent.includes('Try another'));
  options.children.find(o=>o.textContent===target[0]).click();
  assert(challenge.querySelector('.a1-theme-feedback').textContent.includes('Richtig!'));
  const next=challenge.querySelector('.a1-theme-primary');
  assert(next);
  next.click();
 }
 assert(challenge.querySelector('.a1-theme-final').textContent.includes('0 of 5'),'A wrong first guess should not count');
 challenge.querySelector('.a1-theme-primary').click();
 assert(challenge.textContent.includes('Question 1 of 5'));
}
assert.equal(spoken.length,20);
console.log('A1 thematic bank checks passed: 10 themes, 100 curated German noun entries with English/Nepali and plural, 50 practice rounds, 20 audio interactions, correction and replay.');
