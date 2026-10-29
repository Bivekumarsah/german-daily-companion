/* Reproducible, NON-EXHAUSTIVE spot-check from printed pages 9–26 of the Goethe Start Deutsch 1 word list.
   Short lexeme labels only (no copyrighted example sentences, no replication of full official wordlist).
   Reference: https://www.goethe.de/pro/relaunch/prf/en/A1_SD1_Wortliste_02.pdf
   These 176 checkpoints are a deliberately selected sample, not a random sample or full concordance.
   Run: node audit-a1.mjs   (read-only, zero dependencies)
*/
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=f=>fs.readFileSync(new URL(f,import.meta.url),'utf8');
const sandbox={window:{}};vm.createContext(sandbox);
for(const file of ['a1-course-data.js','a1-themes-data.js','a1-essentials-data.js'])
 vm.runInContext(read(file),sandbox,{filename:file});
const basic=sandbox.window.DEUTSCH_A1.units.flatMap(u=>u.vocab.map(w=>({de:w.de,en:w.en,ne:w.ne,bank:'unit:'+u.id})));
const nouns=sandbox.window.DEUTSCH_A1_THEME_PACKS.flatMap(p=>p.items.map(w=>({de:w[0],en:w[1],ne:w[2],bank:'noun:'+p.id,plural:w[3]})));
const essentials=sandbox.window.DEUTSCH_A1_ESSENTIALS.flatMap(p=>p.items.map(w=>({de:w[0],en:w[1],ne:w[2],example:w[3],bank:'essential:'+p.id})));
const all=[...basic,...nouns,...essentials];
const norm=s=>String(s).trim().normalize('NFC').toLocaleLowerCase('de-DE').replace(/\s+/g,' ');
const normalizeHeadword=s=>norm(s).replace(/^\(sich\) /,'sich ').replace(/^sich /,'');
const actual=new Map();
for(const word of all){
 assert(word.de&&word.en&&word.ne,'Missing German/English/Nepali for '+word.bank);
 if(word.example)assert(word.example.trim().length>=8,'Example must contain a useful sentence for '+word.de);
 const key=norm(word.de);
 if(!actual.has(key))actual.set(key,[]);
 actual.get(key).push(word.bank);
}
// The official list uses dictionary infinitives (e.g. "anmelden") where our cards may say "sich anmelden".
// Normalized/derived matches are editorial indicators, NEVER automatic official coverage certification.
const exact=new Set(actual.keys());
const byLemma=new Map();
for(const key of exact){
 const lemma=normalizeHeadword(key).replace(/^(der|die|das) /,'');
 if(!byLemma.has(lemma))byLemma.set(lemma,[]);
 byLemma.get(lemma).push(key);
}
const referenceCheckpoints=[[9,"ab;aber;abfahren;abgeben;abholen;der Absender;die Adresse;allein;alt;anbieten;anfangen;ankommen;ankreuzen;anmachen;anrufen"],[10,"die Ansage;die Antwort;die Anzeige;der Apfel;arbeiten;arbeitslos;der Arm;der Arzt;die Aufgabe;aufhören;aufstehen;der Aufzug;das Auge;ausfüllen;ausmachen"],[12,"die Birne;bleiben;der Bleistift;die Blume;brauchen;der Brief;die Briefmarke;bringen;das Brot;das Buch;der Bus;die Butter"],[13,"danken;dann;das Datum;dauern;dich;dir;das Dorf;draußen;der Drucker;die Durchsage;dürfen"],[15,"die Flasche;der Flughafen;das Formular;das Foto;fragen;die Frau;frei;die Freizeit;frühstücken;geben;gehen"],[17,"heißen;helfen;heute;hier;hören;das Hotel;der Hund;ich;immer;in"],[18,"die Jacke;die Kartoffel;die Kasse;kaufen;kennen;das Kind;das Kino;kochen;kommen;können;das Konto;kosten;krank"],[19,"der Kurs;langsam;leben;ledig;der Lehrer;lernen;lesen;das Licht;links"],[20,"machen;man;mehr;die Miete;die Milch;mit;möchten;mögen;müde;müssen;nehmen;nicht;noch"],[21,"das Obst;öffnen;oft;ohne;das Öl;die Oma;der Opa;die Post;die Polizei;der Preis;die Prüfung;pünktlich"],[22,"rauchen;die Rechnung;rechts;reparieren;das Restaurant;die Rezeption;richtig;sagen;schlafen;schließen"],[23,"der Schuh;die Schule;schwimmen;sehen;sehr;sein;sofort;der Sohn;sollen;spielen;sprechen;die Sonne"],[24,"der Tisch;die Tomate;die Treppe;trinken;tun;über;unterschreiben;der Vater;verkaufen;verstehen"],[25,"verheiratet;vielleicht;vor;der Vorname;wann;warten;warum;was;das Wasser;weiblich"],[26,"werden;wichtig;wie;wiederholen;willkommen;wir;wissen;wo;wohnen;wollen;zahlen;die Zeit;zwischen"]];
const matches=[],gaps=[],review=[];
for(const [page,labels] of referenceCheckpoints){
 for(const sourceTerm of labels.split(';')){
  const label=norm(sourceTerm);
  if(exact.has(label)){matches.push({page,term:sourceTerm,status:'exact'});continue;}
  const lemma=normalizeHeadword(label).replace(/^(der|die|das) /,'');
  const nearby=byLemma.get(lemma)||[];
  if(nearby.length)review.push({page,term:sourceTerm,actual:nearby,status:'variant-review'});
  else gaps.push({page,term:sourceTerm,status:'missing-in-banks'});
 }
}
const checkpointCount=matches.length+gaps.length+review.length;
assert.equal(checkpointCount,176,'Every selected source checkpoint must have exactly one audit status');
const duplicateStrings=[...actual].filter(([,banks])=>banks.length>1).map(([de,banks])=>({de,banks}));
const report={source:'Goethe-Zertifikat A1 Start Deutsch 1 Wortliste, printed pages 9–26',
 scope:'Selected, nonrandom verification checkpoints only; NOT an audit of all ~650 Goethe entries',
 banks:{unitEntries:basic.length,uniqueUnitStrings:new Set(basic.map(w=>norm(w.de))).size,nounEntries:nouns.length,essentialEntries:essentials.length,uniqueGermanStrings:actual.size},
 checkpoints:{sample:checkpointCount,exact:matches.length,variantReview:review.length,missing:gaps.length},
 variantReview:review,missingCheckpoints:gaps,duplicateStrings,
 limitations:[
  'The official list is approximately 650 entries; these checkpoints do not prove full coverage.',
  'This analysis compares lexical strings, not all senses, article/plural accuracy or active use.',
  'No writing, speaking, pronunciation or device-specific validation is inferred.',
  'Goethe official example sentences and the full official list are not copied into this repository.'
 ]
};
console.log('A1 audit: '+basic.length+' lesson tokens, '+nouns.length+' noun entries, '+essentials.length+' essentials; '+actual.size+' distinct case-folded strings.');
console.log('Selected Goethe sample: '+checkpointCount+' checkpoints, '+matches.length+' exact, '+review.length+' variant review, '+gaps.length+' absent from the banks.');
console.log('Selected missing words:',gaps.map(g=>g.term).join(', ')||'none');
console.log('Manual review variants:',JSON.stringify(review));
if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
if(process.argv.includes('--strict') && (gaps.length>0||review.length>0))process.exitCode=2;
export {report};
