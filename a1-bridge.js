/* DeutschDaily bilingual grammar + essential-words bridge. Pure browser / offline.
   Exercises are original learning scaffolds, not official Goethe grading. */
(() => {
 'use strict';
 const vocab=window.DEUTSCH_A1_ESSENTIALS||[];
 const grammar=window.DEUTSCH_A1_GRAMMAR_BRIDGE||[];
 const wordRoot=document.getElementById('a1EssentialsRoot');
 const ruleRoot=document.getElementById('a1GrammarBridgeRoot');
 if(!wordRoot&&!ruleRoot)return;
 function el(tag,klass,value){
  const n=document.createElement(tag);if(klass)n.className=klass;
  if(value!==undefined)n.textContent=String(value);
  return n;
 }
 function button(label,fn,klass='a1-bridge-btn'){
  const n=el('button',klass,label);n.type='button';n.addEventListener('click',fn);return n;
 }
 function tts(de,slow,feedback){
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
   feedback.textContent='German audio is unavailable. Read the examples aloud or try a browser with a German speech voice.';return;
  }
  const synth=window.speechSynthesis;
  const german=synth.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('de'));
  const saved=document.getElementById('germanVoice')?.value;
  const voice=german.find(v=>v.voiceURI===saved)||german.find(v=>v.lang.toLowerCase()==='de-de')||german[0];
  if(!voice){feedback.textContent='Install a German device voice for audio. The text lessons and quizzes still work offline.';return;}
  try{
   synth.cancel();const u=new SpeechSynthesisUtterance(de);u.lang=voice.lang;u.voice=voice;u.rate=slow?0.68:0.92;
   u.onerror=()=>{feedback.textContent='German audio could not play. Check your device settings.';};synth.speak(u);
  }catch{feedback.textContent='German audio could not start on this device.';}
 }
 function controls(de,status){
  const row=el('div','a1-bridge-actions');
  row.append(button('🔊 Hear German',()=>tts(de,false,status)),
   button('◷ Hear slowly',()=>tts(de,true,status)));
  return row;
 }
 function selector(host,items,onSelect,active){
  const tabs=el('div','a1-bridge-tabs');
  tabs.setAttribute('role','group');
  tabs.setAttribute('aria-label','Choose a learning topic');
  items.forEach((item,i)=>{
   const b=button(item.title,()=>onSelect(i),'a1-bridge-tab');
   b.setAttribute('aria-pressed',String(active===i));
   if(i===active)b.classList.add('is-active');
   tabs.append(b);
  });
  host.append(tabs);
 }
 function renderWords(){
  if(!wordRoot||!vocab.length)return;
  let active=0,round=0,firstTry=0,wrong=false,done=false;
  const top=el('div','a1-bridge-word-top');
  const deck=el('div','a1-bridge-word-deck');
  const practice=el('section','a1-bridge-practice');
  const feedback=el('p','a1-bridge-feedback','');
  feedback.setAttribute('role','status');
  wordRoot.replaceChildren(top,deck,practice);
  function select(i){active=i;round=0;firstTry=0;wrong=false;done=false;draw();}
  function draw(){
   top.replaceChildren();
   selector(top,vocab,select,active);
   deck.replaceChildren();
   const group=vocab[active];
   deck.append(el('h4','a1-bridge-title',group.title),
      el('p','a1-bridge-help','Tap to hear each expression and its complete example. Learn meaning in English and नेपाली.'));
   const cards=el('div','a1-bridge-cards');
   for(const [de,en,ne,example,meaning] of group.items){
    const c=el('article','a1-bridge-card');
    const word=el('strong','a1-bridge-de',de);word.lang='de';
    const sentence=el('p','a1-bridge-sentence',example);sentence.lang='de';
    const status=el('p','a1-bridge-voice-status','');status.setAttribute('role','status');
    c.append(word,el('p','',en+' · '+ne),sentence,el('p','a1-bridge-example-en',meaning),controls(de,status),
      button('🔊 Sentence',()=>tts(example,false,status)),status);
    cards.append(c);
   }
   deck.append(cards);drawQuiz();
  }
  function drawQuiz(){
   practice.replaceChildren();
   const pack=vocab[active].items;
   practice.append(el('h4','a1-bridge-title','🎯 5 quick recall questions'));
   if(round>=5){
    practice.append(el('p','a1-bridge-result','You recognised '+firstTry+' of 5 expressions on the first try. Practice result, not a Goethe exam score.'),
     button('Try again ↻',()=>{round=0;firstTry=0;wrong=false;done=false;drawQuiz();},'a1-bridge-primary'));
    return;
   }
   const index=(round*3)%pack.length,target=pack[index],word=target[0];
   practice.append(el('p','a1-bridge-count','Question '+(round+1)+' of 5'));
   practice.append(el('p','a1-bridge-question','Which German expression means "'+target[1]+'" ('+target[2]+')?'));
   const slots=[index,(index+2)%pack.length,(index+5)%pack.length];
   const rotated=[slots[round%3],slots[(round+1)%3],slots[(round+2)%3]];
   const options=el('div','a1-bridge-choices');
   const status=el('p','a1-bridge-feedback','');status.setAttribute('role','status');
   wrong=false;done=false;
   for(const choiceIndex of rotated){
    const choice=button(pack[choiceIndex][0],()=>{
     if(done||choice.disabled)return;
     if(choiceIndex!==index){
      wrong=true;choice.disabled=true;choice.classList.add('is-wrong');
      status.textContent='Not quite. Think of the meaning and try another word.';return;
     }
     done=true;if(!wrong)firstTry++;
     choice.classList.add('is-correct');
     for(const child of options.children)child.disabled=true;
     status.textContent='✓ Richtig! '+word+' — '+target[1]+'.';
     const show=el('p','a1-bridge-sentence',target[3]);show.lang='de';practice.append(show);
     practice.append(controls(target[3],status));
     practice.append(button(round===4?'Finish →':'Next word →',()=>{round++;drawQuiz();},'a1-bridge-primary'));
    },'a1-bridge-choice');
    choice.lang='de';options.append(choice);
   }
   practice.append(options,status);
  }
  draw();
 }
 function renderGrammar(){
  if(!ruleRoot||!grammar.length)return;
  let active=0,round=0,firstTry=0,wrong=false,done=false;
  const nav=el('div','a1-bridge-rule-nav'),main=el('div','a1-bridge-rule-main');
  ruleRoot.replaceChildren(nav,main);
  function select(i){active=i;round=0;firstTry=0;wrong=false;done=false;draw();}
  function draw(){
   nav.replaceChildren();selector(nav,grammar,select,active);
   main.replaceChildren();
   const topic=grammar[active];
   const heading=el('div','a1-bridge-rule-heading');
   heading.append(el('h4','a1-bridge-title',topic.icon+' '+topic.title));
   const link=el('a','a1-bridge-unit-link','Study related lesson →');
   link.href='#/course/'+topic.unit;
   heading.append(link);main.append(heading);
   const guide=el('div','a1-bridge-explain');
   guide.append(el('p','',topic.en),el('p','a1-bridge-ne',topic.ne));
   const example=el('p','a1-bridge-tip',topic.tip);guide.append(example);
   main.append(guide);
   const qBox=el('section','a1-bridge-practice');main.append(qBox);
   function question(){
    qBox.replaceChildren();
    if(round>=topic.questions.length){
     qBox.append(el('h5','','✓ Workshop practised'),
      el('p','a1-bridge-result','You chose '+firstTry+' of '+topic.questions.length+' answers correctly on your first try. This is practice feedback, not language certification.'),
      button('Practise this rule again ↻',()=>{round=0;firstTry=0;question();},'a1-bridge-primary'));
     return;
    }
    wrong=false;done=false;
    const [sentence,choices,answer,en,ne,why]=topic.questions[round];
    qBox.append(el('p','a1-bridge-count','Exercise '+(round+1)+' of '+topic.questions.length));
    const prompt=el('p','a1-bridge-prompt',sentence);prompt.lang='de';qBox.append(prompt);
    qBox.append(el('p','a1-bridge-translation',en+' · '+ne));
    const options=el('div','a1-bridge-choices');
    const feedback=el('p','a1-bridge-feedback','');feedback.setAttribute('role','status');
    for(const [i,label] of choices.entries()){
     const b=button(label,()=>{
      if(done||b.disabled)return;
      if(i!==answer){wrong=true;b.disabled=true;b.classList.add('is-wrong');feedback.textContent='Try again. Review the short rule above.';return;}
      done=true;if(!wrong)firstTry++;
      b.classList.add('is-correct');
      for(const c of options.children)c.disabled=true;
      const correct=sentence.replace('___',choices[answer]);
      feedback.textContent='✓ '+why;
      const result=el('p','a1-bridge-sentence',correct);result.lang='de';
      qBox.append(result,controls(correct,feedback),
       button(round===topic.questions.length-1?'Finish →':'Next exercise →',()=>{round++;question();},'a1-bridge-primary'));
     },'a1-bridge-choice');
     b.lang='de';options.append(b);
    }
    qBox.append(options,feedback);
   }
   question();
  }
  draw();
 }
 renderWords();renderGrammar();
 window.DEUTSCH_A1_BRIDGE={wordGroups:vocab.length,grammarTopics:grammar.length};
})();