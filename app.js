(() => {
'use strict';
const $ = id => document.getElementById(id);
const PHRASES = window.DAILY_PHRASES || [];
const ALPHABET = window.GERMAN_ALPHABET || [];
const KEY_FAV = 'deutschdaily-favorites-v1';
const KEY_CACHE = 'deutschdaily-translations-v1';
const CACHE_LIMIT = 250;
const IDENTICAL_GERMAN_WORDS = new Set(['hotel','computer','internet','taxi','radio','pizza','bus','baby','film','museum','restaurant','problem','auto','kilo']);
const normalize = s => String(s).toLowerCase().trim().replace(/[.!?।,;:]+$/g,'').replace(/\s+/g,' ');
const lookup = new Map(PHRASES.map(p => [normalize(p.english),p]));
const example = PHRASES.find(p => normalize(p.english) === 'how are you');
const alphabetLookup = new Map(ALPHABET.filter(([letter]) => /^[A-Z]$/.test(letter)).map(([letter,pronEnglish,pronNepali]) => [letter.toLowerCase(), {english:letter,german:letter,nepali:'जर्मन वर्णमालाको अक्षर '+letter,pronEnglish,pronNepali,source:'German alphabet'}]));
let current = null, requestId = 0, delay = 0, toastTimer = 0;
let favorites = readStorage(KEY_FAV, []);
let translationCache = readStorage(KEY_CACHE, {});
if (!translationCache || typeof translationCache !== 'object' || Array.isArray(translationCache)) translationCache = {};
let currentFlash = 0;
function readStorage(key, fallback){try {const x=JSON.parse(localStorage.getItem(key));return x??fallback;}catch {return fallback;}}
function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
function localPhrase(english){return lookup.get(normalize(english)) || alphabetLookup.get(normalize(english));}
function germanLooksValid(english,german){
 if(typeof german !== 'string' || !german.trim() || /MYMEMORY WARNING|QUERY LENGTH LIMIT|YOU HAVE REACHED|NO QUERY SPECIFIED/i.test(german))return false;
 const src=normalize(english), translated=normalize(german);
 if(src===translated && !IDENTICAL_GERMAN_WORDS.has(src))return false;
 return true;
}
function cachedTranslation(english){
 const result=translationCache[normalize(english)];
 if(!result || !germanLooksValid(english,result.german))return null;
 return {...result,english,source:'Saved offline'};
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
 const savedOffline=data.source==='Saved offline';
 $('translationSource').textContent = fromOnline
 ? 'Online translation (MyMemory), automatically saved on this device for offline reuse. Pronunciation is approximate.'
 : savedOffline ? 'Previously translated and saved on this device. Available offline. Pronunciation is approximate.'
 : data.source==='German alphabet' ? 'German alphabet letter. Tap Listen to hear its name.'
 : 'Curated built-in phrase, available offline. Pronunciation is approximate.';
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
 const cached=cachedTranslation(english);if(cached){renderResult(cached);return;}
 if(!navigator.onLine){showUnavailable('This is not in your offline vocabulary yet. Connect to the internet to translate it once; it will then be available offline.');return;}
 if(new TextEncoder().encode(english).length>500){showUnavailable('Text is too long for the free translation service. Try a shorter sentence.');return;}
 setStatus('TRANSLATING…','loading');$('retryTranslation').hidden=true;
 $('emptyResult').hidden=false;$('resultContent').hidden=true;
 $('emptyResult').querySelector('h3').textContent='Looking up your phrase…';
 $('emptyResult').querySelector('p').textContent='Checking German and Nepali translations.';
 // Start both requests together; show the German result without waiting for Nepali.
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
 const cached=cachedTranslation(txt);if(cached){renderResult(cached);return;}
 current=null;$('resultContent').hidden=true;$('emptyResult').hidden=false;$('retryTranslation').hidden=true;
 $('emptyResult').querySelector('h3').textContent='Ready to translate…';
 $('emptyResult').querySelector('p').textContent='Checking your English sentence.';
 setStatus('TYPING…','loading');
 delay=setTimeout(()=>{if(id===requestId)translateEnglish(txt);},850);
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
function init(){connection();window.addEventListener('online',connection);window.addEventListener('offline',connection);
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
 renderFavorites();renderRecent();renderFlash();renderAlphabet();
 $('englishInput').value=example?.english||'How are you?';scheduleTranslation();
 if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
