/* DeutschDaily pronunciation practice: an independent, offline-first A1 teaching tool.
   No voice analysis, cloud recordings, or Goethe scoring. */
(() => {
  'use strict';
  const ROOT_ID='pronunciationRoot';
  const KEY='deutschdaily-pronunciation-v1';
  const sounds=window.DEUTSCH_PRONUNCIATION_DATA||[];
  const byId=new Map(sounds.map(s=>[s.id,s]));
  const root=document.getElementById(ROOT_ID);
  if(!root||!sounds.length)return;
  const el=(tag,cls,txt)=>{
    const n=document.createElement(tag);
    if(cls)n.className=cls;
    if(txt!==undefined)n.textContent=txt;
    return n;
  };
  const button=(label,fn,klass='pl-button')=>{
    const b=el('button',klass,label);
    b.type='button';b.addEventListener('click',fn);return b;
  };
  const stored=()=>{
    try{
      const data=JSON.parse(localStorage.getItem(KEY)||'[]');
      return new Set(Array.isArray(data)?data.filter(id=>byId.has(id)):[]);
    }catch{return new Set();}
  };
  let practised=stored(),selected=sounds.find(s=>!practised.has(s.id))?.id||sounds[0].id;
  let stream=null,recorder=null,recordingUrl=null;
  const intro=el('div','pl-intro');
  intro.append(el('h3','pl-intro-title','12 German sounds to hear and practise'));
  intro.append(el('p','pl-help','Listen, compare, and speak aloud. English-sound and नेपाली guides are approximations, not perfect German pronunciation. Follow the German audio and mouth-position tips first.'));
  const progress=el('p','pl-progress','');
  progress.setAttribute('role','status');
  const cards=el('div','pl-sound-grid');
  cards.setAttribute('role','group');
  cards.setAttribute('aria-label','Choose a German pronunciation topic');
  const detail=el('div','pl-detail');
  detail.setAttribute('aria-label','Selected German sound lesson');
  root.append(intro,progress,cards,detail);
  function updateProgress(){
    progress.textContent=practised.size+' of '+sounds.length+' sound lessons self-marked as practised · Not a pronunciation test score.';
  }
  function showCards(){
    cards.replaceChildren();
    for(const [i,s] of sounds.entries()){
      const b=button('',()=>select(s.id),'pl-sound-card');
      b.append(el('span','pl-sound-symbol',s.symbol),el('strong','pl-sound-name',s.title),
        el('small','pl-sound-number','Sound '+(i+1)+' of '+sounds.length+(practised.has(s.id)?' · ✓ practised':'')));
      b.setAttribute('aria-pressed',String(selected===s.id));
      if(selected===s.id)b.classList.add('is-selected');
      cards.append(b);
    }
    updateProgress();
  }
  function notice(text){const n=detail.querySelector('.pl-audio-notice');if(n)n.textContent=text;}
  function speak(german,slow=false){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){
      notice('German device audio is unavailable in this browser. Read the lesson and try a compatible device.');return;
    }
    const synth=window.speechSynthesis;
    const voices=synth.getVoices().filter(v=>(v.lang||'').toLowerCase().startsWith('de'));
    const selectedURI=document.getElementById('germanVoice')?.value;
    const voice=voices.find(v=>v.voiceURI===selectedURI)||voices.find(v=>v.lang.toLowerCase()==='de-de')||voices[0];
    if(!voice){notice('A German voice is not installed. Install one in your device speech settings, then try again.');return;}
    try{
      synth.cancel();
      const utt=new SpeechSynthesisUtterance(german);
      utt.lang=voice.lang;utt.voice=voice;utt.rate=slow?0.65:0.9;
      utt.onerror=()=>notice('German audio could not play. Try a different German voice in device settings.');
      synth.speak(utt);
      notice('Listen to the German voice. The English and Nepali hints are only approximations.');
    }catch{notice('Speech could not start on this device. Check your browser audio settings.');}
  }
  function cleanupRecording(){
    const oldRecorder=recorder;
    recorder=null; // Invalidate pending recording callbacks before stopping the mic.
    if(oldRecorder?.state==='recording')oldRecorder.stop();
    if(stream){for(const track of stream.getTracks())track.stop();stream=null;}
    recorder=null;
    if(recordingUrl && typeof URL!=='undefined' && URL.revokeObjectURL){URL.revokeObjectURL(recordingUrl);}
    recordingUrl=null;
  }
  function select(id){
    if(!byId.has(id))return;
    cleanupRecording();
    selected=id;
    showCards();
    showDetail();
    detail.scrollIntoView?.({behavior:'smooth',block:'start'});
  }
  function showDetail(){
    const s=byId.get(selected);if(!s)return;
    detail.replaceChildren();
    const top=el('div','pl-detail-top');
    top.append(el('span','pl-ipa',s.symbol+' · '+s.ipa),el('h4','pl-heading',s.title));
    detail.append(top);
    const tips=el('div','pl-tips');
    tips.append(el('p','',s.en),el('p','pl-nepali',s.ne));
    detail.append(tips);
    const samples=el('div','pl-samples');
    for(const [de,en,ne,approxEn,approxNe] of s.words){
      const sample=el('div','pl-sample');
      const title=el('strong','pl-sample-german',de);title.lang='de';
      sample.append(title,el('p','',en+' · '+ne),
        el('small','pl-approx','Approx. English: '+approxEn),
        el('small','pl-approx pl-nepali','नेपाली संकेत: '+approxNe));
      sample.append(button('🔊 Hear',()=>speak(de)),button('◷ Slow',()=>speak(de,true)));
      samples.append(sample);
    }
    detail.append(samples);
    const note=el('p','pl-audio-notice','If no German voice is installed, speech playback may be unavailable.');
    note.setAttribute('role','status');
    detail.append(note);
    const drill=el('section','pl-drill');
    drill.append(el('h5','','🎧 Which German word did you hear?'),
      el('p','pl-help','Listen first. Choose the correct word, then repeat it aloud. Two short rounds; this is recognition practice, not automatic speaking assessment.'));
    const count=el('p','pl-round','');
    const controls=el('div','pl-actions');
    const questions=[0,1];
    let round=0,right=0,answered=false;
    const play=button('🔊 Play mystery word',()=>speak(s.words[questions[round]][0]));
    const slow=button('◷ Replay slowly',()=>speak(s.words[questions[round]][0],true));
    controls.append(play,slow);
    const options=el('div','pl-choices');
    const result=el('p','pl-result','');result.setAttribute('role','status');
    result.setAttribute('aria-live','polite');
    const next=button('Next round →',advance,'pl-next');next.hidden=true;
    drill.append(count,controls,options,result,next);
    detail.append(drill);
    function renderRound(){
      answered=false;
      result.textContent='';
      options.replaceChildren();
      next.hidden=true;
      controls.hidden=false;
      count.textContent='Listening round '+(round+1)+' of '+questions.length;
      const order=round===0?[1,0]:[0,1];
      for(const i of order){
        const choice=button(s.words[i][0],()=>{
          if(answered)return;
          answered=true;
          const correct=i===questions[round];
          if(correct)right++;
          for(const btn of options.children)btn.disabled=true;
          choice.classList.add(correct?'pl-correct':'pl-incorrect');
          const target=s.words[questions[round]];
          result.textContent=(correct?'✓ Correct! ':'Try again next time. ')+
            'You heard '+target[0]+' ('+target[1]+' / '+target[2]+'). Repeat it aloud.';
          next.textContent=round===1?'Finish exercise →':'Next round →';
          next.hidden=false;
        },'pl-choice');
        choice.lang='de';
        options.append(choice);
      }
    }
    function advance(){
      if(round>=questions.length){round=0;right=0;renderRound();return;}
      if(!answered)return;
      round++;
      if(round<questions.length){renderRound();return;}
      controls.hidden=true;options.replaceChildren();
      count.textContent='✓ Listening practice complete';
      result.textContent='You recognised '+right+' of 2 words. This is not a Goethe score or proof of correct spoken pronunciation.';
      next.textContent='Practise again ↻';
      next.hidden=false;
    }
    renderRound();

    const speaking=el('section','pl-speaking');
    speaking.append(el('h5','','🗣️ Listen, repeat, and compare'));
    const phrase=el('p','pl-speak-phrase',s.phrase);phrase.lang='de';
    speaking.append(phrase);
    const speakControls=el('div','pl-actions');
    speakControls.append(button('🔊 Hear sentence',()=>speak(s.phrase)),
      button('◷ Slow sentence',()=>speak(s.phrase,true)));
    speaking.append(speakControls);
    const steps=el('p','pl-help','1. Listen twice. 2. Speak the sentence aloud three times. 3. Compare with the German audio and your mouth-position tip.');
    speaking.append(steps);
    const recording=el('div','pl-recording');
    if(navigator.mediaDevices?.getUserMedia && typeof MediaRecorder!=='undefined'){
      const recordStatus=el('p','pl-record-status','Optional: record your voice locally to listen back. It is not uploaded or automatically graded.');
      recordStatus.setAttribute('role','status');
      const playback=el('audio','pl-playback');
      playback.controls=true;
      playback.hidden=true;
      const recordBtn=button('🎙️ Record my voice',async()=>{
        if(recorder?.state==='recording'){recorder.stop();recordBtn.textContent='🎙️ Record again';return;}
        cleanupRecording();
        try{
          const requested=await navigator.mediaDevices.getUserMedia({audio:true});
          if(selected!==s.id || !/^#\/practice(?:\/|$)/.test(location.hash)){
            requested.getTracks().forEach(t=>t.stop());return;
          }
          stream=requested;
          const chunks=[];
          const activeRecorder=new MediaRecorder(requested);
          recorder=activeRecorder;
          activeRecorder.addEventListener('dataavailable',e=>{if(e.data?.size)chunks.push(e.data);});
          activeRecorder.addEventListener('stop',()=>{
            requested.getTracks().forEach(t=>t.stop());
            if(stream===requested)stream=null;
            if(recorder!==activeRecorder || selected!==s.id)return;
            if(chunks.length){
              recordingUrl=URL.createObjectURL(new Blob(chunks,{type:activeRecorder.mimeType||'audio/webm'}));
              playback.src=recordingUrl;playback.hidden=false;
              recordStatus.textContent='Your recording is available below on this device only. Compare it with the German audio.';
            }else recordStatus.textContent='No recording was captured. You can retry.';
          });
          activeRecorder.start();
          playback.hidden=true;recordBtn.textContent='■ Stop recording';
          recordStatus.textContent='Recording locally… tap Stop recording when finished.';
        }catch{
          if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}
          recordStatus.textContent='Microphone access unavailable or declined. You can still listen and repeat aloud.';
        }
      });
      recording.append(recordBtn,recordStatus,playback);
    }else{
      recording.append(el('p','pl-help','Microphone recording is optional and not supported in this browser. You can still practise speaking aloud.'));
    }
    speaking.append(recording);
    const mark=button(practised.has(s.id)?'✓ Marked as practised':'✓ I practised this sound',()=>{
      practised.add(s.id);
      try{localStorage.setItem(KEY,JSON.stringify([...practised]));}
      catch{notice('Browser storage is unavailable; this practice mark may not be saved.');}
      mark.textContent='✓ Marked as practised';
      showCards();
    },'pl-mark');
    speaking.append(mark,el('p','pl-disclaimer','Practice marks are self-reported. They do not verify spoken accuracy or predict an A1 exam result.'));
    detail.append(speaking);
  }
  window.addEventListener('hashchange',()=>{
    if(!/^#\/practice(?:\/|$)/.test(location.hash))cleanupRecording();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)cleanupRecording();
  });
  document.addEventListener('deutschdaily:restore-a1',()=>{practised=stored();showCards();showDetail();});
  showCards();showDetail();
  window.DEUTSCH_PRONUNCIATION_LAB={sounds,renderSound:id=>select(id)};
})();