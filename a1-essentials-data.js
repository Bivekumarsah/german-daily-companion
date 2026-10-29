/* Original DeutschDaily A1 essential expressions.
   The Goethe A1 word-list themes informed topic selection; source examples are NOT reproduced.
   German, English meaning, नेपाली meaning, original German example, English meaning of example. */
(() => {
 'use strict';
 const groups=[
 {id:'actions',title:'🚶 Important everyday verbs',items:[
 ['gehen','to go','जानु','Ich gehe heute zur Schule.','I am going to school today.'],
 ['fahren','to travel by vehicle','सवारी साधनमा जानु','Wir fahren morgen mit dem Zug.','We are travelling by train tomorrow.'],
 ['bleiben','to stay','बसिरहनु','Ich bleibe heute zu Hause.','I am staying home today.'],
 ['beginnen','to begin','सुरु हुनु','Der Kurs beginnt um neun Uhr.','The course begins at nine.'],
 ['brauchen','to need','चाहिनु','Ich brauche einen Stift.','I need a pen.'],
 ['bringen','to bring','ल्याउनु','Ich bringe das Buch mit.','I am bringing the book along.'],
 ['finden','to find','भेट्टाउनु','Ich finde meinen Schlüssel nicht.','I cannot find my key.'],
 ['suchen','to look for','खोज्नु','Ich suche eine Wohnung.','I am looking for an apartment.']
 ]},
 {id:'personal',title:'👀 Daily routine and actions',items:[
 ['essen','to eat','खानु','Wir essen um zwölf Uhr.','We eat at twelve.'],
 ['trinken','to drink','पिउनु','Ich trinke gern Wasser.','I like drinking water.'],
 ['kochen','to cook','पकाउनु','Mein Vater kocht heute.','My father is cooking today.'],
 ['sehen','to see','देख्नु','Ich sehe den Bus.','I see the bus.'],
 ['nehmen','to take','लिनु','Ich nehme einen Kaffee.','I will have a coffee.'],
 ['tragen','to wear / carry','लगाउनु / बोक्नु','Er trägt eine blaue Jacke.','He is wearing a blue jacket.'],
 ['öffnen','to open','खोल्नु','Ich öffne das Fenster.','I am opening the window.'],
 ['schließen','to close','बन्द गर्नु','Bitte schließen Sie die Tür.','Please close the door.']
 ]},
 {id:'people',title:'🤝 Meeting and communicating',items:[
 ['sagen','to say','भन्नु','Was sagen Sie?','What are you saying?'],
 ['erzählen','to tell / narrate','बताउनु','Er erzählt von seiner Familie.','He talks about his family.'],
 ['besuchen','to visit','भेट्न जानु','Ich besuche meine Tante.','I am visiting my aunt.'],
 ['einladen','to invite','निम्त्याउनु','Ich lade dich am Samstag ein.','I am inviting you on Saturday.'],
 ['abholen','to pick up','लिन जानु','Wir holen dich am Bahnhof ab.','We will pick you up at the station.'],
 ['warten','to wait','कुर्नु','Ich warte auf den Bus.','I am waiting for the bus.'],
 ['kennen','to know / be familiar with','चिन्नु','Ich kenne diese Straße.','I know this street.'],
 ['zeigen','to show','देखाउनु','Zeigen Sie mir bitte den Weg.','Please show me the way.']
 ]},
 {id:'shopping',title:'🛒 Shopping and practical needs',items:[
 ['zahlen','to pay','पैसा तिर्नु','Ich möchte bitte zahlen.','I would like to pay, please.'],
 ['wechseln','to change / exchange','साट्नु / बदल्नु','Kann ich hier Geld wechseln?','Can I exchange money here?'],
 ['anprobieren','to try on clothes','लुगा लगाएर हेर्नु','Kann ich die Jacke anprobieren?','Can I try on the jacket?'],
 ['bestellen','to order','अर्डर गर्नु','Wir bestellen zwei Getränke.','We are ordering two drinks.'],
 ['reservieren','to reserve','आरक्षण गर्नु','Ich möchte ein Zimmer reservieren.','I would like to reserve a room.'],
 ['unterschreiben','to sign','हस्ताक्षर गर्नु','Bitte unterschreiben Sie hier.','Please sign here.'],
 ['ausfüllen','to fill in a form','फारम भर्नु','Füllen Sie bitte das Formular aus.','Please fill out the form.'],
 ['ankreuzen','to tick / mark a box','चिनो लगाउनु','Kreuzen Sie die richtige Antwort an.','Tick the correct answer.']
 ]},
 {id:'adverbs',title:'⏰ Time and frequency words',items:[
 ['jetzt','now','अहिले','Ich habe jetzt Zeit.','I have time now.'],
 ['bald','soon','चाँडै','Der Bus kommt bald.','The bus will come soon.'],
 ['immer','always','सधैँ','Sie lernt immer am Abend.','She always studies in the evening.'],
 ['oft','often','अक्सर','Wir gehen oft spazieren.','We often go for a walk.'],
 ['manchmal','sometimes','कहिलेकाहीँ','Manchmal trinke ich Tee.','Sometimes I drink tea.'],
 ['später','later','पछि','Ich rufe später an.','I will call later.'],
 ['zuerst','first','सुरुमा','Zuerst frühstücke ich.','First I eat breakfast.'],
 ['danach','afterwards','त्यसपछि','Danach gehe ich zur Arbeit.','Afterwards I go to work.']
 ]},
 {id:'qualities',title:'🌤️ Describe people and things',items:[
 ['gut','good / well','राम्रो','Mir geht es gut.','I am doing well.'],
 ['schlecht','bad / poorly','नराम्रो','Das Wetter ist schlecht.','The weather is bad.'],
 ['müde','tired','थाकेको','Ich bin heute müde.','I am tired today.'],
 ['hungrig','hungry','भोक लागेको','Wir sind hungrig.','We are hungry.'],
 ['durstig','thirsty','तिर्खा लागेको','Er ist durstig.','He is thirsty.'],
 ['sauber','clean','सफा','Das Zimmer ist sauber.','The room is clean.'],
 ['schmutzig','dirty','फोहोर','Die Schuhe sind schmutzig.','The shoes are dirty.'],
 ['wichtig','important','महत्त्वपूर्ण','Der Termin ist wichtig.','The appointment is important.']
 ]},
 {id:'connectors',title:'🔗 Small but important words',items:[
 ['und','and','र','Ich lerne Deutsch und Englisch.','I am learning German and English.'],
 ['aber','but','तर','Ich komme, aber etwas später.','I am coming, but a little later.'],
 ['oder','or','वा / अथवा','Möchtest du Tee oder Kaffee?','Would you like tea or coffee?'],
 ['auch','also','पनि','Ich spreche auch Englisch.','I also speak English.'],
 ['nur','only','मात्र','Ich habe nur fünf Euro.','I only have five euros.'],
 ['noch','still / another','अझै / अर्को','Ich brauche noch ein Glas Wasser.','I need one more glass of water.'],
 ['sehr','very','धेरै','Das Essen ist sehr gut.','The food is very good.'],
 ['zusammen','together','सँगै','Wir lernen zusammen.','We study together.']
 ]},
 {id:'prepositions',title:'📍 Location and direction words',items:[
 ['mit','with','सँग','Ich fahre mit dem Bus.','I travel by bus.'],
 ['ohne','without','बिना','Ich trinke Kaffee ohne Zucker.','I drink coffee without sugar.'],
 ['für','for','को लागि','Das Geschenk ist für dich.','The gift is for you.'],
 ['bei','at / with / near','कोमा / नजिक','Ich bin bei meiner Schwester.','I am at my sister’s place.'],
 ['nach','to (cities/countries) / after','तर्फ / पछि','Wir fahren nach Berlin.','We are going to Berlin.'],
 ['aus','from / out of','बाट','Ich komme aus Nepal.','I come from Nepal.'],
 ['von','from / of','बाट / को','Das ist ein Brief von Anna.','This is a letter from Anna.'],
 ['zu','to','तर्फ / कहाँ','Ich gehe zum Arzt.','I am going to the doctor.']
 ]},
 {id:'requests',title:'🙏 Useful questions and polite expressions',items:[
 ['entschuldigen','to excuse','माफ गर्नु','Entschuldigen Sie bitte.','Excuse me, please.'],
 ['noch einmal','once again','अझ एकपटक','Bitte sagen Sie das noch einmal.','Please say that again.'],
 ['langsam','slowly','बिस्तारै','Sprechen Sie bitte langsam.','Please speak slowly.'],
 ['sofort','immediately','तुरुन्तै','Ich komme sofort.','I am coming immediately.'],
 ['vielleicht','perhaps / maybe','सायद','Vielleicht kommt er morgen.','Maybe he will come tomorrow.'],
 ['ein bisschen','a little','अलिकति','Ich spreche ein bisschen Deutsch.','I speak a little German.'],
 ['genau','exactly / correct','ठ्याक्कै / सही','Ja, genau!','Yes, exactly!'],
 ['natürlich','of course','अवश्य','Natürlich helfe ich dir.','Of course I will help you.']
 ]}
 ];
 window.DEUTSCH_A1_ESSENTIALS=groups;
})();