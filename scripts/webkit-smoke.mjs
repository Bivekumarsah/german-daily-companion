/* Desktop-WebKit Safari-engine emulation with a 375px mobile viewport.
   THIS IS NOT PHYSICAL IPHONE / IOS SAFARI QA. */
import assert from 'node:assert/strict';
import {webkit} from 'playwright';
const host=process.env.DEUTSCH_BROWSER_URL||'http://127.0.0.1:8765/';
const browser=await webkit.launch({headless:true});
try{
 for(const width of [375,768]){
  const ctx=await browser.newContext({viewport:{width,height:812},deviceScaleFactor:2,isMobile:true,
    hasTouch:true,reducedMotion:'reduce'});
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(host+'#/exam',{waitUntil:'domcontentloaded'});
  await page.locator('#a1MockRoot .a1-mock-question').waitFor({timeout:15000});
  const german=page.locator('#a1MockRoot .a1-mock-language-choice').nth(1);
  await german.click();
  assert.match(await page.locator('#a1MockRoot .a1-mock-question').innerText(),/Wann beginnt die Sprechstunde/);
  await page.locator('#a1MockRoot .a1-mock-skills button').nth(3).click();
  const rec=page.locator('#a1MockRoot .productive-recorder');
  await rec.waitFor({timeout:10000});
  assert.match(await rec.innerText(),/Nothing is uploaded or saved/);
  const size=await rec.locator('button').first().evaluate(el=>el.getBoundingClientRect().height);
  assert(size>=44,'Safari-engine speaking control <44px');
  await page.goto(host+'#/dashboard',{waitUntil:'domcontentloaded'});
  const daily=page.locator('#dailyJourneyRoot');
  await daily.locator('.dj-primary').first().click();
  assert.match(await daily.innerText(),/Discover useful words/);
  assert.equal(await daily.locator('.dj-word').count(),4);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'Guided lessons must not overflow WebKit');
  await page.goto(host+'#/vocabulary',{waitUntil:'domcontentloaded'});
  const cards=page.locator('#a1ThemesRoot .a1-theme-card');
  await cards.first().waitFor({timeout:10000});
  await page.locator('#a1ThemesRoot .a1-theme-tab').filter({hasText:'People and occasions'}).click();
  const parent=page.locator('#a1ThemesRoot .a1-theme-card').filter({hasText:'die Eltern'});
  assert.match(await parent.innerText(),/Plural-only word/);
  assert.match(await parent.innerText(),/ein Elternteil/);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
  assert.equal(overflow,false,'Safari-engine layout must have no horizontal document overflow at '+width);
  assert.deepEqual(errors,[],'No WebKit page exceptions at '+width);
  console.log('WebKit '+width+'px: German exam, speaking touch control and noun editorial notes pass.');
  await ctx.close();
 }
}finally{await browser.close()}
console.log('Safari-engine WebKit emulation passed; real iPhone Safari must still be manually tested.');
