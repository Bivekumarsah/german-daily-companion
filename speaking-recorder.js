/* DeutschDaily A1 local speaking rehearsal. No upload, storage, scoring or speech recognition.
   Microphone requested ONLY after explicit click. Media bytes stay in browser memory. */
(() => {
'use strict';
const active=new Set();
const make=(tag,cls,value)=>{
 const x=document.createElement(tag);
 if(cls)x.className=cls;
 if(value!==undefined)x.textContent=value;
 return x;
};
function mount(parent){
 if(!parent)return null;
 const wrap=make('section','productive-recorder');
 const heading=make('h6','','🎙 Record and replay your own reply');
 const description=make('p','productive-help','Optional: record only after you tap Start. Replay and compare with the sample. Nothing is uploaded or saved. Leaving this question deletes the recording.');
 const status=make('p','productive-mic-status','Microphone is off.');
 status.setAttribute('role','status');
 const controls=make('div','productive-actions');
 const record=make('button','productive-btn','🎙 Start recording');
 const discard=make('button','productive-btn','Delete recording');
 for(const b of [record,discard])b.type='button';
 discard.disabled=true;
 const audio=make('audio','productive-replay');
 audio.controls=true;audio.preload='none';audio.hidden=true;
 audio.setAttribute('aria-label','Your local speaking rehearsal');
 controls.append(record,discard);
 wrap.append(heading,description,controls,audio,status);
 parent.append(wrap);

 const supported=Boolean(navigator.mediaDevices?.getUserMedia&&typeof MediaRecorder!=='undefined'&&typeof URL?.createObjectURL==='function');
 let disposed=false,pending=false,recorder=null,stream=null,url=null,chunks=[];
 let generation=0;
 const stopTracks=(media)=>{for(const track of media?.getTracks?.()||[]){try{track.stop();}catch{}}};
 const revoke=()=>{if(url){try{URL.revokeObjectURL(url);}catch{}url=null;}audio.pause?.();audio.removeAttribute?.('src');audio.load?.();audio.hidden=true;discard.disabled=true;};
 const setState=(message,recording=false)=>{
  status.textContent=message;
  record.textContent=recording?'■ Stop and replay':'🎙 Start recording';
  record.setAttribute('aria-pressed',String(recording));
 };
 function finishRecording(){
  const captured=chunks;
  chunks=[];
  stopTracks(stream);stream=null;recorder=null;
  if(disposed)return;
  if(captured.length===0||!captured.some(x=>x.size>0)){
   setState('No sound captured. Try recording again.');
   record.disabled=false;
   return;
  }
  const mime=captured.find(x=>x.type)?.type||'audio/webm';
  const blob=new Blob(captured,{type:mime});
  if(!blob.size){setState('No sound captured. Try again.');record.disabled=false;return;}
  try{
   url=URL.createObjectURL(blob);
   audio.src=url;audio.hidden=false;discard.disabled=false;record.disabled=false;
   setState('Recording stopped; microphone is off. Listen with the playback control. This is not pronunciation grading.');
  }catch{
   setState('Recording stopped. Audio playback is unavailable in this browser.');
   record.disabled=false;
  }
 }
 async function start(){
  if(disposed||pending)return;
  if(recorder?.state==='recording'){stop();return;}
  if(!supported){setState('Recording is unsupported in this browser. Listen and speak aloud instead.');return;}
  const seq=++generation;
  pending=true;record.disabled=true;
  revoke();setState('Requesting microphone permission…');
  let media;
  try{
   media=await navigator.mediaDevices.getUserMedia({audio:true});
   if(disposed||seq!==generation){stopTracks(media);return;}
   stream=media;
   const next=new MediaRecorder(media);
   recorder=next;chunks=[];
   next.addEventListener('dataavailable',event=>{if(!disposed && event.data?.size>0)chunks.push(event.data);});
   next.addEventListener('stop',finishRecording);
   next.addEventListener('error',()=>{
    if(!disposed){stopTracks(stream);stream=null;recorder=null;setState('Recorder error. Microphone stopped.');record.disabled=false;}
   });
   next.start();
   setState('Recording now. Speak your German answer, then tap Stop and replay.',true);
  }catch{
   stopTracks(media||stream);stream=null;recorder=null;
   if(!disposed)setState('Microphone permission denied or unavailable. You can still practise aloud without recording.');
  }finally{
   pending=false;
   if(!disposed)record.disabled=false;
  }
 }
 function stop(){
  if(disposed)return;
  if(recorder?.state==='recording'){
   record.disabled=true;
   try{recorder.stop();}catch{stopTracks(stream);stream=null;recorder=null;record.disabled=false;setState('Could not stop recorder. Microphone released.');}
  }
 }
 function forget(){
  if(disposed)return;
  if(recorder?.state==='recording'){generation++;try{recorder.stop();}catch{}stopTracks(stream);stream=null;recorder=null;chunks=[];}
  revoke();record.disabled=false;setState('Recording deleted from this browser. Microphone is off.');
 }
 function dispose(){
  if(disposed)return;
  disposed=true;generation++;
  if(recorder?.state==='recording'){try{recorder.stop();}catch{}}
  stopTracks(stream);stream=null;recorder=null;chunks=[];
  revoke();
  window.removeEventListener?.('hashchange',onNavigation);
  window.removeEventListener?.('pagehide',dispose);
  document.removeEventListener?.('visibilitychange',onVisibility);
  active.delete(controller);
 }
 function onNavigation(){if(!location.hash.startsWith('#/exam'))dispose();}
 function onVisibility(){if(document.hidden){dispose();}}
 const controller={dispose,stop,forget,get active(){return !disposed;}};
 if(!supported){record.disabled=true;setState('Microphone recording is unavailable here. You can still listen and speak aloud.');}
 record.addEventListener('click',()=>{if(recorder?.state==='recording')return stop();return start();});
 discard.addEventListener('click',forget);
 window.addEventListener?.('hashchange',onNavigation);
 window.addEventListener?.('pagehide',dispose);
 document.addEventListener?.('visibilitychange',onVisibility);
 active.add(controller);
 return controller;
}
function stopAll(){for(const item of [...active])item.dispose();}
window.DEUTSCH_SPEAKING_RECORDER={mount,stopAll};
})();