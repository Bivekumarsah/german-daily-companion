/* DeutschDaily original A1 exam-format rehearsal questions.
   Independently authored. Goethe examples, recordings and exam questions are NOT reproduced.
   Listening uses the learner's installed German voice, not authentic examination audio. */
(() => {
'use strict';
// Q format: [original German passage or audio script, English question, 3 English answers, correct answer index, task type]
const sets=[
{
 id:'a1-mock-1',title:'Practice Mock 1 · Everyday Germany',
 listening:[
 ['Guten Tag! Die Sprechstunde beginnt heute um neun Uhr, nicht um acht.','When does the consultation begin?',['At 8:00','At 9:00','At 10:00'],1,'announcement'],
 ['Hallo Lina, ich komme am Freitag nach Köln. Am Samstag besuche ich meine Tante.','When does the speaker arrive in Cologne?',['Thursday','Saturday','Friday'],2,'message'],
 ['Ich brauche zwei Fahrkarten nach Bonn, bitte.','How many tickets does the customer need?',['One','Two','Three'],1,'dialogue'],
 ['Das Brot kostet zwei Euro und der Kaffee drei Euro.','How much does the coffee cost?',['€3','€2','€5'],0,'dialogue'],
 ['Der Zug nach Hamburg fährt heute von Gleis fünf ab.','Which platform is for Hamburg?',['Platform 4','Platform 6','Platform 5'],2,'announcement'],
 ['Meine Telefonnummer ist null eins sieben sechs, vier fünf zwei, drei acht null.','Which digits begin the phone number?',['0176','0167','0716'],0,'message'],
 ['Guten Morgen! Die Bibliothek öffnet montags erst um zehn Uhr.','When does the library open on Mondays?',['At 9:00','At 10:00','At 11:00'],1,'announcement'],
 ['Ich kann leider heute nicht zum Kurs kommen. Ich bin krank.','Why cannot the speaker attend class?',['Because of work','Because of travel','Because of illness'],2,'message'],
 ['Wir treffen uns vor dem Kino um halb sieben.','When is the meeting?',['6:30','7:30','6:15'],0,'dialogue'],
 ['Entschuldigung, wo ist die Post? Gehen Sie geradeaus und dann links.','Which way should the listener go?',['Right, then straight','Straight, then left','Straight, then right'],1,'dialogue'],
 ['Im Hotel gibt es heute noch ein Einzelzimmer, aber kein Doppelzimmer.','Which room is available?',['A double room','A family room','A single room'],2,'dialogue'],
 ['Ich hätte gern einen Salat und ein Wasser ohne Kohlensäure.','What drink is ordered?',['Still water','Juice','Sparkling water'],0,'dialogue'],
 ['Die Arztpraxis ist am Mittwoch geschlossen. Bitte kommen Sie am Donnerstag.','On which day is the practice closed?',['Thursday','Wednesday','Tuesday'],1,'announcement'],
 ['Die nächste Haltestelle ist Rathaus. Bitte steigen Sie hier aus.','What is the next stop?',['Bahnhof','Schule','Rathaus'],2,'announcement'],
 ['Hier ist das Wetter: Morgen regnet es. Heute scheint noch die Sonne.','What is the forecast for tomorrow?',['Rain','Sun','Snow'],0,'announcement']
 ],
 reading:[
 ['Öffnungszeiten: Montag–Freitag 08:00–17:00 Uhr. Samstag geschlossen.','Can you visit this office on Saturday?',['No','Yes','Only in the morning'],0,'sign'],
 ['Liebe Nina, ich bin heute um 18 Uhr zu Hause. Komm bitte um halb sieben. Tom','When should Nina come?',['At 18:00','At 18:30','At 19:30'],1,'message'],
 ['Wohnung frei: zwei Zimmer, Küche, Bad. 650 Euro im Monat.','What is the monthly rent?',['€560','€600','€650'],2,'advert'],
 ['Deutsch für Anfänger: Dienstag und Donnerstag, 18:00–19:30 Uhr.','On which days are the lessons?',['Tuesday and Thursday','Monday and Wednesday','Friday and Saturday'],0,'advert'],
 ['Im Café: Heute kein Kuchen. Frische Brötchen und Tee sind da.','What is unavailable?',['Tea','Cake','Bread rolls'],1,'notice'],
 ['Liebe Sara, ich arbeite bis 16 Uhr. Danach gehe ich einkaufen. Bis heute Abend!','What does the writer do after work?',['Goes to school','Goes swimming','Goes shopping'],2,'message'],
 ['Achtung: Der Fahrstuhl ist kaputt. Bitte benutzen Sie die Treppe.','What should visitors use?',['The stairs','The lift','The back door'],0,'notice'],
 ['Anmeldung: Bitte bringen Sie Ihren Pass und ein Foto mit.','What two things are needed?',['Cash and keys','Passport and photo','Food and water'],1,'notice'],
 ['Bäckerei: sonntags von 07:00 bis 11:00 Uhr geöffnet.','When does the bakery close on Sunday?',['07:00','10:00','11:00'],2,'sign'],
 ['Hallo Paul, der Bus kommt heute zehn Minuten später. Warte bitte an der Haltestelle.','What is the problem?',['The bus is delayed','The bus is cancelled','The stop is closed'],0,'message'],
 ['Arzttermin für Frau Meier: Donnerstag, 14:30 Uhr.','On what day is the appointment?',['Tuesday','Thursday','Friday'],1,'form'],
 ['Suche Fahrrad für die Stadt. Preis bis 100 Euro. Bitte anrufen!','What does the person want?',['To rent a car','To buy a computer','To find a bicycle'],2,'advert'],
 ['Bitte hier nicht rauchen. Rauchen nur draußen.','Where is smoking permitted?',['Outside','In this room','Everywhere'],0,'sign'],
 ['Liebe Gäste, das Frühstück gibt es von 07:30 bis 10:00 Uhr im Erdgeschoss.','Where is breakfast served?',['On the third floor','On the ground floor','In the garden'],1,'notice'],
 ['E-Mail von Eva: Ich kann am Montag nicht. Am Dienstag habe ich Zeit.','When is Eva available?',['Monday','Wednesday','Tuesday'],2,'message']
 ],
 writing:[
 {type:'form',title:'Fill out a simple registration form',prompt:'A language school asks you to complete a registration form. Invent safe fictional information for Vorname, Nachname, Wohnort, Geburtsdatum and Muttersprache.',fields:['Vorname','Nachname','Wohnort','Geburtsdatum','Muttersprache'],model:'Vorname: Asha\nNachname: Rai\nWohnort: Köln\nGeburtsdatum: 12.04.1998\nMuttersprache: Nepali',tips:['Use a first name and family name.','Write dates clearly (day.month.year).','Do not use real sensitive personal details for practice.']},
 {type:'message',title:'Write a short invitation reply',prompt:'Your friend Lena invites you to dinner on Saturday. Write a short German message: thank her, explain that you cannot come on Saturday, and suggest Sunday.',model:'Liebe Lena,\nvielen Dank für die Einladung. Am Samstag kann ich leider nicht kommen. Hast du am Sonntag Zeit?\nLiebe Grüße\nAsha',tips:['Include greeting and closing.','Answer all three content points.','Use a polite, simple sentence for your suggestion.']}
 ],
 speaking:[
 {title:'Introduce yourself',prompt:'Say your name, country, town, language and one hobby.',model:'Ich heiße Asha. Ich komme aus Nepal. Ich wohne in Köln. Ich spreche Nepali und ein bisschen Deutsch. Ich lese gern.',tips:['Say at least four short sentences.','Speak slowly and clearly.']},
 {title:'Ask a question about time',prompt:'You are speaking to a classmate. Ask when the German course begins, then practise answering the question.',model:'Wann beginnt der Deutschkurs? – Der Kurs beginnt um neun Uhr.',tips:['Use a W-question.','Answer with a clear time.']},
 {title:'Make a polite request',prompt:'You are at the table. Ask another person to give you a glass of water. Then respond politely.',model:'Können Sie mir bitte ein Glas Wasser geben? – Ja, gern. – Vielen Dank!',tips:['Use bitte.','Use an appropriate polite form.']}
 ]
},
{
 id:'a1-mock-2',title:'Practice Mock 2 · Daily Situations',
 listening:[
 ['Hallo! Unser Deutschkurs beginnt morgen um acht Uhr dreißig.','At what time does the course start?',['08:30','08:00','09:30'],0,'announcement'],
 ['Ich fahre heute nicht mit dem Zug. Ich nehme den Bus.','Which transport will the speaker take?',['The train','The bus','A bicycle'],1,'dialogue'],
 ['Bitte holen Sie Ihr Paket am Freitag im Postamt ab.','When should the package be collected?',['Wednesday','Thursday','Friday'],2,'message'],
 ['Am Nachmittag trinke ich Tee. Kaffee trinke ich nur am Morgen.','What does the speaker drink in the afternoon?',['Tea','Coffee','Water'],0,'dialogue'],
 ['Die neue Wohnung liegt im dritten Stock und hat einen Balkon.','Which floor is the apartment on?',['Second','Third','Fourth'],1,'dialogue'],
 ['Heute ist es warm, aber am Wochenende wird es kalt.','What will the weekend weather be like?',['Hot','Rainy','Cold'],2,'announcement'],
 ['Meine Schwester arbeitet in einer Schule. Sie ist Lehrerin.','What is the sister’s job?',['Teacher','Nurse','Doctor'],0,'dialogue'],
 ['Können Sie mich bitte um Viertel nach zehn zurückrufen?','When should the listener call back?',['10:45','10:15','09:15'],1,'message'],
 ['Das Geschäft ist heute bis achtzehn Uhr geöffnet.','When does the shop close?',['At 17:00','At 19:00','At 18:00'],2,'announcement'],
 ['Ich brauche noch ein Kilo Kartoffeln und zwei Tomaten.','How many tomatoes are needed?',['Two','One','Three'],0,'dialogue'],
 ['Der nächste Bus kommt in zwanzig Minuten.','How long until the bus arrives?',['10 minutes','20 minutes','30 minutes'],1,'announcement'],
 ['Hallo Papa! Wir treffen uns an der Schule, nicht am Bahnhof.','Where will they meet?',['At the station','At the cinema','At the school'],2,'message'],
 ['Ich suche meine Brille. Sie liegt auf dem Tisch.','Where are the glasses?',['On the table','Under the bed','In the bag'],0,'dialogue'],
 ['Meine Tochter ist zwölf und mein Sohn ist neun Jahre alt.','How old is the son?',['12','9','19'],1,'dialogue'],
 ['Wir haben heute einen Termin beim Zahnarzt um vier Uhr nachmittags.','What type of appointment is it?',['At a bank','At a school','At a dentist'],2,'message']
 ],
 reading:[
 ['Sportverein: Schwimmen am Mittwoch um 19 Uhr. Anmeldung an der Rezeption.','What activity is offered?',['Swimming','Dancing','Cycling'],0,'advert'],
 ['Hallo Oma, wir kommen am Sonntag zu Besuch. Wir bringen Kuchen mit.','What will the visitors bring?',['Flowers','Cake','Tea'],1,'message'],
 ['Bahnhof: Bitte kaufen Sie Ihr Ticket vor der Fahrt.','When must a ticket be purchased?',['On the train','After the trip','Before the trip'],2,'sign'],
 ['Sonderangebot: Äpfel heute 2 Euro pro Kilo.','What is being sold?',['Apples','Oranges','Potatoes'],0,'advert'],
 ['Liebe Maja, mein Handy ist kaputt. Bitte schreib mir eine E-Mail.','How should Maja contact the writer?',['By phone','By email','By post'],1,'message'],
 ['Heute keine Sprechstunde. Die Praxis ist ab morgen wieder geöffnet.','When does the practice reopen?',['Today','Next week','Tomorrow'],2,'notice'],
 ['Sprachschule: Prüfung am Freitag, 09:00 Uhr. Raum 12.','Which room is for the examination?',['Room 12','Room 9','Room 21'],0,'notice'],
 ['Museum: Kinder bis sechs Jahre haben freien Eintritt.','Who enters for free?',['All adults','Children up to six','All students'],1,'sign'],
 ['Zimmer frei: 1 Person, 40 Euro pro Nacht, Frühstück inklusive.','What is included in the price?',['Dinner','Parking','Breakfast'],2,'advert'],
 ['Anna, ich bin im Supermarkt. Brauchen wir Milch? Antworte bitte schnell!','Where is the writer?',['In the supermarket','At school','At home'],0,'message'],
 ['Fitnessstudio: Jeden Montag geschlossen. Sonst 07:00–21:00 Uhr.','Which day is the studio closed?',['Sunday','Monday','Tuesday'],1,'sign'],
 ['Hotel Sonnenschein: Check-out bis 11 Uhr.','By when must guests check out?',['10:00','12:00','11:00'],2,'notice'],
 ['Hallo Tim, bring bitte dein Buch mit. Wir lernen heute zusammen Deutsch.','What should Tim bring?',['His book','His phone','His bicycle'],0,'message'],
 ['Büro gesucht: zwei Zimmer, Nähe Hauptbahnhof.','What is the advertisement looking for?',['A restaurant','An office','A car'],1,'advert'],
 ['Wegen Bauarbeiten hält die Straßenbahn heute nicht am Markt.','Where does the tram not stop today?',['At the station','At the school','At Markt'],2,'notice']
 ],
 writing:[
 {type:'form',title:'Complete a hotel guest form',prompt:'You have arrived at a hotel. Use fictional details to fill in Vorname, Nachname, Land, Ankunft and Nächte.',fields:['Vorname','Nachname','Land','Ankunft','Nächte'],model:'Vorname: Suman\nNachname: Sharma\nLand: Nepal\nAnkunft: 10.06.2027\nNächte: 2',tips:['Use a country name in German if you know it.','Keep arrival date and number of nights clear.','Use fictional details.']},
 {type:'message',title:'Write a course absence message',prompt:'Write to your German teacher, Frau Weber. Say you are ill, cannot attend class today and ask about homework.',model:'Sehr geehrte Frau Weber,\nich bin leider krank und kann heute nicht zum Deutschkurs kommen. Gibt es Hausaufgaben?\nVielen Dank und freundliche Grüße\nSuman Sharma',tips:['Use a formal greeting.','Mention illness and today.','Ask clearly about homework.']}
 ],
 speaking:[
 {title:'Introduce yourself and spell your surname',prompt:'Introduce yourself with name, country, age and spell your surname out loud.',model:'Ich heiße Suman Sharma. Ich komme aus Nepal. Ich bin 24 Jahre alt. Mein Nachname ist Sharma: S-C-H-A-R-M-A.',tips:['Spell clearly and slowly.','Remember numbers when giving your age.']},
 {title:'Ask about prices',prompt:'Ask a shop assistant how much a notebook costs. Practise the shop assistant’s answer.',model:'Was kostet das Heft? – Das Heft kostet zwei Euro.',tips:['Ask a full question.','Practise a number and currency.']},
 {title:'Request an object politely',prompt:'Ask somebody for a pen, thank them, and respond to their thanks.',model:'Haben Sie bitte einen Stift für mich? – Ja, hier bitte. – Danke schön! – Gern geschehen.',tips:['Use a polite request.','Practise a friendly closing.']}
 ]
}
];
window.DEUTSCH_A1_MOCK_SETS=sets;
})();