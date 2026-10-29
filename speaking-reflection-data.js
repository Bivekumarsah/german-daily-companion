/* Original scenario-by-scenario speaking reflection. Prompts, not an automated score. */
(() => {
'use strict';
const cues={
 'a1-mock-1':[
  [
   ['Give your own first name, not the model name.','आफ्नो नाम भन्नुहोस्, नमुनाको नाम होइन।','Ich heiße ...'],
   ['Say your own country with “Ich komme aus ...”.','आफ्नो देश “Ich komme aus ...” प्रयोग गरेर भन्नुहोस्।','Ich komme aus ...'],
   ['Name one real hobby or leisure activity.','आफूलाई मन पर्ने फुर्सदको एउटा काम भन्नुहोस्।','Ich ... gern.']
  ],
  [
   ['Ask when the language course starts.','भाषा कक्षा कहिले सुरु हुन्छ भनेर सोध्नुहोस्।','Wann beginnt der Kurs?'],
   ['Ask which room the course is in.','कक्षा कुन कोठामा हुन्छ भनेर सोध्नुहोस्।','In welchem Raum ...?'],
   ['Thank the person politely.','विनम्रतापूर्वक धन्यवाद भन्नुहोस्।','Vielen Dank!']
  ],
  [
   ['Order one glass of water politely.','विनम्रतापूर्वक एक गिलास पानी माग्नुहोस्।','Ein Glas Wasser, bitte.'],
   ['Choose water without bubbles.','ग्यास नभएको पानी रोज्नुहोस्।','Ohne Kohlensäure, bitte.'],
   ['Thank the person politely.','विनम्रतापूर्वक धन्यवाद भन्नुहोस्।','Danke schön!']
  ]
 ],
 'a1-mock-2':[
  [
   ['Introduce yourself using your own name.','आफ्नै नाम प्रयोग गरेर परिचय दिनुहोस्।','Ich heiße ...'],
   ['Spell your actual surname, one letter at a time.','आफ्नो वास्तविक थर एक-एक अक्षर गरी भन्नुहोस्।','S-H-A-R-M-A (example only).'],
   ['Say your actual age using “Ich bin ... Jahre alt”.','“Ich bin ... Jahre alt” प्रयोग गरेर आफ्नो वास्तविक उमेर भन्नुहोस्।','Ich bin ... Jahre alt.']
  ],
  [
   ['Ask how much the notebook costs.','कापीको मूल्य कति हो भनेर सोध्नुहोस्।','Was kostet das Heft?'],
   ['Say you want to buy one notebook.','एउटा कापी किन्न चाहन्छु भनेर भन्नुहोस्।','Ich nehme ein Heft.'],
   ['Decline anything extra and thank them.','अरू केही चाहिँदैन भन्नुहोस् र धन्यवाद दिनुहोस्।','Nein, danke.']
  ],
  [
   ['Ask politely to borrow or receive a pen.','विनम्रतापूर्वक कलम माग्नुहोस्।','Haben Sie einen Stift, bitte?'],
   ['Say thank you after receiving the pen.','कलम पाएपछि धन्यवाद भन्नुहोस्।','Vielen Dank!'],
   ['Say goodbye politely.','विनम्रतापूर्वक बिदा लिनुहोस्।','Auf Wiedersehen!']
  ]
 ]
};
window.DEUTSCH_SPEAKING_CUES=cues;
})();