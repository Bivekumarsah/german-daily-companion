/* DeutschDaily Daily Journey — pure functions shared by the offline lesson UI and tests.
   A completed activity = practised, not a verified Goethe score or mastered language. */
(() => {
'use strict';
const steps=[
 {id:'discover',title:'Discover',ne:'शब्द सिक्नुहोस्',icon:'👀',minutes:1},
 {id:'listen',title:'Listen and understand',ne:'सुनेर बुझ्नुहोस्',icon:'🎧',minutes:2},
 {id:'build',title:'Build a sentence',ne:'वाक्य बनाउनुहोस्',icon:'🧩',minutes:2},
 {id:'read',title:'Read a message',ne:'पढेर बुझ्नुहोस्',icon:'📖',minutes:2},
 {id:'speak',title:'Speak aloud',ne:'बोलेर अभ्यास गर्नुहोस्',icon:'🗣️',minutes:2},
 {id:'recap',title:'Quick recall',ne:'सम्झेर उत्तर दिनुहोस्',icon:'🏁',minutes:1}
];
const today=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const shuffle=(items,seed)=>{
 const result=items.map((item,index)=>({item,index}));
 let x=2166136261;
 for(const char of String(seed))x=Math.imul(x^char.codePointAt(0),16777619)>>>0;
 for(let i=result.length-1;i>0;i--){x^=x<<13;x^=x>>>17;x^=x<<5;x>>>=0;const j=x%(i+1);[result[j],result[i]]=[result[i],result[j]];}
 return result.map(v=>v.item);
};
const selectUnit=(units,completed)=>{
 const remaining=units.find(u=>['vocabulary','grammar','listening','reading','writing','speaking'].some(s=>!completed?.[u.id]?.[s]));
 return remaining||units[0];
};
const questions=(unit,kind,seed)=> {
 const value=unit[kind];
 if(!value||!Array.isArray(value.choices)||value.choices.length!==3)return null;
 const ordered=shuffle(value.choices.map((label,index)=>({label,index})),unit.id+kind+seed);
 return {text:value.text,prompt:value.question,options:ordered,correct:value.answer};
};
const recap=(unit,mistakes,seed)=>{
 const bank=unit.vocab;
 const recent=mistakes.find(x=>x.unitId===unit.id&&x.kind==='vocab'&&bank.some(v=>v.de===x.value));
 const target=bank.find(x=>x.de===recent?.value)||bank[(seed.length+unit.number)%bank.length];
 const alternatives=shuffle(bank.filter(x=>x.de!==target.de),seed+unit.id).slice(0,2);
 return {target,options:shuffle([target,...alternatives],seed+'recap'+unit.id)};
};
function normalizeSession(units,course,session,date=today()){
 const next=selectUnit(units,course);
 const chosen=units.find(u=>u.id===session?.unitId);
 if(session?.date===date&&chosen&&Number.isInteger(session.step)&&session.step>=0&&session.step<=steps.length)
  return {date,unitId:chosen.id,step:session.step};
 return {date,unitId:next?.id||'',step:0};
}
function recordMistake(mistakes,{unitId,kind,value},correct){
 const safe=Array.isArray(mistakes)?mistakes.filter(x=>x&&typeof x.unitId==='string'&&typeof x.kind==='string'&&typeof x.value==='string'):[];
 const id=unitId+'|'+kind+'|'+value;
 const rest=safe.filter(x=>x.unitId+'|'+x.kind+'|'+x.value!==id);
 if(correct)return rest.slice(-30);
 return [...rest,{unitId,kind,value}].slice(-30);
}
window.DEUTSCH_DAILY_LOGIC={steps,today,shuffle,selectUnit,questions,recap,normalizeSession,recordMistake};
})();