(() => {
'use strict';
const $ = id => document.getElementById(id);
const PHRASES = window.DAILY_PHRASES || [];
const ALPHABET = window.GERMAN_ALPHABET || [];
const LESSONS = window.DEUTSCH_LESSONS || [];
const KEY_PROGRESS = 'deutschdaily-lessons-v1';
const KEY_THEME = 'deutschdaily-theme-v1';
const KEY_FAV = 'deutschdaily-favorites-v1';
const KEY_CACHE = 'deutschdaily-translations-v1';
const CACHE_LIMIT = 250;
const IDENTICAL_GERMAN_WORDS = new Set(['hotel','computer','internet','taxi','radio','pizza','bus','baby','film','museum','restaurant','problem','auto','kilo','name','plan','test','sport','winter','sommer','orange','jazz','film']);
const normalize = s => String(s).toLowerCase().trim().replace(/[.!?।,;:]+$/g,'').replace(/\s+/g,' ');
const lookup = new Map(PHRASES.map(p => [normalize(p.english),p]));
const example = PHRASES.find(p => normalize(p.english) === 'how are you');
const alphabetLookup = new Map(ALPHABET.filter(([letter]) => /^[A-Z]$/.test(letter)).map(([letter,pronEnglish,pronNepali]) => [letter.toLowerCase(), {english:letter,german:letter,nepali:'जर्मन वर्णमालाको अक्षर '+letter,pronEnglish,pronNepali,source:'German alphabet'}]));
let current = null, requestId = 0, delay = 0, toastTimer = 0;
let favorites = readStorage(KEY_FAV, []);
let translationCache = readStorage(KEY_CACHE, {});
if (!translationCache || typeof translationCache !== 'object' || Array.isArray(translationCache)) translationCache = {};
let currentFlash = 0;
let progress = readStorage(KEY_PROGRESS, {completed:{},lastDay:'',streak:0});
if(!progress || typeof progress!=='object' || !progress.completed || typeof progress.completed!=='object') progress={completed:{},lastDay:'',streak:0};
let activeLesson = null, lessonIndex = 0, lessonAnswered = false;
let germanVoices = [];
const NEPALI_RETRIED = new Set();

function readStorage(key, fallback){try {const x=JSON.parse(localStorage.getItem(key));return x??fallback;}catch {return fallback;}}
function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
function localPhrase(english){return lookup.get(normalize(english)) || alphabetLookup.get(normalize(english));}
function germanLooksValid(english,german){
 if(typeof german !== 'string' || !german.trim() || /MYMEMORY WARNING|QUERY LENGTH LIMIT|YOU HAVE REACHED|NO QUERY SPECIFIED/i.test(german))return false;
 const src=normalize(english), translated=normalize(german);
 if(src===translated && !IDENTICAL_GERMAN_WORDS.has(src))return false; // Avoid pretending untranslated English is German.
 return true;
}
function cachedTranslation(english){
 const result=translationCache[normalize(english)];
 if(!result || !germanLooksValid(english,result.german))return null;
 return {...result,english,source:'Saved offline'};
}
function maybeLoadNepali(english){
 const key=normalize(english),saved=translationCache[key];
 if(!saved || saved.nepali || NEPALI_RETRIED.has(key) || !navigator.onLine)return;
 NEPALI_RETRIED.add(key); // only once per input per page load, to protect the free service quota
 apiTranslate(english,'ne').then(nepali=>{
  const entry=translationCache[key];
  if(!entry||entry.german!==saved.german)return;
  entry.nepali=nepali;writeStorage(KEY_CACHE,translationCache);renderRecent();
  if(current&&normalize(current.english)===key){current.nepali=nepali;$('nepaliOutput').textContent=nepali;}
  const favorite=favorites.find(f=>normalize(f.english)===key);
  if(favorite){favorite.nepali=nepali;writeStorage(KEY_FAV,favorites);renderFavorites();}
 }).catch(()=>{});
}
function storeTranslation(result){
 const key=normalize(result.english);
 delete translationCache[key];
 translationCache[key]={...result,source:'Online translation'};
 while(Object.keys(translationCache).length>CACHE_LIMIT)delete translationCache[Object.keys(translationCache)[0]];
 writeStorage(KEY_CACHE,translationCache);renderRecent();
}
function friendlyError(error){
 const msg=String(error?.message||'');
 if(/limit|429|quota|too many/i.test(msg))return 'The free translation service has reached its limit. Try again later, or use words saved on this device.';
 return 'Online translation is unavailable right now. Check your internet connection and try again. Your saved and built-in phrases still work offline.';
}
function notify(text){const box=$('toast');box.textContent=text;box.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('show'),3000);}
function setStatus(text,kind=''){const status=$('resultStatus');status.textContent=text;status.className='result-state'+(kind?' '+kind:'');}
function connection(){const online=navigator.onLine;const node=$('connection');node.className='offline-indicator'+(online?' online':'');node.innerHTML='<i aria-hidden="true"></i>'+(online?'Online':'Offline mode');}
function updateVoices(){
 if(!('speechSynthesis' in window)){$('voiceStatus').textContent='Audio is not supported on this device.';return;}
 const selected=$('germanVoice').value;
 germanVoices=window.speechSynthesis.getVoices().filter(v=>v.lang.toLowerCase().startsWith('de'));
 const menu=$('germanVoice');menu.replaceChildren();
 if(!germanVoices.length){const option=document.createElement('option');option.textContent='No German voice installed';option.value='';menu.append(option);$('voiceStatus').textContent='Install a German text-to-speech voice in your device settings.';return;}
 germanVoices.forEach(voice=>{const option=document.createElement('option');option.value=voice.voiceURI;option.textContent=voice.name+' ('+voice.lang+')';menu.append(option);});
 if(germanVoices.some(v=>v.voiceURI===selected))menu.value=selected;
 else {const preferred=germanVoices.find(v=>v.lang.toLowerCase()==='de-de');menu.value=(preferred||germanVoices[0]).voiceURI;}
 $('voiceStatus').textContent='Choose a German voice if your device has more than one.';
}
function speaking(text,slow=false) {
 if(!('speechSynthesis' in window)){notify('This browser does not support speech.');return;}
 const synth=window.speechSynthesis;
 if(!germanVoices.length)updateVoices();
 const voice=germanVoices.find(v=>v.voiceURI===$('germanVoice').value);
 if(!voice){notify('German voice not installed. Add a German voice in your device settings.');return;}
 synth.cancel();
 const u=new SpeechSynthesisUtterance(text);
 u.lang=voice.lang;u.voice=voice;u.rate=slow?0.68:0.9;u.pitch=1;
 u.onerror=()=>notify('German speech did not play. Check your device speech settings.');
 synth.speak(u);
}
// Unverified letter-substitution transliteration was intentionally removed:
// showing a blank guide is safer than teaching invented German pronunciations.
function renderResult(data){
 current=data;
 $('resultContent').hidden=false;$('emptyResult').hidden=true;
 $('germanOutput').textContent=data.german;
 $('pronEnglish').textContent=data.pronEnglish || 'Not verified — tap Listen to hear German.';
 $('pronNepali').textContent=data.pronNepali || 'विश्वसनीय उच्चारण उपलब्ध छैन — जर्मन आवाज सुन्नुहोस्।';
 $('nepaliOutput').textContent=data.nepali || 'नेपाली अर्थ अहिले उपलब्ध छैन।';
 const fromOnline=data.source==='Online translation';
 const savedOffline=data.source==='Saved offline';
 $('translationSource').textContent = fromOnline
 ? 'Online translation (MyMemory), automatically saved for offline reuse. Pronunciation spelling is shown only for curated phrases; use a German voice for other text.'
 : savedOffline ? 'Previously translated and saved on this device. Available offline. Listen to the German voice for pronunciation.'
 : data.source==='German alphabet' ? 'German alphabet letter. Tap Listen to hear its name.'
 : 'Curated built-in phrase, available offline. Spelling is an approximate pronunciation aid; German audio is preferred.';
 const strip=$('wordStrip');strip.replaceChildren();
 for(const word of data.german.split(/\s+/).filter(Boolean)){
   const b=document.createElement('button');b.type='button';b.className='word-button';b.textContent='🔊 '+word;
   b.setAttribute('aria-label','Hear '+word);b.addEventListener('click',()=>speaking(word));strip.append(b);
 }
 const saved=favorites.some(x=>normalize(x.english)===normalize(data.english));
 $('savePhrase').classList.toggle('active',saved);$('savePhrase').setAttribute('aria-pressed',String(saved));
 $('savePhrase').textContent=saved?'♥':'♡';$('retryTranslation').hidden=true;setStatus(fromOnline?'SAVED FOR OFFLINE':savedOffline?'SAVED OFFLINE':'OFFLINE READY');
}
async function apiTranslate(q,language){
 const url=new URL('https://api.mymemory.translated.net/get');
 url.search=new URLSearchParams({q,langpair:'en|'+language}).toString();
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),11000);
 try {
   const resp=await fetch(url,{signal:controller.signal,headers:{Accept:'application/json'}});
   if(!resp.ok)throw new Error('HTTP '+resp.status);
   const json=await resp.json();
   if(Number(json.responseStatus)!==200 || !json.responseData?.translatedText)throw new Error(json.responseDetails||'No translation returned');
   const decoded=document.createElement('textarea');decoded.innerHTML=json.responseData.translatedText;
   const result=decoded.value.trim();
   if(/MYMEMORY WARNING|QUERY LENGTH LIMIT|YOU HAVE REACHED|NO QUERY SPECIFIED/i.test(result))throw new Error('Free translation limit reached');
   if(language==='de' && !germanLooksValid(q,result))throw new Error('Untranslated English response');
   if(language==='ne' && !/[\u0900-\u097f]/.test(result))throw new Error('Nepali translation missing');
   return result;
 } finally {clearTimeout(timeout);}
}
async function translateEnglish(raw){
 const english=raw.trim();const id=++requestId;
 if(!english){current=null;$('resultContent').hidden=true;$('emptyResult').hidden=false;$('retryTranslation').hidden=true;setStatus('READY');return;}
 const local=localPhrase(english);if(local){renderResult(local);return;}
 const cached=cachedTranslation(english);if(cached){renderResult(cached);maybeLoadNepali(english);return;}
 if(!navigator.onLine){showUnavailable('This is not in your offline vocabulary yet. Connect to the internet to translate it once; it will then be available offline.');return;}
 if(new TextEncoder().encode(english).length>500){showUnavailable('Text is too long for the free translation service. Try a shorter sentence.');return;}
 setStatus('TRANSLATING…','loading');$('retryTranslation').hidden=true;
 $('emptyResult').hidden=false;$('resultContent').hidden=true;
 $('emptyResult').querySelector('h3').textContent='Looking up your phrase…';
 $('emptyResult').querySelector('p').textContent='Checking German and Nepali translations.';
 // Start both requests together; show the German result without waiting for Nepali.
 NEPALI_RETRIED.add(normalize(english));
 const nepaliTask=apiTranslate(english,'ne').then(value=>({ok:true,value}),error=>({ok:false,error}));
 let german;
 try {german=await apiTranslate(english,'de');}
 catch(error){if(id===requestId)showUnavailable(friendlyError(error));return;}
 if(id!==requestId)return;
 const result={english,german,nepali:'',pronEnglish:'',pronNepali:'',source:'Online translation'};
 storeTranslation(result);renderResult(result);
 const nepali=await nepaliTask;
 if(id!==requestId || !nepali.ok)return;
 result.nepali=nepali.value;
 storeTranslation(result);renderResult(result);
 const idx=favorites.findIndex(item=>normalize(item.english)===normalize(english));
 if(idx>=0){favorites[idx]={...favorites[idx],nepali:nepali.value};writeStorage(KEY_FAV,favorites);renderFavorites();}
}
function showUnavailable(msg){current=null;$('resultContent').hidden=true;$('emptyResult').hidden=false;$('emptyResult').querySelector('h3').textContent='Translation unavailable';$('emptyResult').querySelector('p').textContent=msg;$('retryTranslation').hidden=false;setStatus('UNAVAILABLE','error');}
function scheduleTranslation(){
 const txt=$('englishInput').value;const id=++requestId;clearTimeout(delay);
 if(!txt.trim()){translateEnglish('');return;}
 const match=localPhrase(txt);if(match){renderResult(match);return;}
 const cached=cachedTranslation(txt);if(cached){renderResult(cached);maybeLoadNepali(txt);return;}
 current=null;$('resultContent').hidden=true;$('emptyResult').hidden=false;$('retryTranslation').hidden=true;
 $('emptyResult').querySelector('h3').textContent='Ready to translate…';
 $('emptyResult').querySelector('p').textContent='Checking your English sentence.';
 setStatus('TYPING…','loading');
 delay=setTimeout(()=>{if(id===requestId)translateEnglish(txt);},1100);
}
function renderRecent(){
 const node=$('recentList');if(!node)return;
 const all=Object.values(translationCache).filter(x=>x && germanLooksValid(x.english,x.german)).reverse();
 $('recentCount').textContent=String(all.length);node.replaceChildren();
 if(!all.length){const p=document.createElement('p');p.className='saved-empty';p.textContent='Your online translations will be automatically stored here for offline practice.';node.append(p);return;}
 for(const item of all.slice(0,8)){
  const row=document.createElement('div');row.className='saved-row';
  const btn=document.createElement('button');btn.type='button';
  const name=document.createElement('strong');name.textContent=item.german;
  const meaning=document.createElement('span');meaning.textContent=item.english;
  btn.append(name,meaning);btn.addEventListener('click',()=>choosePhrase(item.english));
  const speak=document.createElement('button');speak.className='icon-btn';speak.type='button';speak.textContent='🔊';speak.setAttribute('aria-label','Speak '+item.german);speak.addEventListener('click',()=>speaking(item.german));
  row.append(btn,speak);node.append(row);
 }
}
function choosePhrase(phrase){$('englishInput').value=phrase;scheduleTranslation();$('englishInput').focus({preventScroll:true});if(location.hash!=='#translator')$('translator').scrollIntoView({behavior:'smooth',block:'start'});}
function saveCurrent(){if(!current)return;const key=normalize(current.english);const index=favorites.findIndex(p=>normalize(p.english)===key);if(index>=0){favorites.splice(index,1);notify('Removed from saved phrases');}else{favorites.unshift(current);favorites=favorites.slice(0,100);notify('Saved for practice ♡');}writeStorage(KEY_FAV,favorites);renderFavorites();renderResult(current);}
function renderFavorites(){const node=$('savedList');node.replaceChildren();$('savedCount').textContent=favorites.length;
 if(!favorites.length){const p=document.createElement('p');p.className='saved-empty';p.textContent='♡ Your favorite German phrases will appear here.';node.append(p);return;}
 for(const p of favorites){const row=document.createElement('div');row.className='saved-row';const btn=document.createElement('button');btn.type='button';const a=document.createElement('strong');a.textContent=p.german;const b=document.createElement('span');b.textContent=p.english;btn.append(a,b);btn.addEventListener('click',()=>choosePhrase(p.english));const speak=document.createElement('button');speak.className='icon-btn';speak.type='button';speak.textContent='🔊';speak.setAttribute('aria-label','Speak '+p.german);speak.addEventListener('click',()=>speaking(p.german));const rm=document.createElement('button');rm.type='button';rm.className='remove';rm.textContent='×';rm.setAttribute('aria-label','Remove saved phrase '+p.english);rm.addEventListener('click',()=>{favorites=favorites.filter(x=>normalize(x.english)!==normalize(p.english));writeStorage(KEY_FAV,favorites);renderFavorites();if(current&&normalize(current.english)===normalize(p.english))renderResult(current);});row.append(btn,speak,rm);node.append(row);}
}
function renderFlash(){const p=PHRASES[currentFlash%PHRASES.length];$('flashEnglish').textContent=p.english;$('flashGerman').textContent=p.german;$('flashNepali').textContent=p.nepali;$('flashPron').textContent=p.pronEnglish+' · '+p.pronNepali;$('flashReveal').hidden=true;$('revealFlash').textContent='Show answer';}
function renderAlphabet(){const grid=$('alphabetGrid');for(const [letter,english,nepali] of ALPHABET){const b=document.createElement('button');b.className='letter-btn'+('ÄÖÜẞ'.includes(letter)?' special':'');b.type='button';b.title=letter+' · '+english+' · '+nepali;b.setAttribute('aria-label','Hear German letter '+letter+', '+english);const strong=document.createElement('strong');strong.textContent=letter;const small=document.createElement('small');small.textContent=english;b.append(strong,small);b.addEventListener('click',()=>{speaking(letter,true);notify(letter+' — '+english+' — '+nepali);});grid.append(b);}}

function dayKey(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');}
function recordLearning(){
 const today=dayKey();
 if(progress.lastDay===today)return;
 const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
 progress.streak=progress.lastDay===dayKey(yesterday)?progress.streak+1:1;
 progress.lastDay=today;
}
function renderLessons(){
 const complete=LESSONS.filter(l=>progress.completed[l.id]).length;
 $('lessonProgress').textContent=`${complete} / ${LESSONS.length} lessons completed`;
 $('lessonProgressBar').setAttribute('aria-valuenow',String(LESSONS.length?Math.round(complete/LESSONS.length*100):0));
 $('lessonProgressFill').style.width=(LESSONS.length?complete/LESSONS.length*100:0)+'%';
 $('lessonStreak').textContent=progress.streak?`${progress.streak}-day learning streak`:'Start your first lesson today';
 const grid=$('lessonGrid');grid.replaceChildren();
 for(const lesson of LESSONS){
  const card=document.createElement('button');card.className='lesson-card';card.type='button';
  const completed=Boolean(progress.completed[lesson.id]);
  const badge=document.createElement('span');badge.className='lesson-badge';badge.textContent=completed?'✓ Finished':'5 questions';
  const emoji=document.createElement('span');emoji.className='lesson-emoji';emoji.textContent=lesson.emoji;
  const heading=document.createElement('strong');heading.textContent=lesson.title;
  const desc=document.createElement('small');desc.textContent=completed?'Replay this lesson':'Beginner German · offline';
  card.append(badge,emoji,heading,desc);card.addEventListener('click',()=>beginLesson(lesson.id));grid.append(card);
 }
}
function beginLesson(id){
 activeLesson=LESSONS.find(x=>x.id===id);if(!activeLesson)return;
 lessonIndex=0;lessonAnswered=false;$('lessonPlayer').hidden=false;
 showLessonQuestion();$('lessonPlayer').scrollIntoView({behavior:'smooth',block:'center'});
}
function phraseFor(english){return localPhrase(english);}
function showLessonQuestion(){
 if(!activeLesson)return;
 const original=activeLesson.phrases[lessonIndex], phrase=phraseFor(original);
 if(!phrase){notify('Lesson content unavailable');return;}
 lessonAnswered=false;
 $('lessonStep').textContent=`${activeLesson.title.toUpperCase()} · ${lessonIndex+1} OF ${activeLesson.phrases.length}`;
 $('lessonQuestion').textContent='Choose the correct German sentence';
 $('lessonTip').textContent=activeLesson.tip;
 $('lessonPrompt').textContent=original;
 $('lessonFeedback').textContent='';$('lessonFeedback').className='quiz-feedback';
 $('lessonListen').hidden=true;$('lessonNext').hidden=true;
 const other=PHRASES.filter(p=>normalize(p.german)!==normalize(phrase.german)&&!activeLesson.phrases.includes(p.english));
 // Stable and varied choices, without network requests.
 const seed=(lessonIndex*19+activeLesson.title.length*7)%Math.max(1,other.length);
 const wrongA=other[seed],wrongB=other[(seed+23)%other.length];
 const options=[phrase.german,wrongA?.german,wrongB?.german].filter((v,i,a)=>v&&a.indexOf(v)===i);
 const correctPos=(lessonIndex+activeLesson.title.length)%options.length;
 const reordered=options.filter(x=>x!==phrase.german);reordered.splice(correctPos,0,phrase.german);
 const node=$('lessonOptions');node.replaceChildren();
 for(const option of reordered){
  const btn=document.createElement('button');btn.type='button';btn.className='quiz-choice';btn.textContent=option;btn.lang='de';
  btn.addEventListener('click',()=>answerLesson(btn,option,phrase));node.append(btn);
 }
}
function answerLesson(button,chosen,phrase){
 if(lessonAnswered)return;
 lessonAnswered=true;
 const correct=chosen===phrase.german;
 for(const btn of $('lessonOptions').querySelectorAll('button')){btn.disabled=true;if(btn.textContent===phrase.german)btn.classList.add('correct');else if(btn===button)btn.classList.add('incorrect');}
 $('lessonFeedback').textContent=(correct?'✓ Correct! ':'Not quite. ')+`${phrase.german} — ${phrase.nepali} — ${phrase.pronEnglish} · ${phrase.pronNepali}`;
 $('lessonFeedback').className='quiz-feedback '+(correct?'is-correct':'is-incorrect');
 $('lessonListen').hidden=false;$('lessonNext').hidden=false;
 $('lessonNext').textContent=lessonIndex===activeLesson.phrases.length-1?'Finish lesson ✓':'Next question →';
}
function nextLessonQuestion(){
 if(!activeLesson||!lessonAnswered)return;
 if(lessonIndex<activeLesson.phrases.length-1){lessonIndex++;showLessonQuestion();return;}
 const id=activeLesson.id;
 progress.completed[id]=dayKey();recordLearning();writeStorage(KEY_PROGRESS,progress);
 activeLesson=null;$('lessonPlayer').hidden=true;renderLessons();notify('Lesson completed! Your progress is saved on this device.');
}
function switchTheme(){
 const light=document.documentElement.dataset.theme!=='light';
 document.documentElement.dataset.theme=light?'light':'dark';
 $('themeToggle').textContent=light?'☾ Dark':'☀ Light';
 writeStorage(KEY_THEME,light?'light':'dark');
}
function importLearning(event){
 const file=event.target.files?.[0];event.target.value='';if(!file)return;
 if(file.size>2*1024*1024){notify('Backup file is too large (2 MB max).');return;}
 file.text().then(source=>{
  const data=JSON.parse(source);
  if(data?.version!==1 || !Array.isArray(data.favorites) || typeof data.translationCache!=='object' || !data.translationCache || Array.isArray(data.translationCache) || typeof data.progress!=='object' || !data.progress?.completed)throw new Error('Invalid backup format');
  const clean=(p)=>p&&typeof p.english==='string'&&typeof p.german==='string'&&p.english.length<=500&&p.german.length<=1000&&germanLooksValid(p.english,p.german);
  const importedFav=data.favorites.filter(clean).slice(0,100).map(x=>({english:x.english,german:x.german,nepali:typeof x.nepali==='string'?x.nepali.slice(0,2000):'',pronEnglish:typeof x.pronEnglish==='string'?x.pronEnglish.slice(0,500):'',pronNepali:typeof x.pronNepali==='string'?x.pronNepali.slice(0,500):'',source:'Saved offline'}));
  const importedCache=Object.fromEntries(Object.values(data.translationCache).filter(clean).slice(-CACHE_LIMIT).map(x=>[normalize(x.english),{english:x.english,german:x.german,nepali:typeof x.nepali==='string'?x.nepali.slice(0,2000):'',pronEnglish:'',pronNepali:'',source:'Online translation'}]));
  const cleanedCompleted={};for(const l of LESSONS){if(typeof data.progress.completed[l.id]==='string')cleanedCompleted[l.id]=data.progress.completed[l.id].slice(0,10);}
  favorites=importedFav;translationCache=importedCache;
  progress={completed:cleanedCompleted,lastDay:typeof data.progress.lastDay==='string'?data.progress.lastDay.slice(0,10):'',streak:Number.isSafeInteger(data.progress.streak)&&data.progress.streak>=0?Math.min(data.progress.streak,10000):0};
  const ok=[writeStorage(KEY_FAV,favorites),writeStorage(KEY_CACHE,translationCache),writeStorage(KEY_PROGRESS,progress)];
  renderFavorites();renderRecent();renderLessons();scheduleTranslation();
  notify(ok.every(Boolean)?'Backup restored on this device.':'Some data could not be saved; check browser storage settings.');
 }).catch(()=>notify('Could not read this backup. Select a DeutschDaily JSON export.'));
}
function exportLearning(){
 const exportData={version:1,exportedAt:new Date().toISOString(),favorites,translationCache,progress};
 const blob=new Blob([JSON.stringify(exportData,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='deutschdaily-progress-'+dayKey()+'.json';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),5000);notify('Learning data exported. Keep your backup file safe.');
}

function init(){
 const savedTheme=readStorage(KEY_THEME,'dark');
 document.documentElement.dataset.theme=savedTheme==='light'?'light':'dark';
 $('themeToggle').textContent=savedTheme==='light'?'☾ Dark':'☀ Light';
 $('themeToggle').addEventListener('click',switchTheme);
 $('exportLearning').addEventListener('click',exportLearning);
 $('importLearning').addEventListener('click',()=>$('backupFile').click());
 $('backupFile').addEventListener('change',importLearning);
 $('closeLesson').addEventListener('click',()=>{activeLesson=null;$('lessonPlayer').hidden=true;});
 $('lessonNext').addEventListener('click',nextLessonQuestion);
 $('lessonListen').addEventListener('click',()=>activeLesson&&speaking(phraseFor(activeLesson.phrases[lessonIndex]).german,true));
 $('backToInput').addEventListener('click',()=>{$('englishInput').focus();$('translator').scrollIntoView({behavior:'smooth',block:'start'});});
 updateVoices();if('speechSynthesis' in window)window.speechSynthesis.addEventListener?.('voiceschanged',updateVoices);
 connection();window.addEventListener('online',connection);window.addEventListener('offline',connection);
 $('englishInput').addEventListener('input',scheduleTranslation);
 $('clearInput').addEventListener('click',()=>{$('englishInput').value='';scheduleTranslation();$('englishInput').focus();});
 $('retryTranslation').addEventListener('click',()=>translateEnglish($('englishInput').value));
 $('suggestions').addEventListener('click',e=>{const b=e.target.closest('[data-phrase]');if(b)choosePhrase(b.dataset.phrase);});
 $('speakGerman').addEventListener('click',()=>current&&speaking(current.german));
 $('slowGerman').addEventListener('click',()=>current&&speaking(current.german,true));
 $('savePhrase').addEventListener('click',saveCurrent);
 $('copyGerman').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current.german);notify('German translation copied');}catch{notify('Copy not available on this device');}});
 $('revealFlash').addEventListener('click',()=>{const hidden=$('flashReveal').hidden;$('flashReveal').hidden=!hidden;$('revealFlash').textContent=hidden?'Hide answer':'Show answer';});
 $('nextFlash').addEventListener('click',()=>{currentFlash=(currentFlash+1)%PHRASES.length;renderFlash();});
 $('speakFlash').addEventListener('click',()=>speaking(PHRASES[currentFlash%PHRASES.length].german));
 renderFavorites();renderRecent();renderFlash();renderAlphabet();renderLessons();
 $('englishInput').value=example?.english||'How are you?';scheduleTranslation();
 if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
