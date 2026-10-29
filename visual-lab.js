/* Visual-first, original A1 memory cues. Supplemental practice; not an exam score. */
(() => {
  'use strict';
  const lessons = {
    'a1-01': {title:'Meet the German alphabet',items:[
      ['🅰️','A','letter A','अक्षर ए','AH','आ'],
      ['🅱️','B','letter B','अक्षर बी','BAY','बे'],
      ['Ⓒ','C','letter C','अक्षर सी','TSAY','त्से']
    ]},
    'a1-03': {title:'I, you and polite you',items:[
      ['🙋','ich','I','म','ikh','इख'],
      ['👉','du','you (informal)','तिमी','doo','डू'],
      ['🤝','Sie','you (formal)','तपाईं','zee','जी']
    ]},
    'a1-06': {title:'Time and appointments',items:[
      ['🕘','neun Uhr','nine o’clock','नौ बजे','NOYN oor','नोइन ऊर'],
      ['📅','Montag','Monday','सोमबार','MOHN-tahk','मोन्टाग'],
      ['☀️','heute','today','आज','HOY-tuh','होइटे']
    ]},
    'a1-14': {title:'Ask simple questions',items:[
      ['👤','wer','who','को','vair','वेर'],
      ['📍','wo','where','कहाँ','voh','वो'],
      ['⏰','wann','when','कहिले','vahn','वान']
    ]},
    'a1-02': {title:'Greetings you can picture',items:[
      ['👋','Hallo','hello','नमस्ते','HAH-loh','हालो'],
      ['☀️','Guten Morgen','good morning','शुभ प्रभात','GOO-ten MOR-gen','गुटेन मोर्गेन'],
      ['🙏','Danke','thank you','धन्यवाद','DAHN-kuh','डान्के']
    ]},
    'a1-05': {title:'Count what you see',items:[
      ['🍎','eins','one','एक','EYNS','आइन्स'],
      ['🍎🍎','zwei','two','दुई','TSVY','त्स्वाइ'],
      ['🍎🍎🍎','drei','three','तीन','DRY','ड्राइ']
    ]},
    'a1-07': {title:'Meet the family',items:[
      ['👩','die Mutter','mother','आमा','dee MOOT-er','डी मुटर'],
      ['👨','der Vater','father','बुबा','dair FAH-ter','डेअर फाटर'],
      ['🧒','das Kind','child','बच्चा','dahs KINT','दास किन्ट']
    ]},
    'a1-10': {title:'Find things at home',items:[
      ['🏠','das Haus','house','घर','dahs HOWS','दास हाउस'],
      ['🛏️','das Bett','bed','ओछ्यान','dahs BET','दास बेट'],
      ['🚪','die Tür','door','ढोका','dee TUE-r','डी ट्युर']
    ]},
    'a1-16': {title:'A little German café',items:[
      ['💧','das Wasser','water','पानी','dahs VAH-ser','दास वासर'],
      ['🍎','der Apfel','apple','स्याउ','dair AHP-fel','डेअर आप्फेल'],
      ['🍞','das Brot','bread','रोटी','dahs BROHT','दास ब्रोट']
    ]},
    'a1-19': {title:'Choose what to wear',items:[
      ['👕','das Hemd','shirt','सर्ट','dahs HEMT','दास हेम्ट'],
      ['🧥','die Jacke','jacket','ज्याकेट','dee YAH-kuh','डी याके'],
      ['👟','der Schuh','shoe','जुत्ता','dair SHOO','डेअर शू']
    ]},
    'a1-23': {title:'Getting around town',items:[
      ['🚌','der Bus','bus','बस','dair BOOSS','डेअर बुस'],
      ['🚆','der Zug','train','रेल','dair TSOOK','डेअर त्सूक'],
      ['🚲','das Fahrrad','bicycle','साइकल','dahs FAH-raht','दास फाराट']
    ]},
    'a1-25': {title:'At the doctor',items:[
      ['🙂','der Kopf','head','टाउको','dair KOPF','डेअर कोप्फ'],
      ['✋','die Hand','hand','हात','dee HANT','डी हान्ट'],
      ['🩺','der Arzt','doctor','डाक्टर','dair AHRST','डेअर आर्ट्स्ट']
    ]}
  };

  function el(tag,className,text) {
    const n=document.createElement(tag);
    if(className)n.className=className;
    if(text!==undefined)n.textContent=text;
    return n;
  }

  const topicIcons={
    'Foundations':'🔤','People & home':'🏡','Grammar & communication':'🧩',
    'Everyday life':'☕','Situations':'🗺️','Exam preparation':'🎓'
  };
  const wordIcons={
    'das land':'🌍','nepal':'🇳🇵','deutschland':'🇩🇪','indien':'🇮🇳',
    'jung':'🧒','alt':'👴','groß':'📏','klein':'🔎',
    'der beruf':'💼','arbeiten':'💼','studieren':'🎓','lernen':'📖',
    'der tisch':'🪑','die lampe':'💡','das buch':'📘',
    'machen':'🛠️','spielen':'⚽','fragen':'❓','hören':'👂',
    'sein':'🙋','haben':'🎒','bin':'🙋','bist':'👉','ist':'✅',
    'nicht':'🚫','kein':'🚫','keine':'🚫','nie':'🚫',
    'die speisekarte':'📋','die rechnung':'🧾','die suppe':'🥣',
    'kaufen':'🛒','kosten':'💶','billig':'🏷️','teuer':'💰',
    'aufstehen':'⏰','duschen':'🚿','frühstücken':'🥐',
    'anrufen':'📞','einkaufen':'🛒','fernsehen':'📺',
    'der termin':'📅','die einladung':'💌','zeit haben':'⌚',
    'die apotheke':'💊','die post':'📮','die bank':'🏦',
    'der sommer':'☀️','der winter':'❄️','der frühling':'🌷','der herbst':'🍂',
    'das hobby':'🎨','lesen':'📖','schwimmen':'🏊','tanzen':'💃',
    'können':'💪','müssen':'❗','wollen':'💭','dürfen':'🟢',
    'das hotel':'🏨','das zimmer':'🛏️','die nacht':'🌙',
    'gestern':'🕰️','letzte woche':'📆','gemacht':'🛠️',
    'die nachricht':'✉️','die e-mail':'📧','schreiben':'✍️',
    'der vorname':'👤','der nachname':'🪪','das geburtsdatum':'🎂',
    'geöffnet':'🟢','geschlossen':'🔒','der eingang':'🚪',
    'die durchsage':'📢','wiederholen':'🔁','langsam':'🐢',
    'vorstellen':'🙋','antworten':'💬','bitten':'🙏',
    'die prüfung':'📝','das hören':'👂','das lesen':'📖','das schreiben':'✍️',
    'das sprechen':'🗣️','üben':'🔄'
  };
  function sceneFor(unit){
    if(!unit?.id)return null;
    if(lessons[unit.id])return lessons[unit.id];
    if(!Array.isArray(unit.vocab) || unit.vocab.length<3)return null;
    const icon=topicIcons[unit.group]||'📘';
    return {
      title:'Picture & word practice: '+unit.title,
      generic:true,
      items:unit.vocab.slice(0,3).map(w=>[
        wordIcons[w.de.toLocaleLowerCase('de')]||icon,
        w.de,w.en,w.ne,'',''
      ])
    };
  }

  function render(host, unit, speak) {
    const scene=sceneFor(unit);
    if(!scene || !host || typeof speak!=='function')return false;
    const wrap=el('section','visual-lab');
    wrap.setAttribute('aria-label','See, hear and practise German words');
    wrap.append(el('p','visual-lab-eyebrow','LOOK • LISTEN • REMEMBER'));
    wrap.append(el('h4','visual-lab-title',scene.title));
    wrap.append(el('p','visual-lab-intro',scene.generic?'Learn three useful words, tap to hear German, practise a real sentence and solve a short matching challenge. Symbols are memory cues and may represent the topic rather than the exact word.':'See the picture, hear the German, practise a short conversation, then solve a three-picture challenge.'));
    const cards=el('div','visual-lab-cards');
    for(const [emoji,de,en,ne,phonetic,nephonetic] of scene.items){
      const button=el('button','visual-lab-card');
      button.type='button';
      button.setAttribute('aria-label','Listen to '+de);
      const picture=el('span','visual-lab-picture',emoji);picture.setAttribute('aria-hidden','true');
      const german=el('strong','visual-lab-german',de);german.lang='de';
      const translation=el('span','visual-lab-translation',en+' · '+ne);
      const pronunciation=el('small','visual-lab-pronunciation',
        phonetic&&nephonetic ? phonetic+' · '+nephonetic : 'Tap to hear pronunciation in German');
      const audio=el('span','visual-lab-listen','🔊 Hear German');
      button.append(picture,german,translation,pronunciation,audio);
      button.addEventListener('click',()=>speak(de));
      cards.append(button);
    }
    wrap.append(cards);
    wrap.append(el('p','visual-lab-caveat','English and Nepali sound guides are approximations. The German audio is provided by your device, not by a recorded native speaker.'));
    // A short everyday conversation connects memorised words to real A1 communication.
    const dialogue=window.DEUTSCH_VISUAL_STORIES?.[unit.id];
    if(dialogue?.turns?.length){
      const story=el('details','visual-lab-story');
      story.open=true;
      story.setAttribute('aria-label','Learn a short German conversation');
      const storyTop=el('summary','visual-lab-story-head');
      storyTop.append(el('span','visual-lab-story-scene',dialogue.scene),el('strong','visual-lab-story-goal',dialogue.goal));
      story.append(storyTop,el('p','visual-lab-story-tip','Listen to each speaker. Hide the translation and try to understand before looking again.'));
      const conversation=el('ol','visual-lab-conversation');
      for(const [person,de,en,ne,phonetic,nephonetic] of dialogue.turns){
        const turn=el('li','visual-lab-turn');
        const who=el('span','visual-lab-speaker',person);
        const spoken=el('p','visual-lab-sentence',de);
        spoken.lang='de';
        const meaning=el('div','visual-lab-meaning');
        meaning.append(el('p','',en),el('p','',ne),el('small','',phonetic+' · '+nephonetic));
        const controls=el('div','visual-lab-turn-actions');
        const listen=el('button','visual-lab-small-btn','🔊 Listen');
        listen.type='button';
        listen.setAttribute('aria-label','Listen to '+person+': '+de);
        listen.addEventListener('click',()=>speak(de,false));
        const slow=el('button','visual-lab-small-btn','◷ Slow');
        slow.type='button';
        slow.setAttribute('aria-label','Hear '+person+' slowly: '+de);
        slow.addEventListener('click',()=>speak(de,true));
        const toggle=el('button','visual-lab-small-btn','Hide meaning');
        toggle.type='button';
        toggle.setAttribute('aria-expanded','true');
        toggle.addEventListener('click',()=>{
          meaning.hidden=!meaning.hidden;
          toggle.textContent=meaning.hidden?'Show meaning':'Hide meaning';
          toggle.setAttribute('aria-expanded',String(!meaning.hidden));
        });
        controls.append(listen,slow,toggle);
        turn.append(who,spoken,meaning,controls);
        conversation.append(turn);
      }
      story.append(conversation);
      wrap.append(story);
    }

    // For units without a curated three-person story, practise the existing original
    // grammar example as a short situational line, not an invented new translation.
    if(!dialogue && unit.grammar?.example && unit.grammar?.exampleEn && unit.grammar?.exampleNe){
      const scene=el('details','visual-lab-story visual-lab-example');
      const summary=el('summary','visual-lab-story-head','💬 Hear a German sentence from this lesson');
      const spoken=el('p','visual-lab-sentence',unit.grammar.example);
      spoken.lang='de';
      const translations=el('div','visual-lab-meaning');
      translations.append(el('p','',unit.grammar.exampleEn),el('p','',unit.grammar.exampleNe));
      if(unit.grammar.pronEnglish&&unit.grammar.pronNepali)translations.append(el('small','',unit.grammar.pronEnglish+' · '+unit.grammar.pronNepali));
      const buttons=el('div','visual-lab-turn-actions');
      for(const [label,slow] of [['🔊 Listen',false],['◷ Slow',true]]){
        const btn=el('button','visual-lab-small-btn',label);
        btn.type='button';btn.addEventListener('click',()=>speak(unit.grammar.example,slow));
        buttons.append(btn);
      }
      const toggle=el('button','visual-lab-small-btn','Hide meaning');
      toggle.type='button';toggle.setAttribute('aria-expanded','true');
      toggle.addEventListener('click',()=>{
        translations.hidden=!translations.hidden;
        toggle.textContent=translations.hidden?'Show meaning':'Hide meaning';
        toggle.setAttribute('aria-expanded',String(!translations.hidden));
      });
      buttons.append(toggle);
      scene.append(summary,spoken,translations,buttons);
      wrap.append(scene);
    }
    const practice=el('div','visual-lab-practice');
    const title=el('h5','visual-lab-practice-title',scene.generic?'Word challenge':'Picture challenge');
    const cue=el('p','visual-lab-question');
    const options=el('div','visual-lab-options');
    const feedback=el('p','visual-lab-feedback','');
    feedback.setAttribute('role','status');
    feedback.setAttribute('aria-live','polite');
    const next=el('button','secondary-btn visual-lab-next','Next picture →');
    next.type='button';
    next.hidden=true;
    practice.append(title,cue,options,feedback,next);
    wrap.append(practice);
    let round=0,firstTry=0,misclicked=false;
    const items=scene.items;
    function question(){
      next.hidden=true;
      options.replaceChildren();
      feedback.textContent='';
      misclicked=false;
      const [emoji,de,en,ne]=items[round];
      title.textContent=(scene.generic?'Word challenge':'Picture challenge')+' · '+(round+1)+' of '+items.length;
      cue.replaceChildren();
      cue.append(el('span','visual-lab-cue-icon',emoji),el('span','', 'Choose the German for '+en+' ('+ne+').'));
      // Rotate choices on each round instead of repeating the same answer order.
      const offset=(round+(Number(unit.number)||0))%items.length;
      const mixed=items.map((_,i)=>items[(i+offset)%items.length]);
      for(const item of mixed){
        const choice=el('button','visual-lab-option',item[1]);
        choice.type='button';
        choice.lang='de';
        choice.addEventListener('click',()=>{
          if(choice.disabled)return;
          if(item[1]!==de){
            misclicked=true;
            feedback.textContent='Not quite. Look at the picture and try another word.';
            choice.classList.add('visual-lab-try-again');
            choice.disabled=true;
            return;
          }
          if(!misclicked)firstTry++;
          for(const b of options.children)b.disabled=true;
          choice.classList.add('visual-lab-correct');
          feedback.textContent='✓ Richtig! '+de+' means '+en+'. Tap the picture above to listen again.';
          next.textContent=round===items.length-1?'Finish challenge →':'Next picture →';
          next.hidden=false;
        });
        options.append(choice);
      }
    }
    next.addEventListener('click',()=>{
      if(round>=items.length){
        round=0;firstTry=0;question();return;
      }
      round++;
      if(round<items.length)question();
      else{
        title.textContent='✓ '+(scene.generic?'Word':'Picture')+' challenge completed';
        cue.textContent='You recognised '+firstTry+' of '+items.length+' words on the first try.';
        options.replaceChildren();
        feedback.textContent='This is practice feedback, not an official Goethe exam score. Review the words and try again whenever you want.';
        next.textContent='Practise again ↻';
        next.hidden=false;
      }
    });
    question();
    // Listening-only recall is intentionally separate from the official exam sampler.
    const meanings=items.map(w=>w[2].trim().toLocaleLowerCase('en'));
    if(new Set(meanings).size===items.length){
      const ear=el('details','visual-lab-ears');
      ear.append(el('summary','visual-lab-story-head','🎧 Optional: listen and choose (no text hint)'));
      const instructions=el('p','visual-lab-story-tip','Listen to a German word. Choose its English meaning before revealing the text.');
      ear.append(instructions);
      const mystery=items[1];
      const actions=el('div','visual-lab-turn-actions');
      for(const [label,slow] of [['🔊 Hear word',false],['◷ Hear slowly',true]]){
        const control=el('button','visual-lab-small-btn',label);
        control.type='button';control.addEventListener('click',()=>speak(mystery[1],slow));actions.append(control);
      }
      ear.append(actions);
      const result=el('p','visual-lab-feedback','');
      result.setAttribute('role','status');
      const answers=el('div','visual-lab-options');
      const shuffled=items.map((_,i)=>items[(i+((Number(unit.number)||0)%3))%3]);
      for(const candidate of shuffled){
        const option=el('button','visual-lab-option',candidate[2]);
        option.type='button';
        option.addEventListener('click',()=>{
          for(const control of answers.children)control.disabled=true;
          if(candidate===mystery){
            option.classList.add('visual-lab-correct');
            result.textContent='✓ Correct! You heard: '+mystery[1]+' — '+mystery[2]+'.';
          }else{
            option.classList.add('visual-lab-try-again');
            result.textContent='You heard: '+mystery[1]+' — '+mystery[2]+'. Replay it and try again later.';
          }
        });
        answers.append(option);
      }
      ear.append(answers,result);
      wrap.append(ear);
    }
    const continueBtn=el('button','secondary-btn visual-lab-continue','Continue to all lesson words ↓');
    continueBtn.type='button';
    continueBtn.addEventListener('click',()=>{
      const list=host.querySelector('.a1-vocab-grid');
      if(list)list.scrollIntoView({behavior:'smooth',block:'start'});
    });
    wrap.append(continueBtn);
    host.append(wrap);
    return true;
  }
  window.DEUTSCH_VISUAL_LAB={render,scenes:lessons,sceneFor};
})();