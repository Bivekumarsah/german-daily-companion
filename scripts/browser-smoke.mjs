/* Chromium viewport and keyboard checks. This is browser emulation, not real Android/iOS testing.
   Run locally after: npm install --no-save playwright@1.64.1
   npx playwright install chromium; python3 -m http.server 8765
   node scripts/browser-smoke.mjs */
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import axe from 'axe-core';
const host=process.env.DEUTSCH_BROWSER_URL||'http://127.0.0.1:8765/';
const browser=await chromium.launch({headless:true});
let checked=0;
try{
 for(const viewport of [{width:320,height:700},{width:390,height:844},{width:1280,height:800}]){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(host+'#/exam',{waitUntil:'domcontentloaded'});
  await page.locator('#a1MockRoot .a1-mock-question').waitFor({timeout:15000});
  const lang=page.locator('#a1MockRoot .a1-mock-language-choice');
  assert.equal(await lang.count(),2,'Two practice language modes');
  assert.match(await page.locator('#a1MockRoot .a1-mock-question').innerText(),/When does the consultation begin/);
  await lang.nth(1).focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('#a1MockRoot .a1-mock-question').innerText(),/Wann beginnt die Sprechstunde/);
  assert.equal(await lang.nth(1).getAttribute('aria-pressed'),'true');
  const doc=await page.locator('#a1MockRoot .a1-mock-content').innerText();
  assert(!doc.includes('Guten Tag! Die Sprechstunde beginnt'),'Audio transcript concealed during German attempt');
  await page.locator('#a1MockRoot .a1-mock-options .a1-mock-choice').nth(1).click();
  const next=page.locator('#a1MockRoot .a1-mock-navigation .a1-mock-primary');
  await next.click();
  assert.match(await page.locator('#a1MockRoot .a1-mock-question').innerText(),/Wann kommt die Person nach Köln/);
  const sizes=await page.locator('#a1MockRoot .a1-mock-language-choice').evaluateAll(els=>els.map(el=>{
   const r=el.getBoundingClientRect();return {height:r.height,width:r.width,overflow:r.right>window.innerWidth+1};
  }));
  for(const size of sizes){
   assert(size.height>=44,'Touch button smaller than 44px at '+viewport.width);
   assert(size.width>=100,'Mode control must remain readable');
   assert(!size.overflow,'Language mode horizontally clipped');
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  assert.equal(overflow,false,'Page should not scroll horizontally at '+viewport.width);
  assert.deepEqual(errors,[],'No JS exceptions after route, keyboard switching and mock answers');
  await page.addScriptTag({content:axe.source});
  const examAccessibility=await page.evaluate(async()=>window.axe.run(document.querySelector('#a1MockRoot'),{
   runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}
  }));
  const severeExam=examAccessibility.violations.filter(v=>['critical','serious'].includes(v.impact));
  assert.deepEqual(severeExam.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(' ')).join(', ')),[],
   'No serious or critical WCAG violations in active exam mock');
  await page.locator('#a1MockRoot .a1-mock-skills button').nth(3).click();
  const speaking=page.locator('#a1MockRoot .productive-speaking');
  await speaking.waitFor({timeout:10000});
  const recorder=speaking.locator('.productive-recorder');
  await recorder.waitFor({timeout:10000});
  assert.match(await recorder.innerText(),/Nothing is uploaded or saved/,'Privacy promise is visible');
  const start=recorder.locator('button').first();
  const micSize=await start.evaluate(el=>el.getBoundingClientRect().height);
  assert(micSize>=44,'Recording start button has usable touch geometry');
  const speakingAccessibility=await page.evaluate(async()=>window.axe.run(document.querySelector('#a1MockRoot .productive-speaking'),{
   runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}
  }));
  const severeSpeaking=speakingAccessibility.violations.filter(v=>['critical','serious'].includes(v.impact));
  assert.deepEqual(severeSpeaking.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(' ')).join(', ')),[],
   'No serious or critical WCAG violations in local speaking controls');
  await page.goto(host+'#/vocabulary',{waitUntil:'domcontentloaded'});
  await page.locator('#a1EssentialsStudio > summary').click();
  await page.locator('#a1EssentialsRoot .a1-bridge-card').first().waitFor({timeout:10000});
  assert.deepEqual(errors,[],'Vocabulary view must remain functional');
  await page.goto(host+'#/course/a1-03',{waitUntil:'domcontentloaded'});
  await page.locator('#a1SkillProgress button').filter({hasText:'Writing'}).click();
  const editor=page.locator('#a1TabContent textarea');
  await editor.waitFor({timeout:10000});
  await editor.fill('Ich habe 20 Jahre alt.');
  const hints=page.locator('#a1TabContent .productive-language-hints');
  assert.match(await hints.innerText(),/Ich bin 20 Jahre alt/,'Local feedback shows a safe, concrete example');
  await editor.fill('Ich bin 20 Jahre alt.');
  assert.match(await hints.innerText(),/No supported common patterns detected/,'Correct age example not flagged');
  const saveButtons=page.locator('#a1TabContent .productive-actions .productive-btn');
  assert(await saveButtons.count()>=2,'Save and delete controls remain available');
  const hintBounds=await hints.boundingBox();
  assert(hintBounds?.width>200,'Bilingual hints should fit mobile screen width');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2),false,'No page overflow in writing lesson');
  await page.addScriptTag({content:axe.source});
  const writingAccessibility=await page.evaluate(async()=>window.axe.run(document.querySelector('#a1TabContent .productive-writing'),{
   runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}
  }));
  const severeWriting=writingAccessibility.violations.filter(v=>['critical','serious'].includes(v.impact));
  assert.deepEqual(severeWriting.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(' ')).join(', ')),[],
   'No serious or critical WCAG violations in bilingual writing coach');
  assert.deepEqual(errors,[],'Writing lesson must not throw browser exceptions');
  console.log('Viewport '+viewport.width+'×'+viewport.height+': exam language, keyboard, touch geometry and vocabulary route passed.');
  checked++;
  await context.close();
 }
}finally{await browser.close()}
assert.equal(checked,3);
console.log('3 Chromium desktop/mobile-emulation UI smoke checks passed. Physical Android/iPhone QA is still necessary.');
