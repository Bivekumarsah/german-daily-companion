/* DeutschDaily A1 writing hints — small, original, deterministic, offline.
   A pattern match is a prompt for human review, never grammar scoring. */
(() => {
'use strict';
const rules=[
 {id:'sein-ich',pattern:/\bich\s+(?:bist|sind)\b/iu,en:'For “I am”, use “ich bin”, not “ich bist/sind”.',ne:'“म हुँ” भन्न “ich bin” प्रयोग गर्नुहोस्।',example:'Ich bin Student.'},
 {id:'sein-du',pattern:/\bdu\s+(?:bin|ist|sind)\b/iu,en:'For informal “you are”, use “du bist”.',ne:'अनौपचारिक “तिमी हौ” का लागि “du bist” प्रयोग गर्नुहोस्।',example:'Du bist freundlich.'},
 {id:'sein-third',pattern:/\b(?:er|sie|es)\s+(?:bin|bist)\b/iu,en:'With “er/sie/es” (he/she/it), the present form of sein is “ist”.',ne:'“er/sie/es” सँग “ist” प्रयोग हुन्छ।',example:'Er ist Lehrer.'},
 {id:'age',pattern:/\bich\s+(?:habe|hat)\s+(?:\d{1,3}|[a-zäöüß-]+)\s+Jahre\s+alt\b/iu,en:'German age uses “sein”, not “haben”: “Ich bin 20 Jahre alt.”',ne:'जर्मनमा उमेर बताउँदा “haben” होइन, “sein” प्रयोग हुन्छ।',example:'Ich bin 20 Jahre alt.'},
 {id:'feeling',pattern:/\bich\s+habe\s+(?:müde|krank|hungrig|durstig)\b/iu,en:'For these states, use “ich bin”: e.g. “Ich bin müde.”',ne:'थाकेको/बिरामी भएको बताउँदा “ich bin” प्रयोग हुन्छ।',example:'Ich bin müde.'},
 {id:'origin-nepal',pattern:/\bich\s+komme\s+von\s+Nepal\b/iu,en:'To name your country of origin, say “Ich komme aus Nepal.”',ne:'देश बताउँदा “Ich komme aus Nepal” भन्नुहोस्।',example:'Ich komme aus Nepal.'},
 {id:'modal-order',pattern:/\bich\s+(?:kann|muss|möchte)\s+sprechen\s+Deutsch\b/iu,en:'In a normal clause with a modal verb, the other infinitive goes last.',ne:'मोडल क्रिया भएको वाक्यमा मुख्य क्रियाको मूलरूप अन्त्यमा आउँछ।',example:'Ich kann Deutsch sprechen.'}
];
const wc=text=>(String(text).trim().match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)||[]).length;
function analyze(input){
 const value=String(input||'').slice(0,2000);
 if(!value.trim())return [];
 const findings=[];
 for(const rule of rules){
  if(rule.pattern.test(value))findings.push({id:rule.id,en:rule.en,ne:rule.ne,example:rule.example});
 }
 // A beginner-friendly reminder, not a claim that any sentence is wrong.
 if(/^\s*ich\b/u.test(value)&&!findings.some(x=>x.id==='capital-start')){
  findings.push({
   id:'capital-start',en:'At the beginning of a German sentence, write “Ich” with a capital I.',
   ne:'जर्मन वाक्यको सुरुवातमा “Ich” ठूलो अक्षरबाट लेख्नुहोस्।',example:'Ich lerne Deutsch.'
  });
 }
 if(wc(value)>=4 && /[\p{L}\p{N}]\s*$/u.test(value)){
  findings.push({
   id:'ending-punctuation',en:'Check whether the last sentence needs a full stop, question mark or exclamation mark.',
   ne:'अन्तिम वाक्यमा पूर्णविराम, प्रश्नचिह्न वा विस्मयादिबोधक चिन्ह चाहिन्छ कि हेर्नुहोस्।',example:'Ich lerne Deutsch.'
  });
 }
 return findings.slice(0,5);
}
window.DEUTSCH_WRITING_HINTS={analyze,ruleCount:rules.length};
})();