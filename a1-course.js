/* Original DeutschDaily A1 course engine. No tracking, login, microphone upload or certification claim. */
(() => {
'use strict';
const data=window.DEUTSCH_A1;
if(!data?.units?.length)return;
const $=id=>document.getElementById(id);
const PROGRESS_KEY='deutschdaily-a1-pathway-v1';
const TEST_KEY='deutschdaily-a1-mock-v1';
const skills=['vocabulary','grammar','listening','reading','writing','speaking'];
const examDurations={listening:20,reading:25,writing:20,speaking:15};
let examSeconds=examDurations.listening*60,examTicker=null;
const labels={vocabulary:'Vocabulary',grammar:'Grammar',listening:'Listening',reading:'Reading',writing:'Writing',speaking:'Speaking'};
const storage=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{setNote('Storage is full or disabled. Your progress may not persist.');}};
const state=storage(PROGRESS_KEY,{});
const progress=(state&&typeof state==='object'&&!Array.isArray(state))?state:{};
let unit=null,tab='vocabulary',filter='All',keyword='',examSkill='listening',examIndex=0,examCorrect=0,examAnswered=false;
let recorder=null,recordedUrl=null,recordedParts=[];
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function clear(node){node.replaceChildren();return node;}
function button(text,callback,kind='secondary-btn'){const b=el('button',kind,text);b.type='button';b.addEventListener('click',callback);return b;}
function note(message){const n=$('courseNote');if(n){n.textContent=message;n.hidden=false;}}
function setNote(message){note(message);}
function speaking(text,slow=false){
 if(!('speechSynthesis' in window)){note('German audio is not supported in this browser.');return;}
 const synth=window.speechSynthesis;
 const voices=synth.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('de'));
 const selected=$('germanVoice')?.value;
 const voice=voices.find(v=>v.voiceURI===selected)||voices.find(v=>v.lang.toLowerCase()==='de-de')||voices[0];
 if(!voice){note('No German voice installed. Add a German speech voice in your device settings.');return;}
 synth.cancel();const utter=new SpeechSynthesisUtterance(text);utter.voice=voice;utter.lang=voice.lang;utter.rate=slow?.7:.94;
 utter.onerror=()=>note('Audio could not play. Try another German device voice.');synth.speak(utter);
}
function pstate(id){if(!progress[id]||typeof progress[id]!=='object')progress[id]={};return progress[id];}
function complete(id,skill){pstate(id)[skill]=true;pstate(id).updated=new Date().toISOString().slice(0,10);save(PROGRESS_KEY,progress);renderDashboard();renderSkillProgress();document.dispatchEvent(new Event('deutschdaily:progress-update'));}
function achieved(u){const p=pstate(u.id);return skills.every(s=>p[s]);}
function renderDashboard(){
 const done=data.units.filter(achieved).length;const total=data.units.length;
 $('a1Total').textContent=String(total);$('a1Done').textContent=String(done);$('a1Percent').textContent=total?`${Math.round(100*done/total)}%`:'0%';
 $('a1ProgressFill').style.width=(100*done/total)+'%';
 $('a1ProgressTrack').setAttribute('aria-valuenow',String(Math.round(100*done/total)));
 const upNext=data.units.find(u=>skills.some(skill=>!pstate(u.id)[skill]))||data.units[0];
 if(upNext){
  const practiced=skills.filter(skill=>pstate(upNext.id)[skill]).length;
  const label=$('a1ContinueTitle'),desc=$('a1ContinueStatus'),button=$('a1Continue');
  if(label)label.textContent=(done===total?'Review: ':'Continue: ')+upNext.title;
  if(desc)desc.textContent=done===total?
   'All units practised. Revisit words, listen slowly, and check your four A1 skills.':
   'Unit '+upNext.number+' · '+practiced+' / 6 activities practised · Try 10 focused minutes today';
  if(button){
   button.textContent=done===total?'Review Unit 1 →':(practiced?'Resume lesson →':'Start lesson →');
   button.onclick=()=>openUnit(upNext.id);
  }
 }
 const list=$('a1UnitGrid');clear(list);
 const units=data.units.filter(u=>(filter==='All'||u.group===filter)&&(`${u.title} ${u.grammar.title} ${u.vocab.map(v=>v.en).join(' ')}`.toLowerCase().includes(keyword)));
 for(const u of units){
  const doneSkills=skills.filter(s=>pstate(u.id)[s]).length;
  const card=button('',()=>openUnit(u.id),'a1-unit-card'+(doneSkills===6?' is-done':''));
  card.append(el('span','a1-unit-num',`UNIT ${String(u.number).padStart(2,'0')}`),el('strong','a1-unit-name',u.title),el('span','a1-unit-group',u.group),el('span','a1-unit-skill',`${doneSkills} / 6 skills practiced${doneSkills===6?' ✓':''}`));
  list.append(card);
 }
 $('a1EmptySearch').hidden=units.length>0;
}
function renderSkillProgress(){
 const target=$('a1SkillProgress');clear(target);if(!unit)return;
 for(const skill of skills){const b=button((pstate(unit.id)[skill]?'✓ ':'○ ')+labels[skill],()=>showTab(skill),'a1-skill-tab'+(tab===skill?' active':''));b.setAttribute('aria-pressed',String(tab===skill));target.append(b);}
 const practiced=skills.filter(s=>pstate(unit.id)[s]).length;
 $('a1UnitProgress').textContent=`${practiced} / 6 skills practiced · Self-study progress, not an exam grade`;
}
function openUnit(id){
 const found=data.units.find(u=>u.id===id);if(!found)return;
 if(recorder?.state==='recording')recorder.stop();unit=found;
 if(location.hash!==`#/course/${id}`)history.replaceState(null,'',`#/course/${id}`);
 $('a1Workspace').hidden=false;$('a1UnitTitle').textContent=`Unit ${unit.number}: ${unit.title}`;
 $('a1UnitSubtitle').textContent=`${unit.group} · Original A1 lesson · available offline`;
 showTab('vocabulary');$('a1Workspace').scrollIntoView({behavior:'smooth',block:'start'});
}
function showTab(next){if(!unit)return;tab=next;renderSkillProgress();const out=clear($('a1TabContent'));note('');$('courseNote').hidden=true;
 if(tab==='vocabulary')renderVocabulary(out);if(tab==='grammar')renderGrammar(out);
 if(tab==='listening')renderComprehension(out,'listening');if(tab==='reading')renderComprehension(out,'reading');
 if(tab==='writing')renderProductive(out,'writing');if(tab==='speaking')renderProductive(out,'speaking');
}
function heading(parent,title,desc){parent.append(el('h4','a1-task-title',title));if(desc)parent.append(el('p','a1-help',desc));}
function renderVocabulary(out){
 if(window.DEUTSCH_VISUAL_LAB?.render)window.DEUTSCH_VISUAL_LAB.render(out,unit,speaking);
 heading(out,'Words you should know','Tap 🔊 for German speech generated by an installed device voice. English and Nepali meanings are written for this lesson.');
 const grid=el('div','a1-vocab-grid');
 for(const w of unit.vocab){const row=el('div','a1-word-card');const de=el('strong','a1-word-de',w.de);de.lang='de';row.append(de,el('span','a1-word-en',w.en),el('span','a1-word-ne',w.ne));const play=button('🔊 Listen',()=>speaking(w.de),'a1-audio-small');play.setAttribute('aria-label',`Speak ${w.de}`);row.append(play);grid.append(row);}
 out.append(grid);
 out.append(button('✓ I reviewed the vocabulary',()=>complete(unit.id,'vocabulary'),'primary-btn'));
}
function renderGrammar(out){
 heading(out,unit.grammar.title,'Grammar explained in English and Nepali, with an original example.');
 out.append(el('p','a1-grammar-copy',unit.grammar.en),el('p','a1-grammar-ne',unit.grammar.ne));
 if(window.DEUTSCH_SENTENCE_BUILDER?.render)window.DEUTSCH_SENTENCE_BUILDER.render(out,unit,speaking);
 const ex=el('div','a1-example');const de=el('strong','',unit.grammar.example);de.lang='de';ex.append(de,el('span','',unit.grammar.exampleEn),el('span','a1-word-ne',unit.grammar.exampleNe));
 if(unit.grammar.pronEnglish&&unit.grammar.pronNepali){ex.append(el('small','a1-phon',`Approx. sounds: ${unit.grammar.pronEnglish} · ${unit.grammar.pronNepali}`));}
 ex.append(button('🔊 Listen',()=>speaking(unit.grammar.example),'a1-audio-small'),button('◷ Slow',()=>speaking(unit.grammar.example,true),'a1-audio-small'));
 out.append(ex,button('✓ I understood this rule',()=>complete(unit.id,'grammar'),'primary-btn'));
}
function mcq(out,item,onAnswer,{audio=false,allowReplay=true}={}){
 const wrap=el('div','a1-question');
 if(audio){wrap.append(button('🔊 Play German audio',()=>speaking(item.text),'primary-btn'));wrap.append(button('◷ Replay slowly',()=>speaking(item.text,true),'secondary-btn'));
  wrap.append(el('p','a1-help','Listen first. The transcript appears after you answer. Device-generated speech is not official exam audio.'));
 }else{const passage=el('p','a1-passage',item.text);passage.lang='de';wrap.append(passage);}
 wrap.append(el('p','a1-question-title',item.question));
 const choices=el('div','a1-options');const feedback=el('div','a1-feedback');feedback.setAttribute('role','status');
 item.choices.forEach((choice,i)=>{const b=button(choice,()=>{
  if([...choices.children].some(x=>x.disabled))return;
  const correct=i===item.answer;
  for(const [ix,ch] of [...choices.children].entries()){ch.disabled=true;if(ix===item.answer)ch.classList.add('correct');if(ix===i&&!correct)ch.classList.add('incorrect');}
  feedback.textContent=(correct?'✓ Correct. ':'Try again next time. ')+`Answer: ${item.choices[item.answer]}.`;
  if(audio){const transcript=el('p','a1-transcript',`Transcript: ${item.text}`);transcript.lang='de';wrap.append(transcript);}
  onAnswer(correct);
 },'a1-choice');choices.append(b)});
 wrap.append(choices,feedback);out.append(wrap);
}
function renderComprehension(out,skill){
 const audio=skill==='listening';heading(out,audio?'Listening comprehension':'Reading comprehension',audio?'Press play and listen for the key detail. You may listen again.':'Read the original short German passage and choose the correct meaning.');
 mcq(out,unit[skill],()=>complete(unit.id,skill),{audio});
}
function wordCount(s){return (s.trim().match(/\S+/g)||[]).length;}
function renderProductive(out,skill){
 const task=unit[skill];const writing=skill==='writing';
 heading(out,writing?'Writing practice':'Speaking practice',writing?'Write your own German message, then compare with an example. No automatic grammar scoring.':'Say your answer aloud, optionally record and replay it, then compare with the model. Recording stays on your device.');
 out.append(el('p','a1-passage',task.prompt));
 let textarea=null;
 if(writing){textarea=el('textarea','a1-writing');textarea.rows=5;textarea.lang='de';textarea.maxLength=1400;textarea.placeholder='Schreiben Sie hier auf Deutsch …';
  const meter=el('p','a1-help','0 words written');textarea.addEventListener('input',()=>{meter.textContent=`${wordCount(textarea.value)} words written`;});out.append(textarea,meter);
  if(window.DEUTSCH_PRODUCTIVE_COACH?.addWriting)window.DEUTSCH_PRODUCTIVE_COACH.addWriting(out,textarea,{key:unit.id,goals:window.DEUTSCH_PRODUCTIVE_GUIDES?.writingGoals?.[unit.id]});
 }else{
  out.append(button('🔊 Hear a sample response',()=>speaking(task.model),'secondary-btn'));
  const recordBox=el('div','a1-record-controls');const start=button('🎙 Record yourself',async()=>{
   if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){note('Recording is not available on this browser. You can still speak aloud.');return;}
   try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});if(recorder?.state==='recording')recorder.stop();
    recordedParts=[];if(recordedUrl){URL.revokeObjectURL(recordedUrl);recordedUrl=null;}
    recorder=new MediaRecorder(stream);
    recorder.ondataavailable=e=>{if(e.data.size)recordedParts.push(e.data);};
    recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());if(!recordedParts.length)return;const blob=new Blob(recordedParts,{type:recorder.mimeType||'audio/webm'});recordedUrl=URL.createObjectURL(blob);play.disabled=false;recordBox.dataset.recorded='true';};
    recorder.start();start.disabled=true;stop.disabled=false;note('Recording… press Stop when done. Audio is kept only on this page.');
   }catch{note('Microphone permission denied or unavailable. Speak aloud without recording.');}
  },'secondary-btn');
  const stop=button('■ Stop',()=>{if(recorder?.state==='recording')recorder.stop();start.disabled=false;stop.disabled=true;note('Recording stopped. Play it back to compare.');},'secondary-btn');stop.disabled=true;
  const play=button('▶ Hear my recording',()=>{if(!recordedUrl)return;const audio=new Audio(recordedUrl);audio.play().catch(()=>note('Recording playback unavailable.'));},'secondary-btn');play.disabled=true;
  recordBox.append(start,stop,play);out.append(recordBox,el('p','a1-help','Your microphone is optional. The app does not recognize or score your speech.'));
 }
 const reveal=button('Show example answer',()=>{model.hidden=false;reveal.hidden=true;},'secondary-btn');
 const model=el('div','a1-model');model.hidden=true;model.append(el('small','a1-help','Example answer — your response can be different'));const t=el('p','a1-passage',task.model);t.lang='de';model.append(t,button('🔊 Hear example',()=>speaking(task.model,true),'a1-audio-small'));
 out.append(reveal,model);
 const mark=button(writing?'✓ I wrote and compared my answer':'✓ I spoke and checked my answer',()=>{
  if(writing&&(!textarea||wordCount(textarea.value)<3)){note('Write at least three German words before marking practice complete.');return;}
  if(model.hidden){note('Open the example answer and compare your response before marking it complete.');return;}
  complete(unit.id,skill);note('Practice recorded. This is a self-check, not an automatic assessment.');
 },'primary-btn');out.append(mark);
}
function timeLabel(seconds){const m=Math.floor(seconds/60),s=seconds%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function showExamTime(){const t=$('examTimer');if(t)t.textContent=timeLabel(examSeconds);}
function pauseExamTimer(){if(examTicker!==null){clearInterval(examTicker);examTicker=null;}const start=$('examTimerStart'),pause=$('examTimerPause');if(start)start.disabled=examSeconds===0;if(pause)pause.disabled=true;}
function resetExamTimer(){pauseExamTimer();examSeconds=examDurations[examSkill]*60;showExamTime();}
function startExamTimer(){if(examTicker!==null||examSeconds<=0)return;const start=$('examTimerStart'),pause=$('examTimerPause');if(start)start.disabled=true;if(pause)pause.disabled=false;
 examTicker=setInterval(()=>{examSeconds=Math.max(0,examSeconds-1);showExamTime();if(!examSeconds){pauseExamTimer();const body=$('a1ExamContent');if(body){const alert=el('p','a1-exam-warning','Time is up for this practice timer. You may finish the exercise at your own pace; this is not an exam grade.');body.prepend(alert);}}},1000);
}
function renderExam(){
 $('a1ExamTitle').textContent=({listening:'Hören · Listening',reading:'Lesen · Reading',writing:'Schreiben · Writing',speaking:'Sprechen · Speaking'})[examSkill];
 $('a1ExamInfo').textContent=({listening:'20 minutes in the official exam · 12 original self-check questions here',reading:'25 minutes in the official exam · 12 original self-check questions here',writing:'20 minutes in the official exam · 3 original prompts (self-checked)',speaking:'15 minutes in the official group exam · 3 speaking prompts (self-checked)'})[examSkill];
 for(const b of $('a1ExamTabs').querySelectorAll('button')){b.classList.toggle('active',b.dataset.skill===examSkill);b.setAttribute('aria-pressed',String(b.dataset.skill===examSkill));}
 const out=clear($('a1ExamContent'));const items=data.exam[examSkill];
 if(examIndex>=items.length){out.append(el('h4','', 'Practice finished'));
  if(['listening','reading'].includes(examSkill))out.append(el('p','a1-help',`Correct answers: ${examCorrect} / ${items.length}. This is not a Goethe examination score.`));
  else out.append(el('p','a1-help','All practice prompts viewed. For real feedback, work with a tutor or speaking partner.'));
  out.append(button('Practice this skill again',()=>{examIndex=0;examCorrect=0;renderExam()},'primary-btn'));return;
 }
 out.append(el('p','a1-help',`Exercise ${examIndex+1} of ${items.length}`));
 if(['listening','reading'].includes(examSkill)){
  const after=correct=>{if(examAnswered)return;examAnswered=true;if(correct)examCorrect++;
   out.append(button('Next exercise →',()=>{examIndex++;examAnswered=false;renderExam()},'primary-btn'));
  };
  mcq(out,items[examIndex],after,{audio:examSkill==='listening'});
 }else{
  const task=items[examIndex];out.append(el('p','a1-passage',task.prompt));
  let wrote=null;
  if(examSkill==='writing'){
    wrote=el('textarea','a1-writing');wrote.rows=6;wrote.maxLength=1400;wrote.lang='de';wrote.placeholder='Write your own German answer here before reading the example…';
    const count=el('p','a1-help','0 words written');wrote.addEventListener('input',()=>count.textContent=`${wordCount(wrote.value)} words written`);out.append(wrote,count);
  } else out.append(el('p','a1-help','Speak your complete answer aloud before revealing the example. Practice with a partner or teacher for feedback.'));
  const model=el('div','a1-model');model.hidden=true;model.append(el('p','a1-help','One possible answer; other correct answers exist.'));
  const example=el('p','a1-passage',task.model);example.lang='de';example.style.whiteSpace='pre-line';model.append(example,button('🔊 Listen to sample',()=>speaking(task.model,true),'secondary-btn'));
  const reveal=button('Reveal example to compare',()=>{model.hidden=false;reveal.hidden=true},'secondary-btn');
  const checklist=el('div','exam-self-check');checklist.append(el('h4','',examSkill==='writing'?'Check your writing':'Check your speaking'));
  const checks=examSkill==='writing' ? ['I answered every part of the task.','My text is clear and uses relevant German words.','I checked basic grammar, spelling and polite forms.'] : ['I attempted the German answer aloud.','My answer fits the question or role-play task.','I listened to the model and considered my pronunciation.'];
  const boxes=checks.map(label=>{const wrap=el('label');const check=document.createElement('input');check.type='checkbox';wrap.append(check,document.createTextNode(label));checklist.append(wrap);return check});
  checklist.append(el('p','', 'Self-check only. No automated writing or pronunciation scoring is performed.'));
  const feedback=el('p','a1-feedback');feedback.setAttribute('role','status');
  const next=button('Next practice prompt →',()=>{
    if(examSkill==='writing' && wordCount(wrote?.value||'')<5){feedback.textContent='Write at least five German words first.';return;}
    if(model.hidden){feedback.textContent='Compare your answer with the example first.';return;}
    if(!boxes.every(b=>b.checked)){feedback.textContent='Complete the self-check before continuing, or honestly mark what you attempted.';return;}
    examIndex++;renderExam();
  },'primary-btn');
  out.append(reveal,model,checklist,feedback,next);
 }
}
const REVIEW_KEY='deutschdaily-a1-vocabulary-review-v1';
const reviewRaw=storage(REVIEW_KEY,{});
const review=(reviewRaw&&typeof reviewRaw==='object'&&!Array.isArray(reviewRaw))?reviewRaw:{};
const reviewList=[...new Map(data.units.flatMap(u=>u.vocab).map(w=>[w.de.toLowerCase(),w])).values()];
let reviewCurrent=null,reviewSeen=new Set();
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function afterDays(days){const d=new Date();d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function due(w){return !review[w.de.toLowerCase()]?.due||review[w.de.toLowerCase()].due<=today();}
function renderReview(){
 const ready=reviewList.filter(due);
 $('a1ReviewStatus').textContent=`${ready.length} due today · ${reviewList.length} unique words in this course · Review history saved on your device.`;
 if(!ready.length){
  reviewCurrent=null;$('a1ReviewCard').hidden=true;$('a1ReviewStatus').textContent+=' You have reviewed all words due today. Return another day.';return;
 }
 $('a1ReviewCard').hidden=false;
 let available=ready.filter(w=>!reviewSeen.has(w.de.toLowerCase()));
 if(!available.length){reviewSeen=new Set();available=ready;}
 reviewCurrent=available[0];reviewSeen.add(reviewCurrent.de.toLowerCase());
 $('a1ReviewWord').textContent=reviewCurrent.de;
 $('a1ReviewEnglish').textContent=reviewCurrent.en;
 $('a1ReviewNepali').textContent=reviewCurrent.ne;
 $('a1ReviewAnswer').hidden=true;$('a1ReviewGrades').hidden=true;$('a1ReviewReveal').hidden=false;
}
function gradeReview(kind){
 if(!reviewCurrent||$('a1ReviewAnswer').hidden)return;
 const key=reviewCurrent.de.toLowerCase();const prev=review[key]||{interval:0,repetitions:0};
 let days=0,repetitions=prev.repetitions||0;
 if(kind==='again'){days=0;repetitions=0;}
 else if(kind==='good'){days=prev.interval===0?1:Math.min(120,Math.max(2,Math.round(prev.interval*2)));repetitions++;}
 else {days=prev.interval===0?3:Math.min(120,Math.max(4,Math.round(prev.interval*3)));repetitions++;}
 review[key]={due:afterDays(days),interval:days,repetitions};
 save(REVIEW_KEY,review);renderReview();
}
function syncReview(){const restored=storage(REVIEW_KEY,{});Object.keys(review).forEach(k=>delete review[k]);if(restored&&typeof restored==='object'&&!Array.isArray(restored))Object.assign(review,restored);reviewSeen.clear();renderReview();}
function init(){
 const groups=['All',...new Set(data.units.map(u=>u.group))];const menu=$('a1Filter');
 groups.forEach(group=>{const option=el('option','',group);option.value=group;menu.append(option);});
 menu.addEventListener('change',()=>{filter=menu.value;renderDashboard()});
 $('a1Search').addEventListener('input',()=>{keyword=$('a1Search').value.toLowerCase().trim();renderDashboard()});
 $('a1SkillProgress').addEventListener('keydown',e=>{if(e.key==='Escape')$('a1Workspace').hidden=true;});
 $('a1Close').addEventListener('click',()=>{$('a1Workspace').hidden=true;unit=null;if(recorder?.state==='recording')recorder.stop();history.replaceState(null,'','#/course');});
 document.addEventListener('deutschdaily:open-unit',event=>{if(event.detail?.id)openUnit(event.detail.id)});
 $('a1Prev').addEventListener('click',()=>{if(unit&&unit.number>1)openUnit(data.units[unit.number-2].id)});
 $('a1Next').addEventListener('click',()=>{if(unit&&unit.number<data.units.length)openUnit(data.units[unit.number].id)});
 $('a1ReviewListen').addEventListener('click',()=>reviewCurrent&&speaking(reviewCurrent.de));
 $('a1ReviewReveal').addEventListener('click',()=>{$('a1ReviewAnswer').hidden=false;$('a1ReviewGrades').hidden=false;$('a1ReviewReveal').hidden=true;});
 $('a1ReviewAgain').addEventListener('click',()=>gradeReview('again'));
 $('a1ReviewGood').addEventListener('click',()=>gradeReview('good'));
 $('a1ReviewEasy').addEventListener('click',()=>gradeReview('easy'));
 $('a1ExamTabs').addEventListener('click',e=>{const b=e.target.closest('button[data-skill]');if(!b)return;examSkill=b.dataset.skill;examIndex=0;examCorrect=0;examAnswered=false;resetExamTimer();renderExam()});
 $('examTimerStart').addEventListener('click',startExamTimer);$('examTimerPause').addEventListener('click',pauseExamTimer);$('examTimerReset').addEventListener('click',resetExamTimer);
 const totalWords=new Set(data.units.flatMap(u=>u.vocab.map(w=>w.de.toLowerCase()))).size;
 $('a1VocabularyCount').textContent=String(totalWords);
 document.addEventListener('deutschdaily:restore-a1',()=>{
   const restored=storage(PROGRESS_KEY,{});
   Object.keys(progress).forEach(id=>delete progress[id]);
   if(restored&&typeof restored==='object'&&!Array.isArray(restored))Object.assign(progress,restored);
   renderDashboard();renderSkillProgress();syncReview();
 });
 renderDashboard();renderExam();renderReview();showExamTime();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
