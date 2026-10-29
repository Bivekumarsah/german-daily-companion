/* Offline, privacy-conscious scaffolds for A1 productive skills.
   No external AI call, grading, recordings or automatic language correctness claims. */
(() => {
'use strict';
const guides=window.DEUTSCH_PRODUCTIVE_GUIDES;
if(!guides)return;
const make=(tag,cls,copy)=>{
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 if(copy!==undefined)node.textContent=copy;
 return node;
};
const button=(name,fn,cls='productive-btn')=>{
 const b=make('button',cls,name);b.type='button';b.addEventListener('click',fn);return b;
};
const wordCount=value=>(String(value).trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)||[]).length;
function addWriting(host,textarea,{key,goals}={}){
 if(!host || !textarea)return;
 const points=Array.isArray(goals)&&goals.length?goals:[
   'Respond to every part of the task in German.',
   'Check greetings, word order and spelling.',
   'Compare your response with the sample, then ask a teacher for feedback.'
 ];
 const box=make('section','productive-writing');
 box.append(make('h5','','✍️ Writing coach · step-by-step self-review'));
 box.append(make('p','productive-help','Your text stays in this browser. The feedback only checks length and your own checklist, not whether the German is correct.'));
 const stats=make('p','productive-stats','');
 stats.setAttribute('role','status');
 const list=make('fieldset','productive-checklist');
 list.append(make('legend','','Task goals · check these yourself'));
 const checks=[];
 for(const goal of points){
  const label=make('label','productive-check');
  const check=make('input');check.type='checkbox';
  label.append(check,make('span','',goal));
  check.addEventListener('change',update);
  checks.push(check);list.append(label);
 }
 const result=make('p','productive-review','');result.setAttribute('role','status');
 const languageHints=make('section','productive-language-hints');
 languageHints.append(make('h6','','German writing hints · Deutsch + नेपाली'));
 const hintBody=make('div','productive-hint-body','');
 languageHints.append(hintBody,make('p','productive-help','Pattern-based reminders only; no comprehensive grammar, word-order, spelling or Goethe writing grade.'));
 box.append(stats,list,result,languageHints);
 textarea.lang='de';
 textarea.spellcheck=true;
 const safeKey=typeof key==='string'&&/^[a-z0-9-]{3,30}$/.test(key)?'deutschdaily-draft-'+key:null;
 const controls=make('div','productive-actions');
 if(safeKey){
  try{
   const saved=localStorage.getItem(safeKey);
   if(saved && saved.length<=1800 && !textarea.value){textarea.value=saved;result.textContent='Previously saved draft restored from this browser.';}
  }catch{/* Storage may be unavailable; writing still works. */}
  const save=button('Save draft on this device',()=>{
   try{
    localStorage.setItem(safeKey,textarea.value.slice(0,1800));
    result.textContent='Draft saved only in this browser. It is not part of your progress JSON backup.';
   }catch{result.textContent='Browser storage unavailable. Copy your draft elsewhere to keep it.';}
  });
  const discard=button('Delete saved draft',()=>{
   try{localStorage.removeItem(safeKey);}catch{/* No storage permission. */}
   result.textContent='Saved draft cleared. Your current unsaved text stays in the editor.';
  });
  controls.append(save,discard);
 }
 const copy=button('Copy my German text',()=>{
  if(!textarea.value.trim()){result.textContent='Write a German response before copying.';return;}
  if(navigator.clipboard?.writeText){
   navigator.clipboard.writeText(textarea.value).then(()=>{result.textContent='Text copied. Consider asking a German teacher to check grammar and task completion.';})
   .catch(()=>{result.textContent='Copy was blocked. Select your text and copy it manually.';});
  }else{result.textContent='Select and copy your text manually; clipboard access is unavailable.';}
 });
 controls.append(copy);
 box.append(controls);
 function update(){
  const words=wordCount(textarea.value);
  const done=checks.filter(x=>x.checked).length;
  stats.textContent=words+' German word'+(words===1?'':'s')+' written · '+done+' / '+points.length+' goals self-checked';
  const hints=window.DEUTSCH_WRITING_HINTS?.analyze?.(textarea.value)||[];
  hintBody.replaceChildren();
  if(!textarea.value.trim()){
   hintBody.append(make('p','productive-hint-empty','Write a German sentence to see simple rule reminders.'));
  }else if(!hints.length){
   hintBody.append(make('p','productive-hint-empty','No supported common patterns detected. This does NOT mean the German is correct.'));
  }else{
   const list=make('ul','productive-hint-list');
   for(const hint of hints){
    const item=make('li','productive-hint-item');
    item.append(make('strong','',hint.en),make('p','productive-hint-ne',hint.ne));
    const example=make('p','productive-hint-example',hint.example);
    example.lang='de';
    item.append(example);list.append(item);
   }
   hintBody.append(list);
  }
  if(!textarea.value.trim())result.textContent='Start with a short German sentence. Check each goal after writing.';
  else if(words<3)result.textContent='Try to complete your response. This is too short for most A1 writing tasks.';
  else if(done===points.length)result.textContent='All goals checked by you. Compare with the model answer; grammatical correctness still needs human review.';
  else result.textContent='Read your task again. Tick a goal only when you believe your response addresses it.';
 }
 textarea.addEventListener('input',update);
 update();
 host.append(box);
 return {refresh:update};
}
function addSpeaking(host,{setId,taskIndex,speak}={}){
 const group=guides.dialogues[setId];
 const task=group?.[taskIndex];
 if(!host||!task||typeof speak!=='function')return;
 let round=0,answered=false,recording=null;
 const box=make('section','productive-speaking');
 const help=make('p','productive-help','Listen to a partner in German. Answer aloud before showing one possible reply. This tool cannot hear or grade your speech.');
 box.append(make('h5','','🗣️ Conversation practice · '+task.title),help);
 const panel=make('div','productive-turn');box.append(panel);host.append(box);
 function render(){
  recording?.dispose?.();recording=null;
  panel.replaceChildren();
  if(round>=task.turns.length){
   panel.append(make('p','productive-finished','✓ You practised all three conversation turns aloud.'),
    make('p','productive-help','Try again without reading the model, then practise with a partner for real feedback.'),
    button('Practise again ↻',()=>{round=0;answered=false;render();},'productive-primary'));
   return;
  }
  answered=false;
  const [de,en,ne,answer]=task.turns[round];
  panel.append(make('p','productive-count','Turn '+(round+1)+' of '+task.turns.length));
  const actions=make('div','productive-actions');
  actions.append(button('🔊 Hear your partner',()=>speak(de)),button('◷ Hear slowly',()=>speak(de,true)));
  panel.append(actions);
  const transcript=make('div','productive-transcript');
  transcript.hidden=true;
  const sentence=make('p','productive-german',de);sentence.lang='de';
  transcript.append(sentence,make('p','productive-meaning',en+' · '+ne));
  const openText=button('Read the partner’s words',()=>{transcript.hidden=false;openText.hidden=true;});
  panel.append(openText,transcript);
  const response=make('p','productive-help','Think of your own response, then say it aloud clearly.');
  panel.append(response);
  recording=window.DEUTSCH_SPEAKING_RECORDER?.mount?.(panel)||null;
  const confirm=button('✓ I answered aloud',()=>{
   if(answered)return;
   answered=true;
   confirm.hidden=true;
   const example=make('div','productive-example');
   const model=make('p','productive-german',answer);model.lang='de';
   example.append(make('strong','','One possible reply (not the only correct one)'),model);
   const repeat=make('div','productive-actions');
   repeat.append(button('🔊 Hear example',()=>speak(answer)),button('◷ Slow example',()=>speak(answer,true)));
   example.append(repeat,make('p','productive-help','Compare what you said with the example. Is your meaning clear? Do not treat this as a grade.'));
   panel.append(example,button(round===task.turns.length-1?'Finish dialogue →':'Next partner turn →',()=>{round++;render();},'productive-primary'));
  },'productive-primary');
  panel.append(confirm);
 }
 render();
 return {restart:()=>{round=0;render();},dispose:()=>{recording?.dispose?.();recording=null;}};
}
window.DEUTSCH_PRODUCTIVE_COACH={addWriting,addSpeaking,wordCount};
})();