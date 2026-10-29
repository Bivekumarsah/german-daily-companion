import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('.', import.meta.url);
const read = file => fs.readFileSync(new URL(file, root), 'utf8');
const mock = {window:{},document:{readyState:'loading',addEventListener(){}},navigator:{onLine:false},localStorage:{getItem(){return null}},console,Date,URL,TextEncoder,Set,Map};
vm.createContext(mock);
for(const file of ['phrases.js','lessons.js','a1-course-data.js','visual-stories.js','listening-lab.js','visual-lab.js','app.js','a1-course.js','academy.js']){
 let content=read(file);
 if(file==='app.js')content=content.replace(/\}\)\(\);\s*$/, 'globalThis.__legacyTest={germanLooksValid,localPhrase};})();');
 vm.runInContext(content,mock,{filename:file});
}
const phrases=mock.window.DAILY_PHRASES;
assert(phrases.length>=70);
const lessons=mock.window.DEUTSCH_LESSONS;
assert.equal(lessons.length,6);
const a1=mock.window.DEUTSCH_A1;
const visual=mock.window.DEUTSCH_VISUAL_LAB;
const visualStories=mock.window.DEUTSCH_VISUAL_STORIES;
assert(visualStories&&Object.keys(visualStories).length===12);
assert(visual&&typeof visual.render==='function','Visual learning feature is loaded');
assert(Object.keys(visual.scenes).length>=12,'Expected eight themed visual learning scenes');
for(const [unitId,scene] of Object.entries(visual.scenes)){
 assert(a1.units.some(u=>u.id===unitId),`Unknown unit for visual scene ${unitId}`);
 assert(scene.title&&scene.items.length===3);
 assert.equal(new Set(scene.items.map(item=>item[1])).size,3,'Visual quiz options must be unique');
 for(const item of scene.items)assert(item.length===6&&item.every(x=>x.length),'Bilingual visual cue must include both phonetic scripts');
}
assert.equal(a1.units.length,36);
assert(a1.units.reduce((sum,u)=>sum+u.vocab.length,0)>=250);
assert.equal(a1.exam.reading.length,12);
assert.equal(a1.exam.listening.length,12);
assert.equal(a1.exam.writing.length,3);
assert.equal(a1.exam.speaking.length,3);
const names=new Set(), ids=new Set();
const answerPositions={reading:new Set(),listening:new Set()};
for(const u of a1.units){
 assert(!ids.has(u.id));ids.add(u.id);
 assert(u.group.length&&u.grammar.en.length>=20&&u.grammar.ne.length&&u.grammar.example&&u.grammar.exampleEn&&u.grammar.exampleNe);
 assert(u.vocab.length>=7);
 for(const v of u.vocab)assert(v.de&&v.en&&v.ne,`Missing vocabulary meaning ${u.id}`);
 for(const part of ['reading','listening']){
  const q=u[part];assert(q.text.length>=20&&q.question.length&&q.choices.length===3);
  assert(q.answer>=0&&q.answer<=2);assert(new Set(q.choices).size===3);answerPositions[part].add(q.answer);
 }
 for(const part of ['writing','speaking'])assert(u[part].prompt.length&&u[part].model.length>=20);
 names.add(u.title);
}
assert.equal(names.size,a1.units.length);
assert.equal(answerPositions.reading.size,3);
assert.equal(answerPositions.listening.size,3);
assert.equal(mock.__legacyTest.localPhrase('What is your name?').german,'Wie heißt du?');
assert.equal(mock.__legacyTest.germanLooksValid('Hello world','Hello world'),false);
assert.equal(mock.__legacyTest.germanLooksValid('hotel','Hotel'),true);
const html=read('index.html');
const referenced=new Set([...read('app.js').matchAll(/\$\('([^']+)'\)/g),...read('a1-course.js').matchAll(/\$\('([^']+)'\)/g),...read('academy.js').matchAll(/getElementById\('([^']+)'\)/g)].map(m=>m[1]));
for(const id of referenced)assert(html.includes('id="'+id+'"'),`Missing DOM element ${id}`);
const allIds=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(allIds.length,new Set(allIds).size,'Duplicate DOM IDs');
for(const filename of ['a1-essentials-data.js','a1-grammar-bridge-data.js','a1-bridge.js','a1-bridge.css','a1-themes-data.js','a1-themes.js','a1-themes.css','a1-mock-data.js','a1-mock.js','a1-mock.css','app.js','lessons.js','phrases.js','a1-course.js','a1-course-data.js','visual-stories.js','listening-lab.js','visual-lab.js','visual-lab.css','sentence-builder.js','sentence-builder.css','pronunciation-data.js','pronunciation-lab.js','pronunciation-lab.css','a1-mock-data.js','a1-mock.js','a1-mock.css','academy.js','sw.js','styles.css','manifest.webmanifest','icon.svg'])assert(fs.existsSync(new URL(filename,root)),`${filename} missing`);
const sw=read('sw.js');for(const file of ['a1-essentials-data.js','a1-grammar-bridge-data.js','a1-bridge.js','a1-bridge.css','a1-themes-data.js','a1-themes.js','a1-themes.css','a1-mock-data.js','a1-mock.js','a1-mock.css','a1-course.js','a1-course-data.js','visual-stories.js','listening-lab.js','visual-lab.js','visual-lab.css','sentence-builder.js','sentence-builder.css','pronunciation-data.js','pronunciation-lab.js','pronunciation-lab.css','a1-mock-data.js','a1-mock.js','a1-mock.css','academy.js'])assert(sw.includes(file),`Offline cache missing ${file}`);
assert(html.includes('https://www.goethe.de/en/spr/prf/ueb/pa1.html'));
assert(html.includes('src="visual-lab.js"')&&html.includes('href="visual-lab.css"'));
assert(html.indexOf('src="visual-stories.js"')<html.indexOf('src="visual-lab.js"'),'Conversation dataset must load before lesson UI');
assert(html.includes('src="listening-lab.js"'));
assert(html.indexOf('src="listening-lab.js"')<html.indexOf('src="visual-lab.js"'),'Listening module must load before visual lesson UI');
assert(html.indexOf('src="visual-lab.js"')<html.indexOf('src="a1-course.js"'),'Visual module loads before course engine');
assert(html.includes('src="sentence-builder.js"')&&html.includes('href="sentence-builder.css"'));
assert(html.indexOf('src="sentence-builder.js"')<html.indexOf('src="a1-course.js"'),'Sentence builder must load before course engine');
assert(html.includes('not an official Goethe course'));
assert(html.includes('id="pronunciationRoot"')&&html.includes('id="pronunciationHeading"'));
assert(html.includes('src="pronunciation-data.js"')&&html.includes('src="pronunciation-lab.js"'));
assert(html.indexOf('src="pronunciation-data.js"')<html.indexOf('src="pronunciation-lab.js"'));
assert(html.includes('href="pronunciation-lab.css"'));
for(const name of ['a1-mock-data.js','a1-mock.js','a1-themes-data.js','a1-themes.js'])assert(html.includes('src="'+name+'"'));
for(const id of ['a1MockRoot','a1ThemesRoot'])assert(html.includes('id="'+id+'"'));
assert(html.indexOf('src="a1-mock-data.js"')<html.indexOf('src="a1-mock.js"'));
assert(html.indexOf('src="a1-themes-data.js"')<html.indexOf('src="a1-themes.js"'));
for(const name of ['a1-essentials-data.js','a1-grammar-bridge-data.js','a1-bridge.js'])assert(html.includes('src="'+name+'"'));
for(const id of ['a1EssentialsRoot','a1GrammarBridgeRoot'])assert(html.includes('id="'+id+'"'));
assert(html.includes('href="a1-bridge.css"'));
assert(html.indexOf('src="a1-essentials-data.js"')<html.indexOf('src="a1-bridge.js"'));
assert(html.indexOf('src="a1-grammar-bridge-data.js"')<html.indexOf('src="a1-bridge.js"'));
assert(html.includes('id="a1MockRoot"')&&html.includes('id="a1MocksHeading"'));
assert(html.includes('src="a1-exam-german-data.js"')&&html.includes('href="a1-exam-german.css"'));
assert(html.indexOf('src="a1-exam-german-data.js"')<html.indexOf('src="a1-mock.js"'));
assert(sw.includes('a1-exam-german-data.js')&&sw.includes('a1-exam-german.css'));
assert(html.includes('src="a1-mock-data.js"')&&html.includes('src="a1-mock.js"')&&html.includes('href="a1-mock.css"'));
for(const f of ['productive-guides.js','productive-coach.js','productive-coach.css'])assert(html.includes(f)&&sw.includes(f),'Missing offline productive skill asset '+f);
assert(html.indexOf('src="productive-coach.js"')<html.indexOf('src="a1-course.js"'));
assert(html.includes('src="writing-hints.js"')&&sw.includes('writing-hints.js'));
assert(html.includes('src="speaking-recorder.js"')&&sw.includes('speaking-recorder.js'));
assert(html.indexOf('src="speaking-recorder.js"')<html.indexOf('src="productive-coach.js"'));
assert(html.indexOf('src="writing-hints.js"')<html.indexOf('src="productive-coach.js"'));
assert(html.includes('Open official Goethe A1 model exams and listening audio'));
assert(html.includes('href="https://www.goethe.de/en/spr/prf/ueb/pa1.html"'));
assert(html.indexOf('src="a1-mock-data.js"')<html.indexOf('src="a1-mock.js"'));
for (const view of ['dashboard','course','vocabulary','exam','translator','practice','resources']) assert(html.includes('data-academy-view=\"'+view+'\"') || html.includes('data-academy-view=\''+view+'\''),'Missing routed view '+view);
for(const id of ['examTimer','examTimerStart','examTimerPause','examTimerReset','academyDashPercent'])assert(html.includes('id=\"'+id+'\"'),'Missing academy widget '+id);
assert(html.includes('href=\"#/course\"'));
for(const id of ['a1Continue','a1ContinueTitle','a1ContinueStatus'])
 assert(html.includes('id=\"'+id+'\"'),'Missing progress-aware continue element '+id);
assert(a1.exam.writing[0].prompt.includes('Form'));
assert(a1.exam.speaking.some(x=>x.prompt.includes('request')));

console.log(`DeutschDaily checks passed: ${a1.units.length} units, ${a1.units.reduce((n,u)=>n+u.vocab.length,0)} vocabulary entries, 4 exam skills, 6 quick drills, 3 answer positions, accessible IDs and offline cache.`);
