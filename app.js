(() => {
'use strict';
const $ = id => document.getElementById(id);
const PHRASES = window.DAILY_PHRASES || [];
const ALPHABET = window.GERMAN_ALPHABET || [];
const KEY_FAV = 'deutschdaily-favorites-v1';
const KEY_CACHE = 'deutschdaily-translations-v1';
const normalize = s => String(s).toLowerCase().trim().replace(/[.!?।,;:]+$/g,'').replace(/\s+/g,' ');
const lookup = new Map(PHRASES.map(p => [normalize(p.english),p]));
const example = PHRASES.find(p => normalize(p.english) === 'how are you');
let current = null, requestId = 0, delay = 0, toastTimer = 0;
let favorites = readStorage(KEY_FAV, []);
let translationCache = readStorage(KEY_CACHE, {});
let currentFlash = 0;
function readStorage(key, fallback){try {const x=JSON.parse(localStorage.getItem(key));return x??fallback;}catch {return fallback;}}
function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Private mode or full storage */}}
function notify(text){const box=$('toast');box.textContent=text;box.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('show'),3000);}
function setStatus(text,kind=''){const status=$('resultStatus');status.textContent=text;status.className='result-state'+(kind?' '+kind:'');}
function connection(){const online=navigator.onLine;const node=$('connection');node.className='offline-indicator'+(online?' online':'');node.innerHTML='<i aria-hidden="true"></i>'+(online?'Online':'Offline mode');}
function speaking(text,slow=false,lang='de-DE') {
  if (!('speechSynthesis' in window)) {notify('This browser does not support speech playback.');return;}
  const synth=window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang=lang;u.rate=slow?0.65:0.9;u.pitch=1;
  const voices=synth.getVoices();const exact=voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase());
  const related=voices.find(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
  if(exact || related)u.voice=exact||related;
  else notify('No German voice detected; your device may use a different accent.');
  u.onerror=()=>notify('German voice could not play. Check device speech settings.');
  synth.speak(u);
}
// Rough grapheme-based guides for arbitrary online translations, NOT a phonetic dictionary.
function romanizeGerman(s) {
  return s.toLowerCase().replace(/äu|eu/g,'oy').replace(/tsch/g,'ch').replace(/sch/g,'sh')
   .replace(/(?<=\b)sp/g,'shp').replace(/(?<=\b)st/g,'sht').replace(/ei/g,'eye')
   .replace(/ie/g,'ee').replace(/au/g,'ow').replace(/ch/g,'kh').replace(/ph/g,'f')
   .replace(/qu/g,'kv').replace(/ck/g,'k').replace(/ß/g,'ss').replace(/z/g,'ts')
   .replace(/w/g,'v').replace(/v/g,'f').replace(/j/g,'y').replace(/ä/g,'eh')
   .replace(/ö/g,'ur').replace(/ü/g,'ue').replace(/([a-z])h(?=[aeiou])/g,'$1')
   .replace(/([a-z])e\b/g,'$1uh');
}
// This is a rough script aid, not a promise of accurate pronunciation.
function nepaliSounds(roman) {
 const map = {
 'sh':'श','kh':'ख','ch':'च','ts':'त्स','oy':'ोइ','eye':'ाइ','ee':'ी','ow':'ाउ','ue':'्यू','eh':'े','ur':'अर',
 'a':'अ','b':'ब','c':'क','d':'ड','e':'ए','f':'फ','g':'ग','h':'ह','i':'इ','j':'ज','k':'क','l':'ल','m':'म','n':'न',
 'o':'ओ','p':'प','q':'क','r':'र','s':'स','t':'ट','u':'उ','v':'व','w':'व','x':'क्स','y':'य','z':'ज'
 };
 return roman.toLowerCase().replace(/sh|kh|ch|ts|eye|oy|ee|ow|ue|eh|ur|[a-z]/g,match=>map[match]||match);
}
function renderResult(data){
 current=data;
 $('resultContent').hidden=false;$('emptyResult').hidden=true;
 $('germanOutput').textContent=data.german;
 $('pronEnglish').textContent=data.pronEnglish || romanizeGerman(data.german);
 $('pronNepali').textContent=data.pronNepali || nepaliSounds(romanizeGerman(data.german));
 $('nepaliOutput').textContent=data.nepali || 'नेपाली अर्थ अहिले उपलब्ध छैन।';
 const fromOnline=data.source==='Online translation';
 $('translationSource').textContent = fromOnline
 ? 'Online translation (MyMemory). Pronunciation spellings are automatically approximated; listen to the audio for a better guide.'
 : 'Curated offline translation. Pronunciation spellings are approximate; listen to the audio for a better guide.';
 const strip=$('wordStrip');strip.replaceChildren();
 for(const word of data.german.split(/\s+/).filter(Boolean)){
   const b=document.createElement('button');b.type='button';b.className='word-button';b.textContent='🔊 '+word;
   b.setAttribute('aria-label','Hear '+word);b.addEventListener('click',()=>speaking(word));strip.append(b);
 }
 const saved=favorites.some(x=>normalize(x.english)===normalize(data.english));
 $('savePhrase').classList.toggle('active',saved);$('savePhrase').setAttribute('aria-pressed',String(saved));
 $('savePhrase').textContent=saved?'♥':'♡';setStatus(fromOnline?'ONLINE':'OFFLINE READY');
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
   return result;
 } finally {clearTimeout(timeout);}
}
async function translateEnglish(raw){
 const english=raw.trim();const id=++requestId;
 if(!english){current=null;$('resultContent').hidden=true;$('emptyResult').hidden=false;setStatus('READY');return;}
 const local=lookup.get(normalize(english));if(local){renderResult(local);return;}
 const cached=translationCache[normalize(english)];if(cached){renderResult(cached);return;}
 if(!navigator.onLine){showUnavailable('Not in offline phrasebook. Connect to the internet for a new translation.');return;}
 if(new TextEncoder().encode(english).length>500){showUnavailable('Text is too long for the free translation service. Try a shorter sentence.');return;}
 setStatus('TRANSLATING…','loading');
 $('emptyResult').hidden=false;$('resultContent').hidden=true;
 $('emptyResult').querySelector('h3').textContent='Looking up your phrase…';
 $('emptyResult').querySelector('p').textContent='Checking German and Nepali translations.';
 const [de,ne]=await Promise.allSettled([apiTranslate(english,'de'),apiTranslate(english,'ne')]);
 if(id!==requestId)return;
 if(de.status!=='fulfilled'){
   showUnavailable('Could not translate right now. Check your connection, or try a common practice phrase.');return;
 }
 const result={english,german:de.value,nepali:ne.status==='fulfilled'?ne.value:'',pronEnglish:'',pronNepali:'',source:'Online translation'};
 translationCache[normalize(english)]=result;
 const keys=Object.keys(translationCache);if(keys.length>100){for(const key of keys.slice(0,keys.length-100))delete translationCache[key];}
 writeStorage(KEY_CACHE,translationCache);
 renderResult(result);
}
function showUnavailable(msg){current=null;$('resultContent').hidden=true;$('emptyResult').hidden=false;$('emptyResult').querySelector('h3').textContent='Translation unavailable';$('emptyResult').querySelector('p').textContent=msg;setStatus('UNAVAILABLE','error');}
function scheduleTranslation(){const txt=$('englishInput').value;const id=++requestId;clearTimeout(delay);if(!txt.trim()){translateEnglish('');return;}const match=lookup.get(normalize(txt));if(match){renderResult(match);return;}const cached=translationCache[normalize(txt)];if(cached){renderResult(cached);return;}
 setStatus('TYPING…','loading');delay=setTimeout(()=>{if(id===requestId)translateEnglish(txt);},850);
}
function choosePhrase(phrase){$('englishInput').value=phrase;scheduleTranslation();$('englishInput').focus({preventScroll:true});if(location.hash!=='#translator')$('translator').scrollIntoView({behavior:'smooth',block:'start'});}
function saveCurrent(){if(!current)return;const key=normalize(current.english);const index=favorites.findIndex(p=>normalize(p.english)===key);if(index>=0){favorites.splice(index,1);notify('Removed from saved phrases');}else{favorites.unshift(current);favorites=favorites.slice(0,100);notify('Saved for practice ♡');}writeStorage(KEY_FAV,favorites);renderFavorites();renderResult(current);}
function renderFavorites(){const node=$('savedList');node.replaceChildren();$('savedCount').textContent=favorites.length;
 if(!favorites.length){const p=document.createElement('p');p.className='saved-empty';p.textContent='♡ Your favorite German phrases will appear here.';node.append(p);return;}
 for(const p of favorites){const row=document.createElement('div');row.className='saved-row';const btn=document.createElement('button');btn.type='button';const a=document.createElement('strong');a.textContent=p.german;const b=document.createElement('span');b.textContent=p.english;btn.append(a,b);btn.addEventListener('click',()=>choosePhrase(p.english));const speak=document.createElement('button');speak.className='icon-btn';speak.type='button';speak.textContent='🔊';speak.setAttribute('aria-label','Speak '+p.german);speak.addEventListener('click',()=>speaking(p.german));const rm=document.createElement('button');rm.type='button';rm.className='remove';rm.textContent='×';rm.setAttribute('aria-label','Remove saved phrase '+p.english);rm.addEventListener('click',()=>{favorites=favorites.filter(x=>normalize(x.english)!==normalize(p.english));writeStorage(KEY_FAV,favorites);renderFavorites();if(current&&normalize(current.english)===normalize(p.english))renderResult(current);});row.append(btn,speak,rm);node.append(row);}
}
function renderFlash(){const p=PHRASES[currentFlash%PHRASES.length];$('flashEnglish').textContent=p.english;$('flashGerman').textContent=p.german;$('flashNepali').textContent=p.nepali;$('flashPron').textContent=p.pronEnglish+' · '+p.pronNepali;$('flashReveal').hidden=true;$('revealFlash').textContent='Show answer';}
function renderAlphabet(){const grid=$('alphabetGrid');for(const [letter,english,nepali] of ALPHABET){const b=document.createElement('button');b.className='letter-btn'+('ÄÖÜẞ'.includes(letter)?' special':'');b.type='button';b.title=letter+' · '+english+' · '+nepali;b.setAttribute('aria-label','Hear German letter '+letter+', '+english);const strong=document.createElement('strong');strong.textContent=letter;const small=document.createElement('small');small.textContent=english;b.append(strong,small);b.addEventListener('click',()=>{speaking(letter,true);notify(letter+' — '+english+' — '+nepali);});grid.append(b);}}
function init(){connection();window.addEventListener('online',connection);window.addEventListener('offline',connection);
 $('englishInput').addEventListener('input',scheduleTranslation);
 $('clearInput').addEventListener('click',()=>{$('englishInput').value='';scheduleTranslation();$('englishInput').focus();});
 $('suggestions').addEventListener('click',e=>{const b=e.target.closest('[data-phrase]');if(b)choosePhrase(b.dataset.phrase);});
 $('speakGerman').addEventListener('click',()=>current&&speaking(current.german));
 $('slowGerman').addEventListener('click',()=>current&&speaking(current.german,true));
 $('savePhrase').addEventListener('click',saveCurrent);
 $('copyGerman').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current.german);notify('German translation copied');}catch{notify('Copy not available on this device');}});
 $('revealFlash').addEventListener('click',()=>{const hidden=$('flashReveal').hidden;$('flashReveal').hidden=!hidden;$('revealFlash').textContent=hidden?'Hide answer':'Show answer';});
 $('nextFlash').addEventListener('click',()=>{currentFlash=(currentFlash+1)%PHRASES.length;renderFlash();});
 $('speakFlash').addEventListener('click',()=>speaking(PHRASES[currentFlash%PHRASES.length].german));
 renderFavorites();renderFlash();renderAlphabet();
 $('englishInput').value=example?.english||'How are you?';scheduleTranslation();
 if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();