/* Original bilingual A1 grammar bridge lessons, not copied from licensed test books.
 Format per question: [German sentence with ___, 3 alternatives, correct index,
                       English meaning, नेपाली meaning, short English feedback]. */
(() => {
'use strict';
const topics=[
 {id:'present',unit:'a1-12',title:'Regular present-tense verbs',icon:'🧠',
 en:'Keep the verb in position two of a normal statement. Learn: ich -e, du -st, er/sie/es -t, wir/sie/Sie -en.',
 ne:'साधारण कथनमा क्रिया प्रायः दोस्रो स्थानमा हुन्छ। ich सँग -e, du सँग -st, er/sie/es सँग -t र wir/sie/Sie सँग -en सिक्नुहोस्।',
 tip:'Ich lerne Deutsch. (I learn German. / म जर्मन सिक्छु।)',
 questions:[
 ['Ich ___ Deutsch.',['lerne','lernst','lernt'],0,'I learn German.','म जर्मन सिक्छु।','ich takes the -e ending.'],
 ['Du ___ in Berlin.',['wohne','wohnt','wohnst'],2,'You live in Berlin.','तिमी बर्लिनमा बस्छौ।','du usually takes -st.'],
 ['Er ___ jeden Tag.',['arbeitet','arbeite','arbeiten'],0,'He works every day.','ऊ हरेक दिन काम गर्छ।','arbeiten adds -et in the er form.']
 ]},
 {id:'sein',unit:'a1-13',title:'sein and haben',icon:'🪄',
 en:'Two essential irregular verbs: ich bin, du bist, er/sie ist; ich habe, du hast, er/sie hat.',
 ne:'दुई महत्त्वपूर्ण अनियमित क्रिया: ich bin, du bist, er/sie ist; ich habe, du hast, er/sie hat।',
 tip:'Ich bin müde. Ich habe Zeit. (I am tired. I have time. / म थाकेको छु। मसँग समय छ।)',
 questions:[
 ['Ich ___ aus Nepal.',['bist','bin','ist'],1,'I am from Nepal.','म नेपालबाट हुँ।','ich bin is the correct form of sein.'],
 ['Du ___ heute Zeit.',['hast','hat','habe'],0,'You have time today.','तिमीसँग आज समय छ।','du hast is the correct form of haben.'],
 ['Meine Mutter ___ Ärztin.',['habe','seid','ist'],2,'My mother is a doctor.','मेरी आमा डाक्टर हुनुहुन्छ।','A singular third-person subject takes ist.']
 ]},
 {id:'accusative',unit:'a1-18',title:'Accusative articles',icon:'🛒',
 en:'For a direct object, masculine ein becomes einen (der → den); feminine eine and neuter ein do not change.',
 ne:'कर्मको रूपमा पुरुषवाचक ein → einen (der → den) हुन्छ। स्त्रीवाचक eine र नपुंसक ein बदलिँदैन।',
 tip:'Ich kaufe einen Apfel. (I buy an apple. / म एउटा स्याउ किन्छु।)',
 questions:[
 ['Ich kaufe ___ Apfel.',['ein','einen','eine'],1,'I buy an apple.','म एउटा स्याउ किन्छु।','Apfel is masculine; the direct object needs einen.'],
 ['Wir brauchen ___ Tasche.',['ein','einen','eine'],2,'We need a bag.','हामीलाई एउटा झोला चाहिन्छ।','Tasche is feminine; eine stays the same.'],
 ['Sie hat ___ Buch.',['ein','einen','einem'],0,'She has a book.','उनीसँग एउटा किताब छ।','Buch is neuter; the direct object takes ein.']
 ]},
 {id:'pronouns',unit:'a1-14',title:'Everyday object pronouns',icon:'🙋',
 en:'Practice small direct-object pronouns: mich (me), dich (you informal), ihn (him), sie (her).',
 ne:'कर्मकारक सर्वनाम अभ्यास गर्नुहोस्: mich (मलाई), dich (तिमीलाई), ihn (उसलाई—पुरुष), sie (उनलाई—महिला)।',
 tip:'Ich kenne dich. (I know you. / म तिमीलाई चिन्छु।)',
 questions:[
 ['Kannst du ___ hören?',['ich','mich','mir'],1,'Can you hear me?','के तिमी मलाई सुन्न सक्छौ?','hören takes the direct object mich.'],
 ['Ich besuche ___ morgen, Paul.',['dich','du','dir'],0,'I will visit you tomorrow, Paul.','पाउल, म भोलि तिमीलाई भेट्न आउँछु।','besuchen takes the direct object dich.'],
 ['Ich sehe Paul. Ich sehe ___.',['er','ihm','ihn'],2,'I see Paul. I see him.','म पाउललाई देख्छु। म उसलाई देख्छु।','A masculine direct object pronoun is ihn.']
 ]},
 {id:'possessives',unit:'a1-07',title:'Possessive mein / meine / dein / deine',icon:'👨‍👩‍👧',
 en:'Match the possessive word to the noun: mein Bruder / mein Buch, but meine Mutter / meine Tasche.',
 ne:'स्वामित्व जनाउने शब्द नामसँग मिलाउनुहोस्: mein Bruder / mein Buch, तर meine Mutter / meine Tasche।',
 tip:'Das ist meine Familie. (That is my family. / त्यो मेरो परिवार हो।)',
 questions:[
 ['Das ist ___ Mutter.',['mein','meine','meinen'],1,'That is my mother.','उनी मेरी आमा हुनुहुन्छ।','Mutter is feminine, so meine.'],
 ['Ist das ___ Buch, Tom?',['dein','deine','deinen'],0,'Is that your book, Tom?','टम, के त्यो तिम्रो किताब हो?','Buch is neuter; use dein.'],
 ['Das ist ___ Bruder.',['meine','meinen','mein'],2,'That is my brother.','त्यो मेरो दाजुभाइ हो।','Bruder is masculine in the nominative: mein.']
 ]},
 {id:'dative',unit:'a1-23',title:'Dative in useful A1 phrases',icon:'🚌',
 en:'Certain common patterns need dative: mit dem Bus, bei der Ärztin, mir helfen. Practise these phrases first.',
 ne:'केही सामान्य प्रयोगमा दातिव चाहिन्छ: mit dem Bus, bei der Ärztin, mir helfen। पहिले यिनै वाक्यांश अभ्यास गर्नुहोस्।',
 tip:'Ich fahre mit dem Bus. (I travel by bus. / म बसमा यात्रा गर्छु।)',
 questions:[
 ['Ich fahre mit ___ Bus.',['den','dem','der'],1,'I travel by bus.','म बसमा यात्रा गर्छु।','mit requires dative: dem Bus.'],
 ['Ich bin bei ___ Ärztin.',['die','das','der'],2,'I am at the female doctor’s practice.','म महिला डाक्टरको क्लिनिकमा छु।','bei takes dative: der Ärztin.'],
 ['Kannst du ___ helfen?',['mir','mich','ich'],0,'Can you help me?','के तिमी मलाई सहयोग गर्न सक्छौ?','helfen uses dative: mir.']
 ]},
 {id:'modals',unit:'a1-28',title:'Modal verbs + infinitive',icon:'🔧',
 en:'The conjugated modal normally takes position two; the main infinitive goes at the end: ich muss lernen.',
 ne:'रूप बदलिएको मोडल क्रिया प्रायः दोस्रो स्थानमा र मुख्य क्रियाको मूलरूप अन्त्यमा हुन्छ: ich muss lernen।',
 tip:'Wir können morgen kommen. (We can come tomorrow. / हामी भोलि आउन सक्छौँ।)',
 questions:[
 ['Ich ___ heute arbeiten.',['musst','muss','müssen'],1,'I must work today.','म आज काम गर्नैपर्छ।','ich muss, then infinitive arbeiten at the end.'],
 ['Wir ___ Deutsch sprechen.',['kann','kannst','können'],2,'We can speak German.','हामी जर्मन बोल्न सक्छौँ।','wir können, then sprechen.'],
 ['Du ___ hier nicht rauchen.',['darfst','darf','dürft'],0,'You may not smoke here.','तिमीलाई यहाँ धूमपान गर्न अनुमति छैन।','du darfst is the correct form.']
 ]},
 {id:'separable',unit:'a1-21',title:'Separable verbs in main clauses',icon:'🧩',
 en:'In a simple main clause, the conjugated verb stays early and the separable prefix moves to the end.',
 ne:'साधारण मुख्य वाक्यमा क्रियाको मुख्य भाग अगाडि र छुट्टिने उपसर्ग अन्त्यमा जान्छ।',
 tip:'Ich stehe um sieben Uhr auf. (I get up at seven. / म सात बजे उठ्छु।)',
 questions:[
 ['Ich stehe um sieben Uhr ___.',['auf','an','ein'],0,'I get up at seven.','म सात बजे उठ्छु।','aufstehen splits: stehe ... auf.'],
 ['Sie ruft ihre Mutter ___.',['aus','an','mit'],1,'She calls her mother.','उनी आफ्नी आमालाई फोन गर्छिन्।','anrufen splits: ruft ... an.'],
 ['Wir kaufen heute ___.',['an','auf','ein'],2,'We are shopping today.','हामी आज किनमेल गर्छौँ।','einkaufen splits: kaufen ... ein.']
 ]},
 {id:'time',unit:'a1-06',title:'Time: um, am, im',icon:'🕒',
 en:'Use um for clock times, am for weekdays/days and im for months or seasons.',
 ne:'घडीको समयका लागि um, बार वा दिनका लागि am, महिना वा ऋतुका लागि im प्रयोग गर्नुहोस्।',
 tip:'am Montag · um neun Uhr · im Winter (सोमबार · नौ बजे · जाडोमा)',
 questions:[
 ['Der Kurs beginnt ___ neun Uhr.',['um','am','im'],0,'The course starts at nine.','कक्षा नौ बजे सुरु हुन्छ।','Clock time uses um.'],
 ['Wir treffen uns ___ Montag.',['im','am','um'],1,'We meet on Monday.','हामी सोमबार भेट्छौँ।','Weekday uses am.'],
 ['___ Winter ist es kalt.',['Am','Um','Im'],2,'In winter it is cold.','जाडोमा चिसो हुन्छ।','Seasons use im.']
 ]},
 {id:'past',unit:'a1-30',title:'First steps with Perfekt',icon:'🕰️',
 en:'Simple conversational past: haben/sein in the present + past participle. Many movement/change-of-place verbs use sein.',
 ne:'बोलचालको सरल भूतकाल: वर्तमानको haben/sein + Partizip II। धेरै स्थान परिवर्तन जनाउने क्रियामा sein प्रयोग हुन्छ।',
 tip:'Ich habe gelernt. Ich bin gefahren. (I studied. I travelled. / मैले पढेँ। मैले यात्रा गरेँ।)',
 questions:[
 ['Ich ___ gestern Deutsch gelernt.',['habe','bin','hat'],0,'I studied German yesterday.','मैले हिजो जर्मन पढेँ।','lernen takes haben: habe gelernt.'],
 ['Sie ___ nach Bonn gefahren.',['hat','ist','haben'],1,'She travelled to Bonn.','उनी बोन गइन्।','fahren as a change of place usually takes sein: ist gefahren.'],
 ['Wir haben Brot ___.',['gekauft','kaufen','gekauftet'],0,'We bought bread.','हामीले पाउरोटी किन्यौँ।','kaufen → gekauft.']
 ]},
 {id:'questions',unit:'a1-14',title:'Simple German question word order',icon:'❓',
 en:'With a question word: Wo wohnst du? Yes/no questions often start with the finite verb: Kommst du morgen?',
 ne:'प्रश्न शब्द भएको वाक्य: Wo wohnst du? हो/होइन प्रश्नमा रूप बदलिएको क्रिया प्रायः सुरुवातमा आउँछ: Kommst du morgen?',
 tip:'Wo wohnst du? (Where do you live? / तिमी कहाँ बस्छौ?)',
 questions:[
 ['___ wohnst du?',['Wann','Wo','Wer'],1,'Where do you live?','तिमी कहाँ बस्छौ?','Ask for a location with Wo.'],
 ['___ du morgen?',['Kommst','Du kommst','Kommen'],0,'Are you coming tomorrow?','के तिमी भोलि आउँछौ?','Yes/no questions usually start with the conjugated verb.'],
 ['___ beginnt der Kurs?',['Was','Wer','Wann'],2,'When does the course begin?','कक्षा कहिले सुरु हुन्छ?','Ask for a time with Wann.']
 ]},
 {id:'polite',unit:'a1-22',title:'Polite requests and imperative',icon:'🙏',
 en:'Use a polite Sie-form request or a simple informal command, often softened with bitte.',
 ne:'विनम्र अनुरोधमा Sie को रूप वा सामान्य अनौपचारिक आदेश प्रयोग गर्नुहोस्। bitte ले बोली विनम्र बनाउँछ।',
 tip:'Warten Sie bitte hier. (Please wait here. / कृपया यहाँ पर्खनुहोस्।)',
 questions:[
 ['___ Sie bitte hier.',['Wartet','Warten','Warte'],1,'Please wait here.','कृपया यहाँ पर्खनुहोस्।','Formal command: Warten Sie bitte.'],
 ['___ bitte die Tür zu, Tom.',['Mach','Macht','Machen'],0,'Tom, please close the door.','टम, कृपया ढोका बन्द गर।','Informal singular du-command: Mach ... zu.'],
 ['___ Sie bitte langsam.',['Sprecht','Spreche','Sprechen'],2,'Please speak slowly.','कृपया बिस्तारै बोल्नुहोस्।','Formal request: Sprechen Sie bitte langsam.']
 ]}
];
window.DEUTSCH_A1_GRAMMAR_BRIDGE=topics;
})();