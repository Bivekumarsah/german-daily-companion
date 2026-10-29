import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
class Node {
 constructor(tag='div'){this.tag=tag;this.children=[];this.events={};this.className='';
  this._text='';this.hidden=false;this.disabled=false;this.classList={add:x=>{this.className+=' '+x}};}
 set textContent(value){this._text=String(value);this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=els}
 addEventListener(k,cb){this.events[k]=cb}
 setAttribute(){}
 querySelector(c){const k=c.slice(1);if(this.className.split(' ').includes(k))return this;for(const v of this.children){const a=v.querySelector(c);if(a)return a;}return null}
 scrollIntoView(){}
}
const tracks=[],streams=[],revoked=[],created=[],docEvents={},winEvents={};
class Recorder {
 constructor(stream){this.stream=stream;this.events={};this.state='inactive';this.mimeType='audio/webm'}
 addEventListener(k,cb){this.events[k]=cb}
 start(){this.state='recording'}
 stop(){this.state='inactive';this.events.dataavailable?.({data:new Uint8Array([1,2,3])});this.events.stop?.()}
}
const root=new Node(),navigator={mediaDevices:{getUserMedia:async()=>{
 const track={stopped:false,stop(){this.stopped=true}};tracks.push(track);
 const stream={getTracks:()=>[track]};streams.push(stream);return stream;
}}};
let hash='#/practice',blobid=0;
const mock={window:{addEventListener:(k,cb)=>{winEvents[k]=cb}},
 document:{getElementById:id=>id==='pronunciationRoot'?root:null,createElement:tag=>new Node(tag),addEventListener:(k,cb)=>{docEvents[k]=cb}},
 navigator,location:{get hash(){return hash}},
 localStorage:{getItem:()=>null,setItem(){}},
 MediaRecorder:Recorder,URL:{createObjectURL(blob){created.push(blob);return 'blob:test-'+(++blobid)},revokeObjectURL(url){revoked.push(url)}},
 Blob,console,Set,Map,JSON};
vm.createContext(mock);
for(const file of ['pronunciation-data.js','pronunciation-lab.js'])vm.runInContext(read(file),mock,{filename:file});
const detail=root.querySelector('.pl-detail'),cards=root.querySelector('.pl-sound-grid');
let rec=detail.querySelector('.pl-recording');
assert(rec,'Mic controls must exist on a supporting browser');
const btn=rec.children.find(x=>x.tag==='button'),playback=rec.children.find(x=>x.tag==='audio');
assert(btn&&playback);
await btn.events.click();
assert(btn.textContent.includes('Stop recording'));
assert.equal(tracks[0].stopped,false,'Mic remains active only while recording');
await btn.events.click();
assert.equal(tracks[0].stopped,true,'Mic closes immediately after stop');
assert.equal(playback.hidden,false,'Local replay is available');
assert(playback.src?.startsWith('blob:test'),'Should use browser local blob URL, not upload');
await btn.events.click();
assert(revoked.includes('blob:test-1'),'Previous recording URL must be revoked');
cards.children[1].click();
assert.equal(tracks[1].stopped,true,'Changing the sound closes microphone');
assert.equal(detail.textContent.includes('ach'),true);
const secondRecord=detail.querySelector('.pl-recording').children.find(x=>x.tag==='button');
await secondRecord.events.click();
assert.equal(tracks[2].stopped,false);
hash='#/dashboard';winEvents.hashchange();
assert.equal(tracks[2].stopped,true,'Leaving Practice route must stop microphone capture');
assert.equal(created.length,1,'Only an explicitly stopped recording creates local playback data');
console.log('Pronunciation microphone checks passed: start, stop, local playback, URL revocation, lesson navigation and route-change cleanup.');
