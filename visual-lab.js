/* Visual-first, original A1 memory cues. Supplemental practice; not an exam score. */
(() => {
  'use strict';
  const lessons = {
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

  function render(host, unit, speak) {
    const scene=lessons[unit?.id];
    if(!scene || !host || typeof speak!=='function')return false;
    const wrap=el('section','visual-lab');
    wrap.setAttribute('aria-label','See, hear and practise German words');
    wrap.append(el('p','visual-lab-eyebrow','LOOK • LISTEN • REMEMBER'));
    wrap.append(el('h4','visual-lab-title',scene.title));
    wrap.append(el('p','visual-lab-intro','Tap a picture to hear German. Learn it in English and नेपाली, then try a three-picture challenge.'));
    const cards=el('div','visual-lab-cards');
    for(const [emoji,de,en,ne,phonetic,nephonetic] of scene.items){
      const button=el('button','visual-lab-card');
      button.type='button';
      button.setAttribute('aria-label','Listen to '+de);
      const picture=el('span','visual-lab-picture',emoji);picture.setAttribute('aria-hidden','true');
      const german=el('strong','visual-lab-german',de);german.lang='de';
      const translation=el('span','visual-lab-translation',en+' · '+ne);
      const pronunciation=el('small','visual-lab-pronunciation',phonetic+' · '+nephonetic);
      const audio=el('span','visual-lab-listen','🔊 Hear German');
      button.append(picture,german,translation,pronunciation,audio);
      button.addEventListener('click',()=>speak(de));
      cards.append(button);
    }
    wrap.append(cards);
    const practice=el('div','visual-lab-practice');
    const title=el('h5','visual-lab-practice-title','Picture challenge');
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
    let round=0;
    const items=scene.items;
    function question(){
      next.hidden=true;
      options.replaceChildren();
      feedback.textContent='';
      const [emoji,de,en,ne]=items[round];
      title.textContent='Picture challenge · '+(round+1)+' of '+items.length;
      cue.replaceChildren();
      cue.append(el('span','visual-lab-cue-icon',emoji),el('span','', 'Tap the German for '+en+' ('+ne+').'));
      const mixed=[items[2],items[0],items[1]];
      for(const item of mixed){
        const choice=el('button','visual-lab-option',item[1]);
        choice.type='button';
        choice.lang='de';
        choice.addEventListener('click',()=>{
          if(item[1]!==de){
            feedback.textContent='Not quite. Look at the picture and try another word.';
            choice.classList.add('visual-lab-try-again');
            return;
          }
          for(const b of options.children)b.disabled=true;
          choice.classList.add('visual-lab-correct');
          feedback.textContent='✓ Richtig! '+de+' means '+en+'. You can tap its picture above to listen again.';
          next.textContent=round===items.length-1?'Finish picture challenge':'Next picture →';
          next.hidden=false;
        });
        options.append(choice);
      }
    }
    next.addEventListener('click',()=>{
      round++;
      if(round<items.length)question();
      else {
        title.textContent='✓ Picture challenge complete';
        cue.textContent='Great practice! Continue with the complete vocabulary below.';
        options.replaceChildren();
        feedback.textContent='These picture checks are practice, not an official exam grade.';
        next.hidden=true;
      }
    });
    question();
    host.append(wrap);
    return true;
  }
  window.DEUTSCH_VISUAL_LAB={render,scenes:lessons};
})();