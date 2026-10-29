/* Original bilingual A1 thematic vocabulary expansion, independent of licensed Goethe word lists.
   Format: [German with article, English, Nepali, German plural or '—' for mass/plural-only]. */
(() => {
'use strict';
const packs=[
 {id:'transport',title:'🚉 Travel and transport',items:[
 ['der Bahnhof','train station','रेल स्टेसन','die Bahnhöfe'],
 ['die Haltestelle','stop / bus stop','बस बिसौनी','die Haltestellen'],
 ['der Fahrplan','timetable','समयतालिका','die Fahrpläne'],
 ['die Fahrkarte','ticket','यात्रा टिकट','die Fahrkarten'],
 ['die Verspätung','delay','ढिलाइ','die Verspätungen'],
 ['die Abfahrt','departure','प्रस्थान','die Abfahrten'],
 ['die Ankunft','arrival','आगमन','die Ankünfte'],
 ['das Gleis','railway platform track','रेलको प्लेटफर्म नम्बर','die Gleise'],
 ['der Eingang','entrance','प्रवेशद्वार','die Eingänge'],
 ['der Ausgang','exit','निकास','die Ausgänge']
 ]},
 {id:'food',title:'🥨 Food and groceries',items:[
 ['die Kartoffel','potato','आलु','die Kartoffeln'],
 ['die Tomate','tomato','गोलभेँडा','die Tomaten'],
 ['die Gurke','cucumber','काँक्रो','die Gurken'],
 ['die Banane','banana','केरा','die Bananen'],
 ['das Brötchen','bread roll','सानो पाउरोटी','die Brötchen'],
 ['das Ei','egg','अण्डा','die Eier'],
 ['der Käse','cheese','चिज','—'],
 ['die Milch','milk','दूध','—'],
 ['das Getränk','beverage','पेय पदार्थ','die Getränke'],
 ['die Flasche','bottle','बोतल','die Flaschen']
 ]},
 {id:'home',title:'🏡 At home',items:[
 ['die Küche','kitchen','भान्साकोठा','die Küchen'],
 ['das Badezimmer','bathroom','स्नानघर','die Badezimmer'],
 ['die Treppe','stairs / staircase','सिँढी','die Treppen'],
 ['die Tür','door','ढोका','die Türen'],
 ['das Fenster','window','झ्याल','die Fenster'],
 ['der Schrank','wardrobe / cupboard','दराज','die Schränke'],
 ['der Stuhl','chair','कुर्सी','die Stühle'],
 ['das Bett','bed','ओछ्यान','die Betten'],
 ['der Schlüssel','key','साँचो','die Schlüssel'],
 ['die Miete','rent','भाडा','die Mieten']
 ]},
 {id:'jobs',title:'💼 Work and professions',items:[
 ['der Lehrer','male teacher','शिक्षक','die Lehrer'],
 ['die Lehrerin','female teacher','शिक्षिका','die Lehrerinnen'],
 ['der Arzt','male doctor','डाक्टर (पुरुष)','die Ärzte'],
 ['die Ärztin','female doctor','डाक्टर (महिला)','die Ärztinnen'],
 ['der Verkäufer','male salesperson','बिक्रेता (पुरुष)','die Verkäufer'],
 ['die Verkäuferin','female salesperson','बिक्रेता (महिला)','die Verkäuferinnen'],
 ['der Beruf','profession / occupation','पेशा','die Berufe'],
 ['die Arbeit','work / job','काम','die Arbeiten'],
 ['die Pause','break','विश्राम','die Pausen'],
 ['das Büro','office','कार्यालय','die Büros']
 ]},
 {id:'health',title:'🩺 Health and pharmacy',items:[
 ['der Bauch','belly / stomach area','पेट','die Bäuche'],
 ['der Hals','throat / neck','घाँटी','die Hälse'],
 ['das Fieber','fever','ज्वरो','—'],
 ['der Husten','cough','खोकी','—'],
 ['die Apotheke','pharmacy','औषधि पसल','die Apotheken'],
 ['das Medikament','medicine','औषधि','die Medikamente'],
 ['die Tablette','tablet / pill','चक्की औषधि','die Tabletten'],
 ['das Rezept','prescription / recipe','औषधिको पुर्जी / रेसिपी','die Rezepte'],
 ['der Schmerz','pain','दुखाइ','die Schmerzen'],
 ['der Termin','appointment','अपोइन्टमेन्ट','die Termine']
 ]},
 {id:'social',title:'👥 People and occasions',items:[
 ['die Eltern','parents','आमाबुबा','—'],
 ['das Kind','child','बच्चा','die Kinder'],
 ['der Freund','male friend','साथी (पुरुष)','die Freunde'],
 ['die Freundin','female friend','साथी (महिला)','die Freundinnen'],
 ['der Nachbar','male neighbor','छिमेकी (पुरुष)','die Nachbarn'],
 ['die Nachbarin','female neighbor','छिमेकी (महिला)','die Nachbarinnen'],
 ['der Gast','guest','पाहुना','die Gäste'],
 ['die Einladung','invitation','निमन्त्रणा','die Einladungen'],
 ['das Geschenk','gift','उपहार','die Geschenke'],
 ['der Geburtstag','birthday','जन्मदिन','die Geburtstage']
 ]},
 {id:'communication',title:'✉️ Messages and language',items:[
 ['die E-Mail','email','इमेल','die E-Mails'],
 ['der Brief','letter','चिठी','die Briefe'],
 ['die Nachricht','message / news item','सन्देश / समाचार','die Nachrichten'],
 ['die Adresse','address','ठेगाना','die Adressen'],
 ['die Nummer','number','नम्बर','die Nummern'],
 ['das Handy','mobile phone','मोबाइल फोन','die Handys'],
 ['die Frage','question','प्रश्न','die Fragen'],
 ['die Antwort','answer','उत्तर','die Antworten'],
 ['das Wort','word','शब्द','die Wörter'],
 ['der Satz','sentence','वाक्य','die Sätze']
 ]},
 {id:'shopping',title:'🛍️ Shopping and money',items:[
 ['der Preis','price','मूल्य','die Preise'],
 ['der Rabatt','discount','छुट','die Rabatte'],
 ['die Kasse','checkout / cash register','पैसा तिर्ने काउन्टर','die Kassen'],
 ['die Rechnung','bill / invoice','बिल','die Rechnungen'],
 ['das Geld','money','पैसा','—'],
 ['die Größe','size','साइज','die Größen'],
 ['der Markt','market','बजार','die Märkte'],
 ['das Geschäft','shop / business','पसल / व्यवसाय','die Geschäfte'],
 ['der Supermarkt','supermarket','सुपरमार्केट','die Supermärkte'],
 ['die Tüte','bag / small paper bag','झोला / कागजी झोला','die Tüten']
 ]},
 {id:'weather',title:'🌦️ Weather and seasons',items:[
 ['die Sonne','sun','सूर्य','—'],
 ['die Wolke','cloud','बादल','die Wolken'],
 ['der Regen','rain','वर्षा','—'],
 ['der Schnee','snow','हिउँ','—'],
 ['der Wind','wind','हावा','die Winde'],
 ['das Wetter','weather','मौसम','—'],
 ['der Sommer','summer','गर्मी याम','die Sommer'],
 ['der Winter','winter','जाडो याम','die Winter'],
 ['der Frühling','spring season','वसन्त ऋतु','die Frühlinge'],
 ['der Herbst','autumn','शरद ऋतु','die Herbste']
 ]},
 {id:'school',title:'📚 School and courses',items:[
 ['die Schule','school','विद्यालय','die Schulen'],
 ['der Kurs','course','पाठ्यक्रम / कक्षा','die Kurse'],
 ['die Prüfung','examination','परीक्षा','die Prüfungen'],
 ['die Aufgabe','task / exercise','काम / अभ्यास','die Aufgaben'],
 ['das Heft','exercise notebook','कापी','die Hefte'],
 ['das Buch','book','किताब','die Bücher'],
 ['der Stift','pen / writing implement','कलम','die Stifte'],
 ['das Wörterbuch','dictionary','शब्दकोश','die Wörterbücher'],
 ['die Hausaufgabe','homework assignment','गृहकार्य','die Hausaufgaben'],
 ['das Beispiel','example','उदाहरण','die Beispiele']
 ]}
];
window.DEUTSCH_A1_THEME_PACKS=packs;
})();