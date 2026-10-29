/* DeutschDaily: quiet, accessible 10-minute guided learning with actual German practice.
   Every activity is optional, progress is local and means practice only, not exam proficiency. */
(() => {
'use strict';
const root=document.getElementById('dailyJourneyRoot');
const course=window.DEUTSCH_A1,logic=window.DEUTSCH_DAILY_LOGIC;
if(!root||!course?.units?.length||!logic)return;
const SESSION='deutschdaily-daily-journey-v1';
const MISSES='deutschdaily-daily-mistakes-v1';
const COURSE='deutschdaily-a1-pathway-v1';
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const button=(name,act,cls='dj-btn')=>{const b=make('button',cls,name);b.type='button';b.addEventListener('click',act);return b;};
const read=(key,empty)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??empty;}catch{return empty;}};
const store=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
const getUnit=id=>course.units.find(u=>u.id===id)||course.units[0];
const saved=read(SESSION,null);
let session=logic.normalizeSession(course.units,read(COURSE,{}),saved);
let misses=read(MISSES,[]);
if(!Array.isArray(misses))misses=[];
let started=false,disposeAudio=null;
const frame=make('section','dj-frame');
frame.setAttribute('aria-labelledby','dailyJourneyHeading');
const introduction=make('div','dj-heading');
introduction.append(make('span','dj-eyebrow','🌱 YOUR DAILY GERMAN · DEUTSCH + नेपाली'),
 make('h2','','One small German lesson today'),
 make('p','','A guided 10-minute practice. No rush, no streak pressure, no account needed.'));
const activity=make('div','dj-activity');
const status=make('p','dj-live','');
status.setAttribute('role','status');
frame.append(introduction,activity,status);
root.append(frame);
function speak(text,slow=false){
 if(typeof SpeechSynthesisUtterance==='undefined'||!('speechSynthesis' in window)){
  status.textContent='German speech is unavailable here. Read the German aloud instead.';return;
 }
 const synth=window.speechSynthesis;
 const voices=synth.getVoices().filter(x=>(x.lang||'').toLowerCase().startsWith('de'));
 const selected=document.getElementById('germanVoice')?.value;
 const voice=voices.find(v=>v.voiceURI===selected)||voices[0];
 if(!voice){status.textContent='No German speech voice installed. The activities still work without sound.';return;}
 try{
  synth.cancel();const u=new SpeechSynthesisUtterance(text);
  u.lang=voice.lang;u.voice=voice;u.rate=slow?0.72:0.94;
  u.onerror=()=>{status.textContent='Speech playback failed. Try another German device voice.';};
  synth.speak(u);
 }catch{status.textContent='Speech playback is unavailable.';}
}
function addAudio(host,german){
 host.append(button('🔊 Hear German',()=>speak(german)),button('◷ Slow',()=>speak(german,true)));
}
function persist(){if(!store(SESSION,session))status.textContent='Browser storage is unavailable; daily progress may not persist.';}
function record(kind,value,correct=false){
 misses=logic.recordMistake(misses,{unitId:session.unitId,kind,value},correct);
 if(!store(MISSES,misses))status.textContent='Mistakes may not be remembered on this browser.';
}
function nextStep(){
 disposeAudio?.dispose?.();disposeAudio=null;
 session={...session,step:Math.min(logic.steps.length,session.step+1)};
 persist();render();
 document.dispatchEvent(new Event('deutschdaily:daily-update'));
}
function begin(){started=true;render();}
function jump(nextUnit){
 disposeAudio?.dispose?.();disposeAudio=null;
 session={date:logic.today(),unitId:nextUnit.id,step:0};
 started=true;persist();render();
}
function header(host,unit){
 const top=make('div','dj-status');
 top.append(make('span','','UNIT '+unit.number+' / 36 · '+unit.title),
  make('span','',session.step>=6?'✓ Practised':'Activity '+(session.step+1)+' of 6'));
 host.append(top);
 const progress=make('div','dj-progress');progress.setAttribute('role','progressbar');
 progress.setAttribute('aria-label','Daily journey practice completion');
 progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','6');
 progress.setAttribute('aria-valuenow',String(session.step));
 const bar=make('span','dj-progress-fill');bar.style.width=(session.step/6*100)+'%';progress.append(bar);
 host.append(progress);
 const steps=make('div','dj-steps');
 logic.steps.forEach((s,i)=>{
  const item=make('span','dj-step'+(i===session.step?' is-current':i<session.step?' is-done':''));
  item.textContent=s.icon+' '+s.title;
  if(i===session.step)item.setAttribute('aria-current','step');
  steps.append(item);
 });
 host.append(steps);
}
function forward(host,text='Continue →'){
 host.append(button(text,nextStep,'dj-primary'));
}
function outcome(host,{correct,prompt,answer,help,repeat}){
 const feedback=make('p','dj-feedback '+(correct?'dj-good':'dj-again'));
 feedback.setAttribute('role','status');
 feedback.textContent=correct?'✓ Richtig! '+answer+' · You understood this one.':'Not yet. '+help;
 host.append(feedback);
 if(correct)forward(host);
 else if(repeat)host.append(button('Try again ↻',repeat,'dj-primary'));
}
function mcq(host,unit,kind,isReview=false){
 const q=logic.questions(unit,kind,session.date+(isReview?'retry':'lesson'));
 if(!q)return;
 const listening=kind==='listening';
 host.append(make('h3','',isReview?'🔁 Review a tricky '+kind+' question':listening?'🎧 Listen for one detail':'📖 Read and understand'));
 host.append(make('p','dj-help',listening?'First listen without reading the German. The transcript appears after a correct answer or when you request help.':'Read the German message before choosing an answer.'));
 let transcript;
 if(listening){
  const actions=make('div','dj-actions');addAudio(actions,q.text);host.append(actions);
  transcript=make('p','dj-transcript',q.text);transcript.lang='de';transcript.hidden=true;
  host.append(button('Reveal transcript (extra help)',()=>{transcript.hidden=false;status.textContent='Transcript revealed. This is guided practice, not a listening test.';}));
  host.append(transcript);
 }else{const passage=make('p','dj-german',q.text);passage.lang='de';host.append(passage);}
 host.append(make('p','dj-question',q.prompt));
 const opts=make('div','dj-choices');host.append(opts);
 const feedback=make('p','dj-feedback','');feedback.setAttribute('role','status');host.append(feedback);
 let wrong=false;
 q.options.forEach(o=>{
  const b=button(o.label,()=>{
   if(b.disabled)return;
   if(o.index!==q.correct){
    wrong=true;record(kind,q.text);
    b.disabled=true;feedback.className='dj-feedback dj-again';
    feedback.textContent='Not quite. '+(listening?'Listen again for the key detail.':'Read the message again and look for the key detail.')+' You can still try the other answers.';
    return;
   }
   if(!wrong)record(kind,q.text,true);
   if(transcript)transcript.hidden=false;
   for(const x of opts.children)x.disabled=true;
   feedback.className='dj-feedback dj-good';feedback.textContent='✓ Richtig! '+o.label+'. '+(wrong?'Good recovery; we will review this again.':'You found the detail.');
   if(isReview){misses=logic.recordMistake(misses,{unitId:unit.id,kind,value:q.text},true);store(MISSES,misses);}
   forward(host,'Next activity →');
  },'dj-choice');
  opts.append(b);
 });
}
function discover(host,unit){
 host.append(make('h3','','👀 Discover useful words'),make('p','dj-help','Read the English and Nepali meaning. Listen, then say each German word aloud.'));
 const list=make('div','dj-word-grid');
 unit.vocab.slice(0,4).forEach(w=>{
  const card=make('article','dj-word');
  const de=make('strong','',w.de);de.lang='de';
  card.append(de,make('p','',w.en),make('p','dj-nepali',w.ne));
  card.append(button('🔊 Listen',()=>speak(w.de),'dj-btn'));
  list.append(card);
 });
 host.append(list);
 forward(host,'I studied these words →');
}
function build(host,unit){
 host.append(make('h3','','🧩 Build one German sentence'),make('p','dj-help','Tap the German words in the correct order. Undo is always available; no timer or penalties.'));
 host.append(make('p','dj-meaning',unit.grammar.exampleEn+' · '+unit.grammar.exampleNe));
 const expected=unit.grammar.example.trim().split(/\s+/u);
 const words=logic.shuffle(expected.map((value,index)=>({value,index})),unit.id+session.date);
 const picked=[];
 const answer=make('p','dj-built','Tap words below to begin');
 const pool=make('div','dj-choices');const row=make('div','dj-actions');
 const feedback=make('p','dj-feedback','');feedback.setAttribute('role','status');
 host.append(answer,pool,row,feedback);
 function redraw(){
  pool.replaceChildren();
  answer.textContent=picked.length?picked.map(x=>x.value).join(' '):'Tap words below to begin';
  words.forEach(word=>{
   const b=button(word.value,()=>{picked.push(word);redraw();},'dj-choice');
   b.lang='de';b.disabled=picked.includes(word);pool.append(b);
  });
 }
 row.append(button('↶ Undo',()=>{picked.pop();feedback.textContent='';redraw();}),
  button('Reset',()=>{picked.length=0;feedback.textContent='';redraw();}),
  button('Check order',()=>{
   if(picked.length!==expected.length){feedback.textContent='Use all the words first.';return;}
   const correct=picked.every((w,i)=>w.value===expected[i]);
   if(correct){
    feedback.className='dj-feedback dj-good';feedback.textContent='✓ Richtig! '+unit.grammar.example;
    const audio=make('div','dj-actions');addAudio(audio,unit.grammar.example);
    host.append(audio);for(const x of row.children)x.disabled=true;for(const x of pool.children)x.disabled=true;
    forward(host);
   }else{
    feedback.className='dj-feedback dj-again';
    feedback.textContent='Try a different order. Tip: '+unit.grammar.en;
    picked.length=0;redraw();
   }
  },'dj-primary'));
 redraw();
}
function speakStep(host,unit){
 host.append(make('h3','','🗣️ Say it yourself'),make('p','dj-help',unit.speaking.prompt));
 const guidance=make('p','dj-nepali','First speak aloud without reading the example. You can record yourself on this device if the microphone is supported.');
 host.append(guidance);
 if(window.DEUTSCH_SPEAKING_RECORDER?.mount)disposeAudio=window.DEUTSCH_SPEAKING_RECORDER.mount(host);
 const reveal=button('I spoke aloud · show an example',()=>{
  reveal.disabled=true;reveal.hidden=true;
  const model=make('div','dj-speaking-model');model.append(make('strong','','One possible German response'));
  const sentence=make('p','dj-german',unit.speaking.model);sentence.lang='de';model.append(sentence);
  const actions=make('div','dj-actions');addAudio(actions,unit.speaking.model);
  model.append(actions,make('p','dj-help','Compare your response. Another correct answer may differ; recording and replay do not automatically grade speech.'));
  host.append(model);
  forward(host,'I compared my answer →');
 },'dj-primary');
 host.append(reveal);
}
function recall(host,unit){
 const q=logic.recap(unit,misses,session.date,course.units);
 if(q.kind!=='vocab'){
  mcq(host,getUnit(q.unitId),q.kind,true);return;
 }
 host.append(make('h3','','🏁 Quick recall'),make('p','dj-help',misses.length?'This question prioritizes a word you found difficult before.':'Recall a useful word from your lesson.'));
 host.append(make('p','dj-question','Which German word means “'+q.target.en+'” · '+q.target.ne+'?'));
 const opts=make('div','dj-choices'),feedback=make('p','dj-feedback','');feedback.setAttribute('role','status');
 host.append(opts,feedback);
 let first=true;
 q.options.forEach(word=>{
  const b=button(word.de,()=>{
   if(b.disabled)return;
   if(word.de!==q.target.de){
    first=false;
    misses=logic.recordMistake(misses,{unitId:q.unitId,kind:'vocab',value:q.target.de},false);
    store(MISSES,misses);b.disabled=true;
    feedback.className='dj-feedback dj-again';feedback.textContent='Not quite. Listen to each word and try another answer.';
   }else{
    if(first){misses=logic.recordMistake(misses,{unitId:q.unitId,kind:'vocab',value:q.target.de},true);store(MISSES,misses);}
    for(const c of opts.children)c.disabled=true;
    feedback.className='dj-feedback dj-good';feedback.textContent='✓ '+word.de+' · '+word.en+' · '+word.ne;
    const actions=make('div','dj-actions');addAudio(actions,word.de);host.append(actions);
    forward(host,'Finish my practice →');
   }
  },'dj-choice');b.lang='de';opts.append(b);
 });
}
function render(){
 const today=logic.today();
 if(session.date!==today){session=logic.normalizeSession(course.units,read(COURSE,{}),null,today);persist();started=false;}
 disposeAudio?.dispose?.();disposeAudio=null;activity.replaceChildren();status.textContent='';
 const unit=getUnit(session.unitId);header(activity,unit);
 if(!started){
  activity.append(make('h3','','Ready for a focused 10 minutes?'),
   make('p','dj-help','Listen • arrange • read • speak • recall. The lesson is saved locally as you progress. Activities are untimed.'));
  activity.append(button(session.step?'Resume my practice →':'Start my 10-minute lesson →',begin,'dj-primary'));
  activity.append(button('Open the full 36-unit course',()=>{location.hash='#/course/'+unit.id;}));
  return;
 }
 if(session.step>=logic.steps.length){
  activity.append(make('h3','','🎉 You practised German today!'),
   make('p','dj-help','Six short activities finished. Practice does not mean every answer was mastered. Keep building confidence, one day at a time.'));
  if(misses.length)activity.append(make('p','dj-meaning',misses.length+' review item(s) saved for a future practice session. Mistakes are part of learning.'));
  activity.append(button('Study the complete lesson →',()=>{location.hash='#/course/'+unit.id;},'dj-primary'));
  const next=course.units[(course.units.findIndex(u=>u.id===unit.id)+1)%course.units.length];
  activity.append(button('Practise the next unit →',()=>jump(next)));
  return;
 }
 const type=logic.steps[session.step].id;
 if(type==='discover')discover(activity,unit);
 if(type==='listen')mcq(activity,unit,'listening');
 if(type==='build')build(activity,unit);
 if(type==='read')mcq(activity,unit,'reading');
 if(type==='speak')speakStep(activity,unit);
 if(type==='recap')recall(activity,unit);
 const skip=button('Leave for now · progress saved',()=>{
  disposeAudio?.dispose?.();disposeAudio=null;started=false;render();
 });
 activity.append(skip);
}
function open(){
 if(location.hash==='#/dashboard'||!location.hash){render();return;}
 disposeAudio?.dispose?.();disposeAudio=null;started=false;
}
window.addEventListener('hashchange',open);
document.addEventListener('deutschdaily:restore-a1',()=>{session=logic.normalizeSession(course.units,read(COURSE,{}),read(SESSION,null));misses=read(MISSES,[]);render();});
render();
window.DEUTSCH_DAILY_JOURNEY={start:begin,refresh:render,get state(){return {...session}},get missed(){return misses.length}};
})();