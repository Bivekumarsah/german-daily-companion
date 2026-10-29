/* Original beginner-friendly sound explanations. IPA refers to broad Standard German targets.
   English and Nepali spellings are only approximate memory aids, not phonetic transcriptions. */
(() => {
 'use strict';
 const sounds=[
 {id:'ich-ch',symbol:'ch · ich',ipa:'/ç/',title:'The soft ich sound',en:'Keep your tongue high toward the front of the mouth and let air flow softly. This is NOT English sh or a hard k.',ne:'जिब्रो मुखको अगाडिको माथिल्लो भागतिर राखेर नरम हावा निकाल्नुहोस्। यो अंग्रेजी sh वा क होइन। नेपालीमा ठ्याक्कै समान ध्वनि छैन।',
  words:[['ich','I','म','ih + soft ch','इ + नरम ch (नजिकको ध्वनि मात्र)'],['Licht','light','प्रकाश','LIKHT with soft ch','लिख्त (नरम ch)']],phrase:'Ich lerne Deutsch.'},
 {id:'ach-ch',symbol:'ch · ach',ipa:'/x/',title:'The back-of-the-mouth ach sound',en:'After a, o or u, ch is often a rough breathy sound made farther back in your mouth. Compare ich and ach.',ne:'a, o, u पछि आउने ch धेरैजसो घाँटीतिरको हावायुक्त घर्षण ध्वनि हुन्छ। ich को नरम ch सँग फरक सुन्नुहोस्।',
  words:[['ach','oh!','ओहो!','AHKH (throaty)','आख (घाँटीतिर)'],['Buch','book','किताब','BOOKH (throaty)','बूख (घाँटीतिर)']],phrase:'Das Buch ist da.'},
 {id:'sch',symbol:'sch',ipa:'/ʃ/',title:'The sh sound',en:'sch usually sounds like English sh in ship. Keep it distinct from the softer ich-ch sound.',ne:'sch अंग्रेजी ship को sh जस्तै हो। ich को नरम ch सँग नझुक्किनुहोस्।',
  words:[['Schule','school','विद्यालय','SHOO-luh','शूले'],['Schuh','shoe','जुत्ता','SHOO','शू']],phrase:'Die Schule ist hier.'},
 {id:'ei',symbol:'ei / ai',ipa:'/aɪ̯/',title:'The eye sound',en:'ei usually sounds like English eye. Do not confuse it with ie, which usually represents a long ee sound.',ne:'ei लगभग अंग्रेजी eye जस्तै सुनिन्छ। ie सँग नझुक्किनुहोस्; ie सामान्यतया लामो ई हो।',
  words:[['mein','my','मेरो','MYN','माइन'],['zwei','two','दुई','TSVY','त्स्वाइ']],phrase:'Das ist mein Buch.'},
 {id:'ie',symbol:'ie',ipa:'/iː/',title:'The long ee sound',en:'ie usually makes a long ee, as in English see. Listen for the difference between ie and ei.',ne:'ie सामान्यतया लामो ई जस्तो सुनिन्छ। ei को आइ ध्वनिसँग तुलना गर्नुहोस्।',
  words:[['Liebe','love','माया','LEE-buh','लीबे'],['vier','four','चार','FEER','फीर']],phrase:'Wir sind vier.'},
 {id:'eu',symbol:'eu / äu',ipa:'/ɔʏ̯/',title:'The oy sound',en:'eu and äu usually make the same diphthong, close to oy in English boy.',ne:'eu र äu सामान्यतया उस्तै ध्वनि हुन्। अंग्रेजी boy को oy नजिक पर्छ।',
  words:[['heute','today','आज','HOY-tuh','होइटे'],['Häuser','houses','घरहरू','HOY-zer','होइजर']],phrase:'Heute lerne ich Deutsch.'},
 {id:'ue',symbol:'ü',ipa:'/yː/ or /ʏ/',title:'Round your lips for ü',en:'Say a front ee-like vowel while rounding your lips as for oo. English and Nepali have no exact matching vowel.',ne:'ई बोल्न खोजेजस्तो जिब्रो राखेर ओठलाई ऊ बोल्दाजस्तै गोलो पार्नुहोस्। नेपालीमा ठ्याक्कै मिल्ने स्वर छैन।',
  words:[['grün','green','हरियो','GR[rounded ee]N','ग्रुन (ओठ गोलो; अनुमान मात्र)'],['fünf','five','पाँच','F[rounded short i]NF','फुन्फ (ओठ गोलो; अनुमान मात्र)']],phrase:'Fünf Bücher sind grün.'},
 {id:'oe',symbol:'ö',ipa:'/øː/ or /œ/',title:'Round your lips for ö',en:'Form a German e-like vowel but keep the lips rounded. It is not simply English oh.',ne:'जिब्रो ए बोल्दाजस्तै राखेर ओठलाई गोलो पार्नुहोस्। अंग्रेजी oh जस्तै मात्र होइन।',
  words:[['schön','beautiful / nice','सुन्दर / राम्रो','SH[rounded e]N','शेन (ओठ गोलो; अनुमान मात्र)'],['hören','to hear','सुन्नु','H[rounded e]-ren','हेरेन (ओठ गोलो; अनुमान मात्र)']],phrase:'Das ist schön.'},
 {id:'w',symbol:'w',ipa:'/v/',title:'German w sounds like v',en:'German w usually sounds like English v, not English w in water.',ne:'जर्मन w सामान्यतया अंग्रेजी v जस्तै हो; अंग्रेजी water को w होइन।',
  words:[['Wasser','water','पानी','VAH-ser','वासर'],['wo','where','कहाँ','VOH','वो']],phrase:'Wo ist das Wasser?'},
 {id:'z',symbol:'z',ipa:'/ts/',title:'German z starts with ts',en:'German z commonly sounds like ts, as in the end of English cats.',ne:'जर्मन z प्रायः त्स ध्वनि हो, अंग्रेजी cats को अन्त्यजस्तै।',
  words:[['Zeit','time','समय','TSYTE','त्साइट'],['zehn','ten','दस','TSAYN','त्सेन']],phrase:'Ich habe Zeit.'},
 {id:'sp-st',symbol:'sp / st',ipa:'/ʃp/ / /ʃt/',title:'Word-initial sp and st',en:'At the start of many native German words, sp sounds like shp and st sounds like sht. This rule does not apply everywhere.',ne:'धेरैजसो मौलिक जर्मन शब्दको सुरुवातमा sp = श्प र st = श्ट जस्तो हुन्छ। सबै ठाउँमा यही नियम लाग्दैन।',
  words:[['Sport','sport','खेलकुद','SHPORRT','श्पोर्ट'],['Straße','street','सडक','SHTRAH-suh','श्ट्रासे']],phrase:'Ich mache Sport.'},
 {id:'ss',symbol:'ß / ss',ipa:'/s/',title:'Sharp s: ß and ss',en:'Both ß and ss usually sound like unvoiced s. Spelling depends on vowel length and other orthographic rules.',ne:'ß र ss दुवै प्रायः स ध्वनि हुन्छन्। लेख्ने तरिका स्वरको लम्बाइ आदि नियममा निर्भर हुन्छ।',
  words:[['heißen','to be called','नाम हुनु','HY-sen','हाइसेन'],['müssen','must / to have to','गर्नुपर्ने','M[rounded short i]-sen','मुसेन (ओठ गोलो; अनुमान मात्र)']],phrase:'Wie heißen Sie?'}
 ];
 window.DEUTSCH_PRONUNCIATION_DATA=sounds;
})();