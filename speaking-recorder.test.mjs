import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
class FakeNode{
 constructor(tag='div'){
  this.tag=tag;this.children=[];this.events={};this.attributes={};this.className='';this._text='';
  this.disabled=false;this.hidden=false;this.controls=false;this.src='';this.loaded=false;
 }
 set textContent(x){this._text=String(x);this.children=[]}
 get textContent(){return this._text+this.children.map(n=>n.textContent).join('')}
 append(...x){this.children.push(...x)}
 setAttribute(k,v){this.attributes[k]=String(v)}
 addEventListener(k,cb){this.events[k]=cb}
 click(){if(!this.disabled)return this.events.click?.()}
 removeAttribute(k){if(k==='src')this.src=''}
 pause(){this.paused=true}
 load(){this.loaded=true}
 querySelector(cls){const id=cls.slice(1);if(this.className.split(' ').includes(id))return this;for(const c of this.children){const r=c.querySelector(cls);if(r)return r}return null}
}
const events={window:{},document:{}};
const tracks=[],streams=[],objects=[],revoked=[];
let blockPermission=null,denied=false;
function newStream(){
 const track={stopped:false,stop(){this.stopped=true}};
 tracks.push(track);
 const media={getTracks:()=>[track]};
 streams.push(media);return media;
}
class FakeRecorder {
 constructor(stream){this.stream=stream;this.state='inactive';this.listeners={};this.mimeType='audio/webm'}
 addEventListener(k,fn){this.listeners[k]=fn}
 start(){this.state='recording'}
 stop(){
  this.state='inactive';
  this.listeners.dataavailable?.({data:new Blob(['Recorded German'],{type:'audio/webm'})});
  this.listeners.stop?.();
 }
}
const mock={
 window:{
  addEventListener:(key,fn)=>{events.window[key]=fn},
  removeEventListener:(key,fn)=>{if(events.window[key]===fn)delete events.window[key]}
 },
 document:{
  createElement:tag=>new FakeNode(tag),
  addEventListener:(key,fn)=>{events.document[key]=fn},
  removeEventListener:(key,fn)=>{if(events.document[key]===fn)delete events.document[key]},
  hidden:false
 },
 navigator:{mediaDevices:{getUserMedia:()=>{
  if(denied)return Promise.reject(new Error('not permitted'));
  return blockPermission||Promise.resolve(newStream());
 }}},
 MediaRecorder:FakeRecorder,
 URL:{createObjectURL:blob=>{objects.push(blob);return 'blob:test-'+objects.length},revokeObjectURL:x=>revoked.push(x)},
 location:{hash:'#/exam'},Blob,console,Set
};
vm.createContext(mock);
vm.runInContext(read('speaking-recorder.js'),mock,{filename:'speaking-recorder.js'});
const module=mock.window.DEUTSCH_SPEAKING_RECORDER;
assert(module?.mount && module?.stopAll);
const parent=new FakeNode();
const controller=module.mount(parent);
const card=parent.querySelector('.productive-recorder');
const actions=card.querySelector('.productive-actions');
const record=actions.children[0],discard=actions.children[1],player=card.querySelector('.productive-replay');
assert.equal(tracks.length,0,'No implicit microphone permission request');
assert.equal(record.attributes['aria-pressed'],undefined);
await record.click();
assert.equal(tracks.length,1);
assert.equal(tracks[0].stopped,false,'Capture track is active while recording');
assert.equal(record.attributes['aria-pressed'],'true');
record.click();
assert.equal(tracks[0].stopped,true,'Stop immediately releases mic');
assert.equal(player.hidden,false,'Local audio playback becomes available');
assert.equal(player.src,'blob:test-1');
assert.equal(discard.disabled,false);
discard.click();
assert(revoked.includes('blob:test-1'),'Delete revokes object URL');
assert.equal(player.hidden,true);
assert.equal(player.src,'');
await record.click();
assert.equal(tracks.length,2);
mock.location.hash='#/dashboard';events.window.hashchange();
assert.equal(tracks[1].stopped,true,'Leaving the exam route releases mic');
assert.equal(controller.active,false);
assert.equal(objects.length,1,'Aborted capture does not persist audio');
assert.equal(events.window.hashchange,undefined,'Navigation listener removed');
mock.location.hash='#/exam';
const parent2=new FakeNode(),c2=module.mount(parent2);
const button=parent2.querySelector('.productive-actions').children[0];
await button.click();button.click();
assert.equal(parent2.querySelector('.productive-replay').src,'blob:test-2');
module.stopAll();
assert.equal(c2.active,false);
assert(revoked.includes('blob:test-2'),'Component cleanup revokes audio');
denied=true;
const c3=module.mount(new FakeNode());
const parent3=new FakeNode();c3.dispose();
const c4=module.mount(parent3);await parent3.querySelector('.productive-actions').children[0].click();
assert(parent3.textContent.includes('permission denied')||parent3.textContent.includes('unavailable'),'Permission failure should be understandable');
c4.dispose();denied=false;
let resolveLate;
blockPermission=new Promise(resolve=>{resolveLate=resolve});
const lateParent=new FakeNode(),c5=module.mount(lateParent);
const lateClick=lateParent.querySelector('.productive-actions').children[0].click();
c5.dispose();
const lateStream=newStream();resolveLate(lateStream);await lateClick;
assert(lateStream.getTracks()[0].stopped,'Late permission result must be closed after disposal');
blockPermission=null;
assert(!/fetch\s*\(/.test(read('speaking-recorder.js')),'Recording never sends audio to any network endpoint');
assert(!/localStorage|indexedDB|sessionStorage/.test(read('speaking-recorder.js')),'Audio is never persisted');
const scripts=read('index.html');
assert(scripts.indexOf('src="speaking-recorder.js"')<scripts.indexOf('src="productive-coach.js"'));
assert(read('sw.js').includes('speaking-recorder.js'));
console.log('Local speaking recorder checks passed: explicit consent, record/stop/play, URL revocation, navigation, permission denial, late permission and no upload/persistence.');
