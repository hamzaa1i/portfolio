import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const root=path.resolve('dist/client');
const results=[];
const screenshots=process.env.QA_SCREENSHOT_DIR || path.join(os.tmpdir(),'portfolio-qa');
fs.mkdirSync(screenshots,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.pdf':'application/pdf','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.woff2':'font/woff2','.woff':'font/woff'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.statusCode=404;file=path.join(root,'404.html');}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  if(file.endsWith('Hamza_Ali_Resume.pdf'))res.setHeader('Content-Disposition','inline; filename="Hamza_Ali_Resume.pdf"');
  res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-gpu']}:{})});
const errors=[];
const consoleErrors=[];
const failedRequests=[];
function observe(page) { page.on('requestfailed',request=>failedRequests.push({url:request.url(),error:request.failure()?.errorText})); page.on('console',message=>{ if(message.type()==='error') consoleErrors.push({url:page.url(),message:message.text()}); }); }
let assertions=0;
function check(value,message){assert.ok(value,message);assertions++;}
async function ready(page,url='/') {
  const response=await page.goto(origin+url,{waitUntil:'domcontentloaded'});
  await page.locator('#preloader').waitFor({state:'hidden',timeout:20000});
  await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('#music-player')).opacity)>=0.99);
  await page.evaluate(()=>document.fonts.ready);
  return response;
}
async function overflow(page,label) {
  const metrics=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
  check(metrics.scroll<=metrics.viewport+1,`${label}: horizontal overflow ${JSON.stringify(metrics)}`);
}
const source=fs.readFileSync('src/components/MusicPlayer.astro','utf8');
const tracks=[...source.matchAll(/\{ name: '([^']+)', genre: '([^']+)'/g)].map(match=>({name:match[1],genre:match[2]}));
const categories=['All',...new Set(tracks.map(track=>track.genre))];
check(tracks.length>0,'Track dataset parsed');
const routes=fs.readdirSync(root,{recursive:true}).filter(file=>file.endsWith('.html')).map(file=>file==='index.html'?'/':file.endsWith('/index.html')?'/'+file.slice(0,-10):'/'+file);
try {
  for(const viewport of (process.env.QA_FOCUSED ? [] : [{width:320,height:568},{width:390,height:844},{width:768,height:1024},{width:1366,height:900},{width:1920,height:1080}])) {
    const context=await browser.newContext({viewport});
    await context.addInitScript(()=>{localStorage.setItem('music-track','0');localStorage.setItem('music-playing','1');localStorage.setItem('music-ever-played','1');});
    const page=await context.newPage();observe(page);page.on('pageerror',error=>errors.push({viewport,url:page.url(),message:error.message}));
    await ready(page);await overflow(page,`homepage ${viewport.width}`);
    check(await page.locator('#work .project-card').count()===5,'Five flagship cards');
    check(await page.locator('#story .stat-card').count()===0,'Numerical cards removed');
    check(await page.locator('#story .story-accent').count()===4,'Four About highlights');
    check(!(await page.locator('#music-player').getAttribute('class')).includes('playing'),'No autoplay from saved preferences');
    check(await page.locator('#work a[href="/work"]').isVisible(),'Project catalogue link visible');
    if(viewport.width<1024) {
      await page.getByRole('button',{name:'Toggle menu',exact:true}).click();
      check(await page.locator('#mobile-menu').getAttribute('aria-hidden')==='false','Mobile menu opens');
      await page.locator('#mobile-menu a[href="/resume"]').click();
    } else await page.locator('.header-nav a[href="/resume"]').click();
    await page.waitForURL(origin+'/resume');
    check(await page.getByRole('heading',{name:'Hamza Ali',exact:true}).isVisible(),'Resume reachable');
    await overflow(page,`resume ${viewport.width}`);
    const downloadPromise=page.waitForEvent('download');
    await page.getByRole('link',{name:'Download Hamza Ali’s résumé as PDF'}).click();
    const download=await downloadPromise;
    check(download.suggestedFilename()==='Hamza_Ali_Resume.pdf','PDF filename');
    const bytes=fs.readFileSync(await download.path());
    check(bytes.length>10000 && bytes.subarray(0,5).toString()==='%PDF-','Valid nonempty downloaded PDF');
    const pdf=await PDFDocument.load(bytes);check(pdf.getPageCount()===1,'One-page PDF');
    await page.screenshot({path:path.join(screenshots,`resume-${viewport.width}.png`),fullPage:true});
    await ready(page);
    await page.locator('#mp-expand').click();await page.locator('#mp-list-toggle').click();
    check(await page.locator('#mp-genre-tabs button').count()===categories.length,'All music categories reachable');
    for(const genre of categories) {
      const button=page.getByRole('button',{name:genre+' music',exact:true});
      await button.click();
      check(await button.getAttribute('aria-pressed')==='true',`${genre} selected`);
      check(await button.evaluate(el=>document.activeElement===el),`${genre} focus preserved`);
      const expected=tracks.filter(track=>genre==='All'||track.genre===genre).length;
      check(await page.locator('#mp-list-items button').count()===expected,`${genre} filter count`);
      check(Number(await page.locator('#mp-list-count').innerText())===expected,`${genre} announced count`);
      check(await button.evaluate(el=>parseFloat(getComputedStyle(el).paddingLeft)>=8&&el.getBoundingClientRect().width>25),`${genre} chip separation`);
    }
    await page.getByRole('button',{name:'Ambient music',exact:true}).click();
    await page.getByRole('textbox',{name:'Search music tracks'}).fill('Ambient Drift');
    check(await page.locator('#mp-list-items button').count()===1,'Search matches active genre');
    await page.getByRole('button',{name:'Focus music',exact:true}).click();
    check(await page.getByRole('textbox',{name:'Search music tracks'}).inputValue()==='Ambient Drift','Search text preserved');
    check(await page.locator('#mp-list-items button').count()===0,'Search intersects new genre');
    await page.getByRole('textbox',{name:'Search music tracks'}).fill('');
    await page.getByRole('button',{name:'All music',exact:true}).press('End');
    check(await page.getByRole('button',{name:'Minimal music',exact:true}).getAttribute('aria-pressed')==='true','End key selects last category');
    await page.getByRole('button',{name:'Minimal music',exact:true}).press('Home');
    check(await page.getByRole('button',{name:'All music',exact:true}).getAttribute('aria-pressed')==='true','Home key selects first category');
    const panel=await page.locator('#music-panel').boundingBox();
    check(panel.x>=0&&panel.x+panel.width<=viewport.width+1&&panel.y>=0,'Music panel contained');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('#music-panel')).opacity==='1');
    await page.screenshot({path:path.join(screenshots,`music-${viewport.width}.png`)});
    await page.getByRole('textbox',{name:'Search music tracks'}).press('Escape');
    check(await page.locator('#music-panel').evaluate(el=>el.inert),'Collapsed music panel inert');
    check(await page.locator('#mp-expand').evaluate(el=>document.activeElement===el),'Music close returns focus');
    await context.close();results.push({viewport,checks:'passed'});
  }
  const context=await browser.newContext({viewport:{width:1366,height:900}});
  const page=await context.newPage();observe(page);page.on('pageerror',error=>errors.push({url:page.url(),message:error.message}));
  for(const route of (process.env.QA_FOCUSED ? [] : routes)) {
    await ready(page,route);await overflow(page,route);
    check(await page.locator('h1').count()>=1,`${route} heading`);
    const canonical=new URL(await page.locator('link[rel="canonical"]').getAttribute('href'));
    check(canonical.origin==='https://hamzaalikhurram.com' && canonical.pathname.replace(/\/$/,'')===route.replace(/\.html$/,'').replace(/\/$/,''),`${route} canonical`);
    for(const image of await page.locator('img[src]:not([src=""])').all()) {
      if(await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(el=>el.complete ? Promise.resolve() : new Promise(resolve=>el.addEventListener('load',resolve,{once:true})));
        check(await image.evaluate(el=>el.complete&&el.naturalWidth>0),`${route} visible image rendered`);
      }
    }
    if(route.startsWith('/work/')&&route!=='/work/')check(await page.getByRole('link',{name:'back to case studies'}).getAttribute('href')==='/work','Case study back navigation');
  }
  await ready(page);
  check(await page.evaluate(()=>document.fonts.check('400 16px Inter') && document.fonts.check('700 16px "JetBrains Mono"')),'Original fonts loaded');
  await page.keyboard.press('Control+k');
  check(await page.locator('#cmd-palette').getAttribute('aria-hidden')==='false','Command palette opens');
  await page.locator('#cmd-input').fill('resume');
  check((await page.locator('#cmd-list').innerText()).toLowerCase().includes('resume'),'Resume searchable in palette');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Open terminal',exact:true}).click();
  await page.locator('#terminal-input').fill('work');await page.locator('#terminal-input').press('Enter');
  await page.waitForFunction(()=>document.querySelector('#terminal-output').textContent.includes('REVE ONE'));
  check((await page.locator('#terminal-output').innerText()).includes('REVE ONE'),'Terminal catalogue includes REVE ONE');
  await page.locator('#terminal-input').press('Escape');
  await page.keyboard.press('?');
  check(await page.locator('.kbd-overlay').getAttribute('aria-hidden')==='false','Shortcuts opens');
  await page.keyboard.press('Escape');
  await page.locator('#mp-expand').click();await page.locator('#mp-list-toggle').click();
  await page.locator('#mp-list-items button').first().click();
  await page.waitForFunction(()=>document.querySelector('#music-player').classList.contains('playing'));
  check(await page.getByRole('button',{name:'Pause music',exact:true}).isVisible(),'Playback state and accessible label');
  const shuffleBefore=await page.locator('#mp-shuffle').getAttribute('aria-pressed');
  await page.locator('#mp-shuffle').click();check(await page.locator('#mp-shuffle').getAttribute('aria-pressed')!==shuffleBefore,'Shuffle toggles');
  await page.locator('#mp-shuffle').click();check(await page.locator('#mp-shuffle').getAttribute('aria-pressed')===shuffleBefore,'Shuffle restores');
  const previous=await page.locator('#mp-track-name').innerText();await page.locator('#mp-next').click();
  check(await page.locator('#mp-track-name').innerText()!==previous,'Next track changes selection');
  await page.locator('#mp-prev').click();
  await page.waitForFunction(()=>document.querySelector('#music-player').classList.contains('playing'));
  await page.getByRole('button',{name:'Pause music',exact:true}).click();
  check(!(await page.locator('#music-player').getAttribute('class')).includes('playing'),'Pause stops playback');
  await page.locator('#mp-panel-close').click();
  const themeKeys=await page.locator('[data-theme-key]').evaluateAll(elements=>elements.map(el=>el.getAttribute('data-theme-key')));
  for(const key of themeKeys) {
    await page.getByRole('button',{name:'Switch color theme',exact:true}).click();
    await page.locator(`[data-theme-key="${key}"]`).click();
    const contrast=await page.locator('.story-accent').first().evaluate(el=>{
      const parse=value=>value.match(/[\d.]+/g).slice(0,3).map(Number);
      const lum=values=>values.map(value=>{const n=value/255;return n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4;}).reduce((sum,n,i)=>sum+n*[0.2126,0.7152,0.0722][i],0);
      const a=lum(parse(getComputedStyle(el).color));const b=lum(parse(getComputedStyle(document.documentElement).backgroundColor));return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
    });check(contrast>=4.5,`${key} About highlight contrast ${contrast}`);
  }
  await page.getByRole('button',{name:'Switch color theme',exact:true}).click();await page.locator('[data-theme-key="midnight-gold"]').click();
  await ready(page,'/work/aurelia');await page.locator('[data-lightbox]').first().click();
  check(await page.locator('.lightbox-overlay').getAttribute('class').then(value=>value.includes('active')),'Image lightbox opens');
  await page.keyboard.press('Escape');
  await ready(page);
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin});
  await page.locator('#contact a.contact-link[href="mailto:hamzaali.dev@proton.me"]').click();
  await page.waitForFunction(()=>document.querySelector('#copy-toast').classList.contains('visible') && document.querySelector('#copy-toast-text').textContent.toLowerCase().includes('copied'),undefined,{timeout:5000});
  check((await page.locator('#copy-toast-text').textContent()).toLowerCase().includes('copied'),'Copy feedback');

  await page.locator('#copy-toast-text').waitFor({state:'visible',timeout:2000});
  check(await page.locator('#copy-toast-text').isVisible(),'Copy message visible');
  check(await page.evaluate(()=>navigator.clipboard.readText())==='hamzaali.dev@proton.me','Correct copied address');
  const missing=await ready(page,'/missing-release-qa-page');
  check(missing.status()===404,'Missing route returns 404');
  check(await page.locator('meta[name="robots"]').getAttribute('content')==='noindex, nofollow','404 noindex');
  await ready(page);await page.reload({waitUntil:'domcontentloaded'});await page.locator('#preloader').waitFor({state:'hidden'});await overflow(page,'warm reload');
  check(await page.getByRole('button',{name:'send message',exact:true}).isDisabled(),'Contact fails safely without local security config');
  check(await page.getByRole('link',{name:'email directly',exact:true}).getAttribute('href')==='mailto:hamzaali.dev@proton.me','Working contact fallback');
  await context.close();
  const reduced=await browser.newContext({viewport:{width:320,height:320},reducedMotion:'reduce'});
  const reducedPage=await reduced.newPage();await ready(reducedPage);await reducedPage.locator('#mp-expand').click();await reducedPage.locator('#mp-list-toggle').click();
  await reducedPage.evaluate(()=>document.documentElement.style.fontSize='32px');
  await overflow(reducedPage,'short viewport with font scaling');
  const shortPanel=await reducedPage.locator('#music-panel').boundingBox();check(shortPanel.y>=0&&shortPanel.x>=0,'Short viewport panel fits');
  await reducedPage.getByRole('textbox',{name:'Search music tracks'}).fill('Ambient Drift');
  check(await reducedPage.locator('#mp-list-items button').count()===1,'Scaled short viewport search works');
  await reducedPage.locator('#mp-list-items button').first().focus();
  check(await reducedPage.locator('#mp-list-items button').first().evaluate(el=>document.activeElement===el),'Scaled track reachable by keyboard');
  await reducedPage.waitForFunction(()=>getComputedStyle(document.querySelector('#music-panel')).opacity==='1');
  check(await reducedPage.locator('.music-bar').first().evaluate(el=>getComputedStyle(el).animationName==='none'),'Reduced motion suppresses music decoration');
  await reducedPage.screenshot({path:path.join(screenshots,'music-scaled-short.png')});await reduced.close();
  check(failedRequests.length===0,`Failed browser requests: ${JSON.stringify(failedRequests)}`);
  check(consoleErrors.filter(entry=>!entry.message.includes('Failed to load resource')).length===0,`Unexpected console errors: ${JSON.stringify(consoleErrors)}`);
  check(errors.length===0,`Browser JavaScript errors: ${JSON.stringify(errors)}`);
  console.log(JSON.stringify({browser:browser.version(),assertions,viewports:results,routes:process.env.QA_FOCUSED ? 0 : routes.length,consolePageErrors:errors,consoleErrors,failedRequests,limitations:['Static production build; provider calls and deployed contact delivery are separately gated.','PDF download and integrity tested; PDF visual inspection uses Poppler.','Audio engine state tested; audible output not assessed.']},null,2));
} finally {await browser.close();server.close();}
