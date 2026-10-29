import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class MockNode {
 constructor(tag='div') {
  this.tag=tag;this.children=[];this.events={};this.attributes={};this._text='';
  this.hidden=false;this.disabled=false;this.className='';this.value='';
  this.lang='';this.classList={add:klass=>{this.className+=' '+klass}};
 }
 set textContent(text){this._text=String(text);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=children}
 setAttribute(k,v){this.attributes[k]=String(v)}
 addEventListener(k,callback){this.events[k]=callback}
 click(){if(!this.disabled)this.events.click?.()}
 scrollIntoView(){this.scrolled=true}
 querySelector(selector){
  assert(selector.startsWith('.'));
  const name=selector.slice(1);
  if(this.className.split(' ').includes(name))return this;
  for(const child of this.children){const result=child.querySelector(selector);if(result)return result}
  return null;
 }
}
const root=new MockNode('div'),docEvents={},winEvents={};
const storage={},voices=[{lang:'de-DE',voiceURI:'german-voice'}],spoken=[];
const context={
 window:{speechSynthesis:{getVoices:()=>voices,cancel(){},speak:v=>spoken.push(v)},addEventListener:(name,cb)=>{winEvents[name]=cb}},
 document:{getElementById:id=>id==='pronunciationRoot'?root:(id==='germanVoice'?{value:'german-voice'}:null),
  createElement:tag=>new MockNode(tag),addEventListener:(name,cb)=>{docEvents[name]=cb}},
 navigator:{},
 localStorage:{getItem:key=>storage[key]||null,setItem:(key,val)=>{storage[key]=String(val)}},
 SpeechSynthesisUtterance:class{constructor(text){this.text=text}},
 URL:{revokeObjectURL(){}},
 console,Set,Map,JSON
};
vm.createContext(context);
for(const f of ['pronunciation-data.js','pronunciation-lab.js'])
 vm.runInContext(read(f),context,{filename:f});
const data=context.window.DEUTSCH_PRONUNCIATION_DATA;
assert.equal(data.length,12,'Twelve sound lessons');
assert.equal(new Set(data.map(s=>s.id)).size,12,'All topic IDs unique');
assert.equal(data.reduce((n,s)=>n+s.words.length,0),24,'24 curated examples');
for(const item of data){
 assert(item.id&&item.symbol&&item.ipa&&item.title&&item.en&&item.ne&&item.phrase);
 assert.equal(item.words.length,2);
 for(const w of item.words)assert(w.length===5 && w.every(x=>typeof x==='string'&&x.trim()),'Full bilingual spelling hints');
}
const cards=root.querySelector('.pl-sound-grid'),detail=root.querySelector('.pl-detail');
assert(cards&&detail);
assert.equal(cards.children.length,12);
assert(root.querySelector('.pl-progress').textContent.includes('0 of 12'));
assert(detail.textContent.includes('ich'));
const firstSample=detail.querySelector('.pl-sample');
firstSample.children.find(x=>x.tag==='button').click();
assert.equal(spoken.at(-1).text,'ich');
assert.equal(spoken.at(-1).lang,'de-DE');
firstSample.children.filter(x=>x.tag==='button')[1].click();
assert.equal(spoken.at(-1).rate,0.65);
const options=detail.querySelector('.pl-choices'),result=detail.querySelector('.pl-result');
const next=detail.querySelector('.pl-next');
const words=data[0].words;
assert.equal(options.children.length,2);
options.children.find(x=>x.textContent===words[1][0]).click();
assert(result.textContent.includes('Try again next time.'),'Wrong choice should not count correct');
assert(!next.hidden);
next.click();
assert.equal(options.children.length,2);
options.children.find(x=>x.textContent===words[1][0]).click();
assert(result.textContent.includes('Correct!'));
next.click();
assert(detail.querySelector('.pl-round').textContent.includes('complete'));
assert(result.textContent.includes('1 of 2'),'Self test counts only the correct round');
next.click();
assert(detail.querySelector('.pl-round').textContent.includes('1 of 2'),'Practice restarts');
const mark=detail.querySelector('.pl-mark');mark.click();
assert(root.querySelector('.pl-progress').textContent.includes('1 of 12'));
assert.deepEqual(JSON.parse(storage['deutschdaily-pronunciation-v1']),['ich-ch']);
cards.children[1].click();
assert(detail.textContent.includes('ach'));
assert(detail.scrolled,'Selected sound scrolls into view');
const play=detail.querySelector('.pl-sample').children.find(x=>x.tag==='button');
voices.length=0;play.click();
assert(detail.querySelector('.pl-audio-notice').textContent.includes('not installed'));
voices.push({lang:'de-DE',voiceURI:'german-voice'});
// Restore from a backup that includes both existing and added progress.
storage['deutschdaily-pronunciation-v1']=JSON.stringify(['ich-ch','ach-ch']);
docEvents['deutschdaily:restore-a1']();
assert(root.querySelector('.pl-progress').textContent.includes('2 of 12'));
for(let i=0;i<12;i++){
 cards.children[i].click();
 assert(detail.querySelector('.pl-choices').children.length===2);
 assert(detail.querySelector('.pl-speak-phrase').textContent===data[i].phrase);
}
assert(typeof winEvents.hashchange==='function');
assert(typeof docEvents.visibilitychange==='function');
const app=read('app.js');
assert(app.includes('pronunciationProgress:readStorage(KEY_PRONUNCIATION,[])'),'Backup exports pronunciation progress');
assert(app.includes('Array.isArray(data.pronunciationProgress)'),'Restores only validated pronunciation progress');
console.log('Pronunciation lab tests passed: 12 sound lessons, 24 examples, normal/slow German audio, wrong/correct answer handling, retry, progress save/restore and device fallback.');
