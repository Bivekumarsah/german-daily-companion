/* Internal auditor helper. Exports our OWN German entry strings, not Goethe material. */
import fs from 'node:fs';
import vm from 'node:vm';
const get=(f)=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const context={window:{}};
vm.createContext(context);
for(const f of ['a1-course-data.js','a1-themes-data.js','a1-essentials-data.js'])
  vm.runInContext(get(f),context,{filename:f});
const all=[];
for(const unit of context.window.DEUTSCH_A1.units)
  for(const entry of unit.vocab)
    all.push({de:entry.de,en:entry.en,ne:entry.ne,bank:'unit:'+unit.id});
for(const pack of context.window.DEUTSCH_A1_THEME_PACKS)
  for(const entry of pack.items)
    all.push({de:entry[0],en:entry[1],ne:entry[2],plural:entry[3],bank:'theme:'+pack.id});
for(const pack of context.window.DEUTSCH_A1_ESSENTIALS)
  for(const entry of pack.items)
    all.push({de:entry[0],en:entry[1],ne:entry[2],example:entry[3],bank:'essential:'+pack.id});
if(all.length!==528)throw Error('Unexpected local vocabulary size '+all.length);
console.log(JSON.stringify(all));
