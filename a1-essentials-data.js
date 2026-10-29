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
 ]},
 {id:'directions',title:'🚆 Travel and exam instructions',items:[
 ['abfahren','to depart (vehicle)','प्रस्थान गर्नु','Der Zug fährt um acht Uhr ab.','The train departs at eight.'],
 ['ankommen','to arrive','आइपुग्नु','Wir kommen morgen an.','We arrive tomorrow.'],
 ['anfangen','to start / begin','सुरु गर्नु','Der Unterricht fängt um neun Uhr an.','The lesson starts at nine.'],
 ['abgeben','to hand in / submit','बुझाउनु','Bitte geben Sie das Formular hier ab.','Please hand in the form here.'],
 ['sich anmelden','to register','दर्ता गर्नु','Ich möchte mich für den Kurs anmelden.','I would like to register for the course.'],
 ['anbieten','to offer','प्रस्ताव गर्नु','Kann ich dir Tee anbieten?','Can I offer you tea?'],
 ['ergänzen','to complete / fill in','पूरा गर्नु','Ergänzen Sie bitte das Wort.','Please complete the word.'],
 ['aussteigen','to get off a vehicle','सवारीबाट ओर्लनु','Wir steigen an der nächsten Haltestelle aus.','We get off at the next stop.']
 ]},
 {id:"official-paperwork",title:"✉️ Forms, messages and paperwork",items:[
 ["der Absender","sender","पत्र पठाउने व्यक्ति","Der Absender steht auf dem Brief.","The sender is written on the letter."],
 ["die Briefmarke","postage stamp","हुलाक टिकट","Ich kaufe eine Briefmarke bei der Post.","I buy a stamp at the post office."],
 ["die Anzeige","advertisement","विज्ञापन","Ich lese eine Anzeige für ein Zimmer.","I read an advertisement for a room."],
 ["die Ansage","announcement","घोषणा","Die Ansage kommt am Bahnhof.","The announcement is at the train station."],
 ["das Datum","date","मिति","Bitte schreiben Sie das Datum hier.","Please write the date here."],
 ["das Formular","form","फारम","Ich brauche ein Formular für den Kurs.","I need a form for the course."],
 ["der Drucker","printer","प्रिन्टर","Der Drucker steht im Büro.","The printer is in the office."],
 ["das Konto","bank account","बैंक खाता","Ich habe ein Konto bei dieser Bank.","I have an account at this bank."]
 ]},
 {id:"official-food-home",title:"🍐 Food and things at home",items:[
 ["die Birne","pear","नासपाती","Ich esse eine Birne zum Frühstück.","I eat a pear for breakfast."],
 ["die Butter","butter","मक्खन","Möchtest du Brot mit Butter?","Would you like bread with butter?"],
 ["der Fisch","fish","माछा","Der Fisch ist heute frisch.","The fish is fresh today."],
 ["das Gemüse","vegetables","तरकारी","Ich kaufe Gemüse auf dem Markt.","I buy vegetables at the market."],
 ["das Obst","fruit","फलफूल","Das Obst ist im Kühlschrank.","The fruit is in the fridge."],
 ["der Kühlschrank","refrigerator","फ्रिज","Die Milch steht im Kühlschrank.","The milk is in the fridge."],
 ["das Öl","oil","तेल","Für den Salat brauche ich Öl.","I need oil for the salad."],
 ["der Garten","garden","बगैँचा","Die Kinder spielen im Garten.","The children play in the garden."]
 ]},
 {id:"official-work",title:"💻 Work and public life",items:[
 ["arbeitslos","unemployed","बेरोजगार","Mein Nachbar ist zurzeit arbeitslos.","My neighbour is unemployed at the moment."],
 ["die Firma","company","कम्पनी","Mein Bruder arbeitet in einer Firma.","My brother works at a company."],
 ["der Computer","computer","कम्प्युटर","Mein Computer ist heute langsam.","My computer is slow today."],
 ["der Arbeitsplatz","workplace","कार्यस्थल","Mein Arbeitsplatz ist in der Stadt.","My workplace is in the city."],
 ["der Kollege","male colleague","सहकर्मी (पुरुष)","Mein Kollege kommt um neun Uhr.","My colleague arrives at nine."],
 ["die Polizei","police","प्रहरी","Die Polizei ist vor dem Bahnhof.","The police are in front of the station."],
 ["der Koffer","suitcase","सुटकेस","Mein Koffer ist sehr schwer.","My suitcase is very heavy."],
 ["die Freizeit","free time","फुर्सदको समय","In meiner Freizeit lese ich gern.","I like reading in my free time."]
 ]},
 {id:"official-travel-services",title:"✈️ Travel and service words",items:[
 ["der Flughafen","airport","विमानस्थल","Der Bus fährt zum Flughafen.","The bus goes to the airport."],
 ["die Rezeption","hotel reception","होटलको रिसेप्सन","Der Schlüssel ist an der Rezeption.","The key is at reception."],
 ["die S-Bahn","suburban train","शहरी रेल सेवा","Ich fahre mit der S-Bahn zur Arbeit.","I travel to work on the S-Bahn."],
 ["der Schalter","counter / service desk","काउन्टर","Wo ist der Schalter für Fahrkarten?","Where is the ticket counter?"],
 ["der Aufzug","elevator","लिफ्ट","Der Aufzug ist rechts.","The lift is on the right."],
 ["die Auskunft","information / enquiry desk","सूचना / सोधपुछ","Ich brauche eine Auskunft zum Zug.","I need information about the train."],
 ["der Abflug","flight departure","उडान प्रस्थान","Der Abflug ist um sieben Uhr.","The departure is at seven."],
 ["der Anschluss","connection (transport)","अर्को यातायातसँगको जडान","Wir haben in Köln Anschluss.","We have a connection in Cologne."]
 ]},
 {id:"official-instructions",title:"📋 Signs, tasks and instructions",items:[
 ["Achtung","attention / caution","सावधान","Achtung! Der Boden ist nass.","Caution! The floor is wet."],
 ["aufhören","to stop","रोक्नु","Der Unterricht hört um drei Uhr auf.","The lesson ends at three."],
 ["dauern","to take (time)","समय लाग्नु","Wie lange dauert der Film?","How long does the film last?"],
 ["reparieren","to repair","मर्मत गर्नु","Ich muss mein Fahrrad reparieren.","I must repair my bicycle."],
 ["pünktlich","punctual / on time","समयमै","Der Zug ist heute pünktlich.","The train is on time today."],
 ["der Fehler","mistake / error","गल्ती","Ich habe einen Fehler gemacht.","I made a mistake."],
 ["der Bleistift","pencil","सिसाकलम","Ich schreibe mit einem Bleistift.","I write with a pencil."],
 ["die Lösung","solution","समाधान","Die Lösung ist ganz einfach.","The solution is very simple."]
 ]},
 {id:"official-people-nature",title:"🌷 Body, family and nature",items:[
 ["der Arm","arm","पाखुरा","Mein Arm tut weh.","My arm hurts."],
 ["das Auge","eye","आँखा","Mein linkes Auge tut weh.","My left eye hurts."],
 ["der Hund","dog","कुकुर","Der Hund schläft im Garten.","The dog is sleeping in the garden."],
 ["die Blume","flower","फूल","Die Blume ist gelb.","The flower is yellow."],
 ["die Oma","grandmother (informal)","हजुरआमा","Meine Oma wohnt in Bonn.","My grandmother lives in Bonn."],
 ["der Opa","grandfather (informal)","हजुरबुबा","Mein Opa hört gern Musik.","My grandfather likes listening to music."],
 ["der Fuß","foot","खुट्टा","Mein rechter Fuß tut weh.","My right foot hurts."],
 ["der Mund","mouth","मुख","Öffnen Sie bitte den Mund.","Please open your mouth."]
 ]},
 {id:"official-small-words-2",title:"🔗 Connectors and essential little words",items:[
 ["ab","from (time or place)","बाट / देखि","Ab morgen habe ich Urlaub.","I am on holiday from tomorrow."],
 ["allein","alone","एक्लै","Ich wohne allein in Berlin.","I live alone in Berlin."],
 ["anmachen","to switch on","खोल्नु / चालु गर्नु","Kannst du bitte die Lampe anmachen?","Can you switch on the lamp, please?"],
 ["ausmachen","to switch off","बन्द गर्नु","Ich mache das Radio aus.","I switch off the radio."],
 ["danken","to thank","धन्यवाद दिनु","Ich danke dir für deine Hilfe.","I thank you for your help."],
 ["dann","then","त्यसपछि","Wir essen und dann gehen wir spazieren.","We eat and then go for a walk."],
 ["dich","you (informal accusative)","तिमीलाई (कर्मकारक)","Ich kenne dich aus dem Kurs.","I know you from the course."],
 ["dir","to you (informal dative)","तिमीलाई (दातिव)","Ich gebe dir das Buch.","I give you the book."]
 ]},
 {id:"official-place-2",title:"🏘️ People, surroundings and location",items:[
 ["das Dorf","village","गाउँ","Meine Oma lebt in einem kleinen Dorf.","My grandmother lives in a small village."],
 ["draußen","outside","बाहिर","Die Kinder spielen draußen.","The children are playing outside."],
 ["das Foto","photo","फोटो","Auf dem Foto ist meine Familie.","My family is in the photo."],
 ["die Frau","woman / wife / Ms.","महिला / श्रीमती","Die Frau wartet auf den Bus.","The woman is waiting for the bus."],
 ["hier","here","यहाँ","Ich wohne hier in der Nähe.","I live near here."],
 ["in","in / into","मा / भित्र","Meine Schlüssel sind in der Tasche.","My keys are in the bag."],
 ["leben","to live","जीवन बिताउनु / बस्नु","Meine Eltern leben in Nepal.","My parents live in Nepal."],
 ["das Licht","light","बत्ती / प्रकाश","Im Zimmer ist das Licht an.","The light is on in the room."]
 ]},
 {id:"official-everyday-2",title:"☕ Conversations and everyday situations",items:[
 ["man","one / people (impersonal)","सामान्य रूपमा मानिसहरू","Hier kann man gut essen.","You can eat well here."],
 ["mehr","more","अझ बढी","Möchten Sie noch mehr Wasser?","Would you like more water?"],
 ["möchten","would like","चाहनु (विनम्र रूपमा)","Ich möchte ein Glas Wasser.","I would like a glass of water."],
 ["mögen","to like","मन पराउनु","Ich mag Musik.","I like music."],
 ["rauchen","to smoke","धूमपान गर्नु","Meine Freunde rauchen nicht.","My friends do not smoke."],
 ["das Restaurant","restaurant","रेस्टुरेन्ट","Das Restaurant ist heute geöffnet.","The restaurant is open today."],
 ["richtig","correct / right","सही","Deine Antwort ist richtig.","Your answer is correct."],
 ["der Schuh","shoe (singular)","जुत्ता (एकवचन)","Wo ist mein linker Schuh?","Where is my left shoe?"]
 ]},
 {id:"official-family-grammar-2",title:"👨‍👩‍👧 Family, actions and descriptions",items:[
 ["der Sohn","son","छोरा","Mein Sohn ist neun Jahre alt.","My son is nine years old."],
 ["tun","to do","गर्नु","Was kann ich für Sie tun?","What can I do for you?"],
 ["über","over / about","माथि / बारेमा","Wir sprechen über den Kurs.","We are talking about the course."],
 ["verkaufen","to sell","बेच्नु","Sie verkauft Gemüse auf dem Markt.","She sells vegetables at the market."],
 ["verheiratet","married","विवाहित","Meine Schwester ist verheiratet.","My sister is married."],
 ["vor","in front of / before","अगाडि / पहिले","Der Bus hält vor der Schule.","The bus stops in front of the school."],
 ["weiblich","female (on forms)","महिला (फारममा)","Im Formular steht weiblich.","The form says female."],
 ["werden","to become","बन्नु","Ich möchte Lehrer werden.","I would like to become a teacher."]
 ]},
 {id:"official-forms-travel-2",title:"🪪 Essential forms and travel",items:[
 ["willkommen","welcome","स्वागत छ","Herzlich willkommen in unserer Schule!","A warm welcome to our school!"],
 ["wir","we","हामी","Wir lernen heute Deutsch.","We are learning German today."],
 ["wissen","to know (a fact)","थाहा हुनु","Ich weiß seine Telefonnummer nicht.","I do not know his phone number."],
 ["die Zeit","time","समय","Hast du heute Zeit?","Do you have time today?"],
 ["zwischen","between","बीचमा","Die Bank liegt zwischen dem Kino und dem Hotel.","The bank is between the cinema and the hotel."],
 ["der Ausweis","identity card / ID","परिचयपत्र","Ich zeige meinen Ausweis am Schalter.","I show my ID at the counter."],
 ["das Auto","car","कार / गाडी","Unser Auto ist alt.","Our car is old."],
 ["der Urlaub","holiday / vacation","बिदा / छुट्टी","Im Urlaub besuche ich meine Familie.","On holiday I visit my family."]
 ]},
 {id:"full-audit-services",title:"🚉 Stations, forms and services",items:[
 ["abfliegen","to depart by plane","विमानबाट प्रस्थान गर्नु","Unser Flugzeug fliegt um sechs Uhr ab.","Our plane departs at six."],
 ["anklicken","to click","क्लिक गर्नु","Bitte klicken Sie den Link an.","Please click the link."],
 ["drucken","to print","प्रिन्ट गर्नु","Ich drucke heute das Formular.","I am printing the form today."],
 ["drücken","to press","थिच्नु","Drücken Sie bitte diesen Knopf.","Please press this button."],
 ["benutzen","to use","प्रयोग गर्नु","Sie können den Aufzug benutzen.","You can use the lift."],
 ["besetzt","occupied / engaged","भरिएको / व्यस्त","Dieser Platz ist besetzt.","This seat is occupied."],
 ["der Bahnsteig","railway platform","रेल प्लेटफर्म","Der Zug fährt von Bahnsteig drei ab.","The train departs from platform three."],
 ["der Buchstabe","letter of the alphabet","वर्ण / अक्षर","Mein Name beginnt mit dem Buchstaben A.","My name begins with the letter A."]
 ]},
 {id:"full-audit-actions",title:"🗣️ Important verbs and relationships",items:[
 ["aussehen","to look / appear","देखिनु","Du siehst heute müde aus.","You look tired today."],
 ["baden","to bathe / swim recreationally","नुहाउनु / पानीमा खेल्नु","Die Kinder baden im See.","The children are bathing in the lake."],
 ["bedeuten","to mean","अर्थ हुनु","Was bedeutet dieses Wort?","What does this word mean?"],
 ["bekommen","to receive / get","प्राप्त गर्नु","Ich bekomme heute einen Brief.","I am receiving a letter today."],
 ["heiraten","to marry","विवाह गर्नु","Sie heiraten im Sommer.","They are getting married in summer."],
 ["gehören","to belong to","को हुनु / स्वामित्वमा हुनु","Wem gehört dieses Fahrrad?","Who does this bicycle belong to?"],
 ["geboren","born","जन्मिएको","Ich bin in Nepal geboren.","I was born in Nepal."],
 ["gegen","against","विरुद्ध / सँग प्रतिस्पर्धा","Ich spiele gegen meinen Bruder.","I am playing against my brother."]
 ]},
 {id:"full-audit-descriptions",title:"✨ Describing daily situations",items:[
 ["automatisch","automatic / automatically","स्वचालित रूपमा","Die Tür öffnet sich automatisch.","The door opens automatically."],
 ["bar","in cash","नगद","Kann ich bar bezahlen?","Can I pay in cash?"],
 ["beide","both","दुवै","Beide Kinder gehen zur Schule.","Both children go to school."],
 ["bekannt","well-known / familiar","परिचित / प्रसिद्ध","Dieses Restaurant ist sehr bekannt.","This restaurant is very well known."],
 ["eilig","in a hurry","हतार भएको","Ich habe es heute eilig.","I am in a hurry today."],
 ["einfach","easy / simple","सजिलो","Diese Aufgabe ist einfach.","This exercise is easy."],
 ["fertig","finished / ready","सकिएको / तयार","Ich bin mit den Hausaufgaben fertig.","I have finished my homework."],
 ["fremd","unfamiliar / foreign","अपरिचित","Diese Stadt ist mir noch fremd.","This city is still unfamiliar to me."]
 ]},
 {id:"full-audit-home",title:"🏡 Family, body and neighbourhood",items:[
 ["die Bäckerei","bakery","पाउरोटी पसल","Die Bäckerei öffnet um sieben Uhr.","The bakery opens at seven."],
 ["der Balkon","balcony","बार्दली","Wir sitzen auf dem Balkon.","We are sitting on the balcony."],
 ["der Baum","tree","रूख","Der Baum steht vor dem Haus.","The tree stands in front of the house."],
 ["das Bein","leg","खुट्टा","Mein rechtes Bein tut weh.","My right leg hurts."],
 ["der Durst","thirst","तिर्खा","Nach dem Sport habe ich Durst.","I am thirsty after exercising."],
 ["die Geschwister","siblings","दाजुभाइ दिदीबहिनी","Ich habe zwei Geschwister.","I have two siblings."],
 ["der Herd","cooker / stove","चुलो","Der Herd steht in der Küche.","The stove is in the kitchen."],
 ["der Herr","Mr. / gentleman","श्री / महोदय","Herr Müller arbeitet heute.","Mr Müller is working today."]
 ]},
 {id:"full-audit-conversation",title:"💬 Extra common A1 expressions",items:[
 ["also","so / well / therefore","त्यसो भए / अर्थात्","Also, wir beginnen jetzt.","Well, we are starting now."],
 ["durch","through","हुँदै / भित्रबाट","Wir gehen durch den Park.","We are walking through the park."],
 ["glücklich","happy","खुसी","Heute bin ich sehr glücklich.","I am very happy today."],
 ["gültig","valid","मान्य","Mein Ticket ist noch gültig.","My ticket is still valid."],
 ["hell","bright / light","उज्यालो","Das Zimmer ist hell.","The room is bright."],
 ["das Hähnchen","chicken (food)","कुखुराको मासु","Ich esse heute Hähnchen mit Reis.","I am eating chicken with rice today."],
 ["das Gespräch","conversation / meeting","कुराकानी","Das Gespräch beginnt um zehn Uhr.","The conversation begins at ten."],
 ["die Großeltern","grandparents","हजुरबुबा र हजुरआमा","Meine Großeltern wohnen in Kathmandu.","My grandparents live in Kathmandu."]
 ]},
 {id:"full-audit-meaning-variants",title:"📖 Same word, different meaning or form",items:[
 ["die Bitte","request / plea","अनुरोध","Ich habe eine Bitte: Helfen Sie mir bitte.","I have a request: Please help me."],
 ["das Leben","life","जीवन","Das Leben in meiner Stadt ist schön.","Life in my city is beautiful."],
 ["sich treffen","to meet (each other)","एकअर्कालाई भेट्नु","Wir treffen uns morgen im Park.","We are meeting in the park tomorrow."],
 ["sich vorstellen","to introduce oneself","आफ्नो परिचय दिनु","Ich stelle mich kurz vor: Ich heiße Anil.","Let me introduce myself briefly: My name is Anil."],
 ["die Entschuldigung","apology / excuse","माफी / क्षमायाचना","Entschuldigung! Wo ist die Post?","Excuse me! Where is the post office?"],
 ["sich duschen","to shower oneself","नुहाउनु","Ich dusche mich jeden Morgen.","I take a shower every morning."],
 ["das Angebot","offer / special deal","प्रस्ताव / विशेष छुट","Das Angebot gilt nur heute.","The offer is valid only today."],
 ["der Anfang","beginning","सुरुवात","Am Anfang ist alles neu.","At the beginning, everything is new."]
 ]}
 ];
 window.DEUTSCH_A1_ESSENTIALS=groups;
})();