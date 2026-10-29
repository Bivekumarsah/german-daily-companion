/* Original A1 bilingual thematic vocabulary. Supplements, never rewrites, the 36 lesson banks. */
(() => {
'use strict';
const root=document.getElementById('a1ThemesRoot');
const packs=window.DEUTSCH_A1_THEME_PACKS||[];
if(!root||!packs.length)return;
let selected=0,round=0,score=0,answered=false;
const el=(tag,cls,content)=>{
 const n=document.createElement(tag);
 if(cls)n.className=cls;
 if(content!==undefined)n.textContent=content;
 return n;
};
const button=(text,fn,cls='a1-theme-btn')=>{
 const b=el('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;
};
const heading=el('p','a1-theme-caption','Ten everyday themes · 100 bilingual entries with articles and plural forms · Extra practice bank');
const tabs=el('div','a1-theme-tabs');
tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Choose a thematic vocabulary pack');
const list=el('div','a1-theme-list');
const challenge=el('div','a1-theme-challenge');
root.append(heading,tabs,list,challenge);
function speech(de,slow){
 if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
  status.textContent='No speech support. Use the written German word and meaning.';return;
 }
 const synth=window.speechSynthesis;
 const german=synth.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('de'));
 const current=document.getElementById('germanVoice')?.value;
 const voice=german.find(v=>v.voiceURI===current)||german[0];
 if(!voice){status.textContent='Install a German device voice to hear the words.';return;}
 try{
  synth.cancel();const u=new SpeechSynthesisUtterance(de);
  u.lang=voice.lang;u.voice=voice;u.rate=slow?0.68:0.94;
  u.onerror=()=>{status.textContent='Speech could not play on this device.';};
  synth.speak(u);
 }catch{status.textContent='Speech could not start.';}
}
const status=el('p','a1-theme-status','');
status.setAttribute('role','status');
root.append(status);
function setPack(i){
 if(i<0||i>=packs.length)return;
 selected=i;round=0;score=0;answered=false;
 showTabs();showList();showQuestion();
}
function showTabs(){
 tabs.replaceChildren();
 for(const [i,pack] of packs.entries()){
  const b=button(pack.title,()=>setPack(i),'a1-theme-tab');
  b.setAttribute('aria-pressed',String(selected===i));
  if(i===selected)b.classList.add('is-selected');
  tabs.append(b);
 }
}
function showList(){
 list.replaceChildren();
 const pack=packs[selected];
 list.append(el('h4','a1-theme-title',pack.title));
 const cards=el('div','a1-theme-cards');
 for(const [de,en,ne,plural] of pack.items){
  const card=el('article','a1-theme-card');
  const name=el('strong','a1-theme-word',de);name.lang='de';
  card.append(name,el('p','',en+' · '+ne),
   el('small','',plural==='—'?'No common singular/plural pair to memorise.':'Plural: '+plural));
  const actions=el('div','a1-theme-actions');
  actions.append(button('🔊 Hear',()=>speech(de,false)),
     button('◷ Slow',()=>speech(de,true)));
  card.append(actions);cards.append(card);
 }
 list.append(cards);
 status.textContent='Study the ten words, then try the five-question practice. Audio uses a German voice installed on your device.';
}
function showQuestion(){
 challenge.replaceChildren();
 const pack=packs[selected];
 const heading=el('h5','','5-question recall challenge');
 challenge.append(heading);
 if(round>=5){
  challenge.append(el('p','a1-theme-final','You recognised '+score+' of 5 entries on the first choice. Keep practising; this is not an official A1 exam score.'));
  challenge.append(button('Practise five words again ↻',()=>{round=0;score=0;showQuestion();},'a1-theme-primary'));
  return;
 }
 const target=pack.items[(round*2)%10];
 const optionsIndices=[(round*2)%10,(round*2+3)%10,(round*2+6)%10];
 const offset=round%3;
 const ordered=optionsIndices.map((_,i)=>optionsIndices[(i+offset)%3]);
 challenge.append(el('p','a1-theme-progress','Question '+(round+1)+' of 5'));
 challenge.append(el('p','a1-theme-prompt','Which German word means '+target[1]+' ('+target[2]+')?'));
 const choices=el('div','a1-theme-options');
 const feedback=el('p','a1-theme-feedback','');feedback.setAttribute('role','status');
 let firstAttempt=true;
 for(const i of ordered){
  const entry=pack.items[i];
  const choice=button(entry[0],()=>{
   if(choice.disabled || answered)return;
   if(entry===target){
    answered=true;
    if(firstAttempt)score++;
    for(const c of choices.children)c.disabled=true;
    choice.classList.add('is-correct');
    feedback.textContent='✓ Richtig! '+target[0]+' — '+target[1]+'.';
    const next=button(round===4?'Finish review →':'Next word →',()=>{round++;answered=false;showQuestion();},'a1-theme-primary');
    challenge.append(next);
   }else{
    firstAttempt=false;choice.disabled=true;choice.classList.add('is-wrong');
    feedback.textContent='Not this word. Try another option.';
   }
  },'a1-theme-option');
  choice.lang='de';choices.append(choice);
 }
 challenge.append(choices,feedback);
}
setPack(0);
window.DEUTSCH_A1_THEMES={packCount:packs.length};
})();