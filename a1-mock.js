/* DeutschDaily original four-skill A1 rehearsal. Independent exercises, not official Goethe tests.
   Only listening/reading MCQs are automatically scored. Writing/speaking require human feedback. */
(() => {
'use strict';
const root=document.getElementById('a1MockRoot');
const sets=window.DEUTSCH_A1_MOCK_SETS||[];
if(!root || sets.length===0)return;
const titles={listening:'Hören · Listening',reading:'Lesen · Reading',writing:'Schreiben · Writing',speaking:'Sprechen · Speaking'};
const minutes={listening:20,reading:25,writing:20,speaking:15};
const skills=Object.keys(titles);
let selected=0,skill='listening',index=0,completed=false,examLanguage='guided';
let answers=[],startSeconds=0,remaining=minutes[skill]*60,timerId=null;
const writingAnswers={};
const el=(tag,klass,txt)=>{
 const n=document.createElement(tag);
 if(klass)n.className=klass;
 if(txt!==undefined)n.textContent=txt;
 return n;
};
const btn=(label,fn,cls='a1-mock-btn')=>{
 const n=el('button',cls,label);n.type='button';n.addEventListener('click',fn);return n;
};
const content=el('div','a1-mock-content');
const header=el('div','a1-mock-head');
const lead=el('p','a1-mock-lead','Independent original practice · device-generated listening audio · no official exam score');
const setsRow=el('div','a1-mock-sets');
const skillRow=el('div','a1-mock-skills');
const languageRow=el('div','a1-mock-language');
const clock=el('div','a1-mock-clock');
const notice=el('p','a1-mock-notice','');
notice.setAttribute('role','status');
header.append(lead,setsRow,skillRow,languageRow,clock,notice);
root.append(header,content);
const pad=n=>String(n).padStart(2,'0');
const format=s=>pad(Math.floor(s/60))+':'+pad(s%60);
function stopTimer(){
 if(timerId!==null){clearInterval(timerId);timerId=null;}
}
function setSection(nextSkill){
 stopTimer();
 skill=nextSkill;
 index=0;completed=false;answers=[];remaining=minutes[skill]*60;
 notice.textContent='Timer is optional. The original mock is for practice, not official Goethe grading.';
 render();
}
function speak(text,slow){
 const available='speechSynthesis' in window && typeof SpeechSynthesisUtterance!=='undefined';
 if(!available){notice.textContent='German audio is unavailable in this browser.';return;}
 const synth=window.speechSynthesis;
 const voices=synth.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('de'));
 const value=document.getElementById('germanVoice')?.value;
 const voice=voices.find(v=>v.voiceURI===value)||voices.find(v=>(v.lang||'').toLowerCase()==='de-de')||voices[0];
 if(!voice){notice.textContent='No German speech voice is installed. Add a German voice in your device settings.';return;}
 try {
  synth.cancel();
  const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=slow?0.7:0.94;
  u.onerror=()=>{notice.textContent='Speech failed. Try a different German device voice.';};
  synth.speak(u);
 }catch{notice.textContent='German audio could not start. Check your device voice settings.';}
}
function updateClock(){
 const time=clock.querySelector('.a1-mock-time');
 if(time)time.textContent=format(remaining);
}
function runTimer(){
 if(timerId!==null || completed)return;
 if(remaining<=0)remaining=minutes[skill]*60;
 let last=Date.now();
 timerId=setInterval(()=>{
  const now=Date.now(),diff=Math.floor((now-last)/1000);
  if(diff<1)return;
  last+=diff*1000;remaining=Math.max(0,remaining-diff);updateClock();
  if(remaining===0){
    stopTimer();
    if(skill==='listening'||skill==='reading')finishMCQ();
    else {notice.textContent='Practice time is up. You can finish your response and compare the example; it is not automatically graded.';render();}
  }
 },250);
 renderTimer();
}
function renderTimer(){
 clock.replaceChildren();
 const time=el('strong','a1-mock-time',format(remaining));
 time.setAttribute('role','timer');time.setAttribute('aria-live','off');
 const controls=el('div','a1-mock-timer-controls');
 controls.append(time,
  btn(timerId===null?'▶ Start timer':'❚❚ Pause timer',()=>{
    if(timerId!==null){stopTimer();renderTimer();}
    else runTimer();
  },'a1-mock-small'),
  btn('↻ Reset timer',()=>{stopTimer();remaining=minutes[skill]*60;renderTimer();},'a1-mock-small'));
 clock.append(el('span','a1-mock-timer-label','Suggested practice time'),controls);
}
function render(){
 setsRow.replaceChildren();
 for(const [i,set] of sets.entries()){
  const b=btn(set.title,()=>{
    if(selected===i)return;
    selected=i;setSection('listening');
  },'a1-mock-selector');
  b.setAttribute('aria-pressed',String(selected===i));
  if(i===selected)b.classList.add('is-active');
  setsRow.append(b);
 }
 skillRow.replaceChildren();
 for(const name of skills){
  const b=btn(titles[name],()=>{if(skill!==name)setSection(name);},'a1-mock-skill');
  b.setAttribute('aria-pressed',String(skill===name));
  if(skill===name)b.classList.add('is-active');
  skillRow.append(b);
 }
 languageRow.replaceChildren();
 if(skill==='listening'||skill==='reading'){
  const label=el('p','a1-mock-language-label','Choose practice language · Sprache wählen');
  const modes=el('div','a1-mock-language-options');
  modes.setAttribute('role','group');
  modes.setAttribute('aria-label','Question and answer language');
  for(const [value,title] of [['guided','Guided · English'],['german','German exam-style · Deutsch']]){
   const b=btn(title,()=>{
    if(examLanguage===value)return;
    examLanguage=value;
    stopTimer();index=0;answers=[];completed=false;remaining=minutes[skill]*60;
    notice.textContent='Practice language changed. Previous answers and timer were reset; this is an independent, unofficial exercise.';
    render();
   },'a1-mock-language-choice');
   b.setAttribute('aria-pressed',String(examLanguage===value));
   if(examLanguage===value)b.classList.add('is-active');
   modes.append(b);
  }
  languageRow.append(label,modes,el('p','a1-mock-help',examLanguage==='german'?
   'Original German-language questions and answers. English explanations appear only after submitting. Audio uses your device voice, not authentic examination recordings.':
   'Begin with English questions and answer choices. Switch to German-only rehearsal when ready. Switching restarts this section.'));
 }
 renderTimer();
 showTask();
}
function finishMCQ(){stopTimer();completed=true;showTask();}
function showTask(){
 content.replaceChildren();
 const set=sets[selected];
 const items=set[skill];
 const source=window.DEUTSCH_A1_EXAM_DE?.[set.id]?.[skill];
 const germanMode=examLanguage==='german' && (skill==='listening'||skill==='reading') && Array.isArray(source) && source.length===items.length;
 const heading=el('h4','a1-mock-title',titles[skill]+' · '+set.title);
 content.append(heading);
 if(skill==='listening'||skill==='reading'){
  const tally=answers.filter((a,i)=>a===items[i][3]).length;
  if(completed){
   const result=el('div','a1-mock-result');
   result.append(el('h5','', 'Practice results: '+tally+' / '+items.length+' correct'),
    el('p','', 'Only the objective questions are checked automatically. This is not a Goethe examination grade, and it does not assess writing or speaking.'));
   result.append(el('p','', 'To judge exam readiness, use Goethe’s official model exam with original audio and ask a teacher to review writing and speaking.'));
   const review=el('details','a1-mock-review');
   review.append(el('summary','', 'Review the original questions and answer explanations'));
   for(const [i,q] of items.entries()){
    const response=el('div','a1-mock-review-item');
    const g=source?.[i];
    const question=el('strong','',(i+1)+'. '+(germanMode&&g?g[0]:q[1]));
    if(germanMode)question.lang='de';
    response.append(question);
    if(germanMode)response.append(el('p','a1-mock-help','English: '+q[1]));
    const passage=el('p','',q[0]);passage.lang='de';response.append(passage);
    if(germanMode&&g){
     const correct=el('p','','Richtig: '+g[1][q[3]]);correct.lang='de';
     const chosen=el('p','','Ihre Antwort: '+(answers[i]===undefined?'Nicht beantwortet':g[1][answers[i]]));chosen.lang='de';
     response.append(correct,chosen,el('p','a1-mock-help','English answer: '+q[2][q[3]]));
    }else{
     response.append(el('p','','Correct answer: '+q[2][q[3]]),
       el('p','','Your answer: '+(answers[i]===undefined?'Not answered':q[2][answers[i]])));
    }
    review.append(response);
   }
   result.append(review,btn('Try this section again ↻',()=>setSection(skill),'a1-mock-primary'));
   content.append(result);return;
  }
  content.append(el('p','a1-mock-count',germanMode?
    'Aufgabe '+(index+1)+' von '+items.length+' · '+(skill==='listening'?'Hören Sie den Text und wählen Sie eine Antwort.':'Lesen Sie den Text und wählen Sie eine Antwort.'):
    'Question '+(index+1)+' of '+items.length+' · '+(skill==='listening'?'Hear the audio; the German transcript stays hidden until the section is submitted.':'Read the short original notice, sign, advertisement or message.')));
  const q=items[index];
  const germanTask=germanMode?source[index]:null;
  if(skill==='listening'){
   const audios=el('div','a1-mock-audio');
   audios.append(btn('🔊 Play German audio',()=>speak(q[0],false),'a1-mock-primary'),
     btn('◷ Replay slowly',()=>speak(q[0],true)));
   content.append(audios,el('p','a1-mock-help','Device-generated speech, not a professional Goethe recording. Use headphones and listen for one key detail.'));
  }else{
    const passage=el('blockquote','a1-mock-passage',q[0]);passage.lang='de';content.append(passage);
  }
  const question=el('h5','a1-mock-question',germanTask?germanTask[0]:q[1]);
  if(germanTask)question.lang='de';
  question.setAttribute('tabindex','-1');
  content.append(question);
  const choices=el('div','a1-mock-options');
  choices.setAttribute('role','group');
  choices.setAttribute('aria-label',germanTask?'Antwortmöglichkeiten':'Answer choices');
  (germanTask?germanTask[1]:q[2]).forEach((option,i)=>{
    const b=btn(option,()=>{
      answers[index]=i;showTask();
      content.querySelector('.a1-mock-options')?.children?.[i]?.focus?.();
    },'a1-mock-choice');
    if(germanTask)b.lang='de';
    b.setAttribute('aria-pressed',String(answers[index]===i));
    if(answers[index]===i)b.classList.add('is-selected');
    choices.append(b);
  });
  content.append(choices);
  const navigation=el('div','a1-mock-navigation');
  const previous=btn(germanMode?'← Zurück':'← Previous',()=>{index--;showTask();content.querySelector('.a1-mock-question')?.focus?.();});previous.disabled=index===0;
  navigation.append(previous);
  if(index===items.length-1){
   navigation.append(btn(germanMode?'Antworten prüfen':'Submit section for feedback',finishMCQ,'a1-mock-primary'));
  }else{
   navigation.append(btn(germanMode?'Weiter →':'Next question →',()=>{index++;showTask();content.querySelector('.a1-mock-question')?.focus?.();},'a1-mock-primary'));
  }
  content.append(navigation);
  content.append(el('p','a1-mock-help',germanMode?
    answers.filter(a=>a!==undefined).length+' von '+items.length+' beantwortet. Nicht beantwortete Fragen zählen nicht als richtig.':
    answers.filter(a=>a!==undefined).length+' / '+items.length+' answered. You may leave an answer blank. The score appears only when you submit this section.'));
  return;
 }
 // Written and spoken responses are *deliberately* not given automated point scores.
 content.append(el('p','a1-mock-count','Task '+(index+1)+' of '+items.length+' · Human-reviewed skill · No numeric score'));
 const task=items[index];
 content.append(el('h5','a1-mock-question',task.title),el('p','a1-mock-instructions',task.prompt));
 const key=set.id+'|'+skill+'|'+index;
 const response=el('div','a1-mock-response');
 if(skill==='writing'){
  if(task.type==='form'){
   const form=el('div','a1-mock-form');
   const fields=writingAnswers[key]||{};
   for(const field of task.fields){
    const label=el('label','a1-mock-field',field);
    const input=el('input','a1-mock-input');
    input.type='text';input.autocomplete='off';input.value=fields[field]||'';
    input.addEventListener('input',()=>{
      writingAnswers[key]={...(writingAnswers[key]||{}),[field]:input.value.slice(0,80)};
    });
    label.append(input);form.append(label);
   }
   const formStatus=el('p','a1-mock-help','');formStatus.setAttribute('role','status');
   const updateForm=()=>{const total=task.fields.length;const done=form.children.filter(label=>label.children[0]?.value?.trim()).length;formStatus.textContent=done+' / '+total+' fields filled · Use fictional information and double-check spelling. This is not automatically evaluated.';};
   for(const field of form.children)field.children[0].addEventListener('input',updateForm);
   updateForm();response.append(form,formStatus);
  }else{
    const area=el('textarea','a1-mock-textarea');
    area.rows=7;area.lang='de';area.maxLength=1800;
    area.value=writingAnswers[key]||'';
    area.placeholder='Write your German answer before revealing the example…';
    area.addEventListener('input',()=>{writingAnswers[key]=area.value;});
    response.append(area);
    if(window.DEUTSCH_PRODUCTIVE_COACH?.addWriting)window.DEUTSCH_PRODUCTIVE_COACH.addWriting(response,area,{goals:task.tips});
  }
 }else{
  response.append(el('p','a1-mock-help','Speak your answer aloud first. If possible, practise the question/request with a speaking partner; the Goethe speaking test is interactive.'));
  if(window.DEUTSCH_PRODUCTIVE_COACH?.addSpeaking)window.DEUTSCH_PRODUCTIVE_COACH.addSpeaking(response,{setId:set.id,taskIndex:index,speak});
 }
 content.append(response);
 const model=el('div','a1-mock-model');
 model.hidden=true;
 const ex=el('p','a1-mock-passage',task.model);ex.lang='de';ex.style.whiteSpace='pre-line';
 model.append(el('strong','','One possible model response (not the only correct one)'),ex,
    btn('🔊 Hear the example',()=>speak(task.model,true)));
 const toggle=btn('Show sample and self-check',()=>{model.hidden=false;toggle.hidden=true;},'a1-mock-primary');
 content.append(toggle,model);
 const tips=el('div','a1-mock-checklist');
 tips.append(el('strong','','Reflect on these task requirements:'));
 for(const line of task.tips){
  const label=el('label','a1-mock-check');
  const input=el('input');input.type='checkbox';
  label.append(input,el('span','',line));tips.append(label);
 }
 tips.append(el('p','a1-mock-help','These checkboxes are study reminders, not a verified examination grade. Ask a teacher to assess grammar, completeness, fluency and pronunciation.'));
 content.append(tips);
 const navigation=el('div','a1-mock-navigation');
 const previous=btn('← Previous task',()=>{index--;showTask();});previous.disabled=index===0;
 navigation.append(previous);
 navigation.append(btn(index===items.length-1?'Restart this practice':'Next task →',()=>{
   if(index===items.length-1){setSection(skill);return;}index++;showTask();
 },'a1-mock-primary'));
 content.append(navigation);
}
render();
window.DEUTSCH_A1_MOCK={countSets:sets.length};
})();