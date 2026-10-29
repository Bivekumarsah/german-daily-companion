/* Original German-only task-language companion for DeutschDaily A1 practice mocks.
   All sentences were authored for DeutschDaily; no Goethe exam questions or audio copied.
   Item order and answer indices correspond to the English-guided a1-mock-data.js. */
(() => {
'use strict';
const Q=(question,a,b,c)=>[question,[a,b,c]];
const sets={
 'a1-mock-1':{
  listening:[
   Q('Wann beginnt die Sprechstunde?','Um acht Uhr','Um neun Uhr','Um zehn Uhr'),
   Q('Wann kommt die Person nach Köln?','Am Donnerstag','Am Samstag','Am Freitag'),
   Q('Wie viele Fahrkarten braucht der Kunde?','Eine','Zwei','Drei'),
   Q('Was kostet der Kaffee?','Drei Euro','Zwei Euro','Fünf Euro'),
   Q('Von welchem Gleis fährt der Zug nach Hamburg?','Von Gleis vier','Von Gleis sechs','Von Gleis fünf'),
   Q('Wie beginnt die Telefonnummer?','0176','0167','0716'),
   Q('Wann öffnet die Bibliothek am Montag?','Um neun Uhr','Um zehn Uhr','Um elf Uhr'),
   Q('Warum kann die Person nicht zum Kurs kommen?','Sie muss arbeiten','Sie ist auf Reisen','Sie ist krank'),
   Q('Um wie viel Uhr treffen sie sich?','Um halb sieben','Um halb acht','Um Viertel nach sechs'),
   Q('Wie kommt man zur Post?','Rechts und dann geradeaus','Geradeaus und dann links','Geradeaus und dann rechts'),
   Q('Welches Zimmer ist noch frei?','Ein Doppelzimmer','Ein Familienzimmer','Ein Einzelzimmer'),
   Q('Was möchte der Gast trinken?','Wasser ohne Kohlensäure','Saft','Wasser mit Kohlensäure'),
   Q('An welchem Tag ist die Praxis geschlossen?','Am Donnerstag','Am Mittwoch','Am Dienstag'),
   Q('Wie heißt die nächste Haltestelle?','Bahnhof','Schule','Rathaus'),
   Q('Wie wird das Wetter morgen?','Es regnet','Die Sonne scheint','Es schneit')
  ],
  reading:[
   Q('Ist das Büro am Samstag geöffnet?','Nein','Ja','Nur am Vormittag'),
   Q('Wann soll Nina kommen?','Um 18 Uhr','Um halb sieben','Um halb acht'),
   Q('Wie hoch ist die Miete im Monat?','560 Euro','600 Euro','650 Euro'),
   Q('An welchen Tagen findet der Kurs statt?','Dienstag und Donnerstag','Montag und Mittwoch','Freitag und Samstag'),
   Q('Was gibt es heute nicht?','Tee','Kuchen','Brötchen'),
   Q('Was macht die Person nach der Arbeit?','Sie geht zur Schule','Sie geht schwimmen','Sie geht einkaufen'),
   Q('Was sollen Besucher benutzen?','Die Treppe','Den Fahrstuhl','Die Hintertür'),
   Q('Was muss man zur Anmeldung mitbringen?','Geld und Schlüssel','Pass und Foto','Essen und Wasser'),
   Q('Wann schließt die Bäckerei am Sonntag?','Um sieben Uhr','Um zehn Uhr','Um elf Uhr'),
   Q('Was ist das Problem mit dem Bus?','Er kommt später','Er fährt heute nicht','Die Haltestelle ist geschlossen'),
   Q('An welchem Tag ist der Arzttermin?','Am Dienstag','Am Donnerstag','Am Freitag'),
   Q('Was sucht die Person?','Ein Auto zur Miete','Einen Computer','Ein Fahrrad'),
   Q('Wo darf man rauchen?','Draußen','In diesem Raum','Überall'),
   Q('Wo gibt es das Frühstück?','Im dritten Stock','Im Erdgeschoss','Im Garten'),
   Q('Wann hat Eva Zeit?','Am Montag','Am Mittwoch','Am Dienstag')
  ]
 },
 'a1-mock-2':{
  listening:[
   Q('Wann beginnt der Deutschkurs?','Um halb neun','Um acht Uhr','Um halb zehn'),
   Q('Wie fährt die Person heute?','Mit dem Zug','Mit dem Bus','Mit dem Fahrrad'),
   Q('An welchem Tag soll man das Paket abholen?','Am Mittwoch','Am Donnerstag','Am Freitag'),
   Q('Was trinkt die Person am Nachmittag?','Tee','Kaffee','Wasser'),
   Q('In welchem Stock liegt die Wohnung?','Im zweiten Stock','Im dritten Stock','Im vierten Stock'),
   Q('Wie wird das Wetter am Wochenende?','Heiß','Regnerisch','Kalt'),
   Q('Was ist die Schwester von Beruf?','Lehrerin','Krankenschwester','Ärztin'),
   Q('Wann soll man zurückrufen?','Um Viertel vor elf','Um Viertel nach zehn','Um Viertel nach neun'),
   Q('Wann schließt das Geschäft heute?','Um siebzehn Uhr','Um neunzehn Uhr','Um achtzehn Uhr'),
   Q('Wie viele Tomaten braucht die Person?','Zwei','Eine','Drei'),
   Q('In wie vielen Minuten kommt der Bus?','In zehn Minuten','In zwanzig Minuten','In dreißig Minuten'),
   Q('Wo treffen sich die Personen?','Am Bahnhof','Am Kino','An der Schule'),
   Q('Wo liegt die Brille?','Auf dem Tisch','Unter dem Bett','In der Tasche'),
   Q('Wie alt ist der Sohn?','Zwölf Jahre','Neun Jahre','Neunzehn Jahre'),
   Q('Bei welchem Arzt haben sie einen Termin?','Beim Bankberater','Beim Schularzt','Beim Zahnarzt')
  ],
  reading:[
   Q('Welche Sportart kann man machen?','Schwimmen','Tanzen','Radfahren'),
   Q('Was bringen die Besucher mit?','Blumen','Kuchen','Tee'),
   Q('Wann muss man die Fahrkarte kaufen?','Im Zug','Nach der Fahrt','Vor der Fahrt'),
   Q('Was gibt es im Angebot?','Äpfel','Orangen','Kartoffeln'),
   Q('Wie soll Maja antworten?','Am Telefon','Per E-Mail','Per Post'),
   Q('Ab wann ist die Praxis wieder geöffnet?','Heute','Nächste Woche','Morgen'),
   Q('In welchem Raum ist die Prüfung?','In Raum zwölf','In Raum neun','In Raum einundzwanzig'),
   Q('Wer muss keinen Eintritt bezahlen?','Alle Erwachsenen','Kinder bis sechs Jahre','Alle Studierenden'),
   Q('Was ist im Zimmerpreis dabei?','Abendessen','Parkplatz','Frühstück'),
   Q('Wo ist die Person gerade?','Im Supermarkt','In der Schule','Zu Hause'),
   Q('An welchem Tag ist das Fitnessstudio geschlossen?','Am Sonntag','Am Montag','Am Dienstag'),
   Q('Bis wann ist der Check-out?','Bis zehn Uhr','Bis zwölf Uhr','Bis elf Uhr'),
   Q('Was soll Tim mitbringen?','Sein Buch','Sein Handy','Sein Fahrrad'),
   Q('Was sucht die Anzeige?','Ein Restaurant','Ein Büro','Ein Auto'),
   Q('Wo hält die Straßenbahn heute nicht?','Am Bahnhof','An der Schule','Am Markt')
  ]
 }
};
window.DEUTSCH_A1_EXAM_DE=sets;
})();