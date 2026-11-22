/*
  Проверка регрессий аудита: форма без JS и с JS, согласие на аналитику,
  метки кампании, повторная отправка и адаптивность (360/390/430 px при
  масштабе шрифта 100 и 200 %, без горизонтальной прокрутки).

  Как запускать:
    1. Собрать сайт с тестовыми значениями (в продовую сборку их не подставлять):
         NEXT_PUBLIC_LEAD_ENDPOINT=https://lead.test.invalid/lead \
         NEXT_PUBLIC_YANDEX_METRIKA_ID=111745879 npm run build
    2. Раздать out/ на 127.0.0.1, например: npx serve out -l 4322
    3. node scripts/check-audit-regressions.mjs http://127.0.0.1:4322
       (или npm run check:audit -- http://127.0.0.1:4322)

  Нужен установленный Google Chrome (channel: 'chrome'). Внешние запросы и
  отправка заявок перехватываются, наружу ничего не уходит. Запускается
  только против локального адреса.
*/
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
// Start Next locally with nonempty test NEXT_PUBLIC_LEAD_ENDPOINT and
// NEXT_PUBLIC_YANDEX_METRIKA_ID. External requests and lead POSTs are intercepted.
const base = process.argv[2] || 'http://127.0.0.1:4322';
assert(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname), 'Run only against a local server');
const browser = await chromium.launch({ channel: 'chrome' });
const key = 'primeswim:analytics-consent';
async function context(options={}) {
 const c=await browser.newContext(options);
 c.setDefaultTimeout(10000);
 await c.route('**/*',r=>new URL(r.request().url()).origin===base ? r.continue() : r.fulfill({status:200,contentType:'text/javascript',body:''}));
 return c;
}
try {
 const nojs=await context({javaScriptEnabled:false});const n=await nojs.newPage();await n.goto(base+'/price/');
 assert(await n.locator('form fieldset').evaluate(e=>e.disabled));assert(await n.locator('form button[type=submit]').isDisabled());
 assert.equal(await n.locator('form').getAttribute('method'),'post');assert(await n.locator('form a[href^="tel:"]').isVisible());await nojs.close();console.log('PASS no-JS safe form');
 const c=await context({viewport:{width:390,height:844}});await c.addInitScript(()=>{window.auditCalls=[];window.ym=(...args)=>window.auditCalls.push(args)});const p=await c.newPage();await p.goto(base+'/price/?phone=secret#booking');await p.locator('form input[name=name]').waitFor();await p.waitForFunction(()=>!document.querySelector('fieldset').disabled);
 await p.locator('form button[type=submit]').click();assert(await p.locator('[aria-invalid=true]').count()>0);console.log('PASS JS validation');
 assert.equal(await p.evaluate(()=>window.auditCalls.length),0);
 await p.evaluate(k=>{localStorage.setItem(k,'granted');window.dispatchEvent(new Event('primeswim:analytics-consent-change'))},key);
 await p.waitForFunction(()=>window.auditCalls.some(a=>a[1]==='hit'));
 assert.equal(await p.evaluate(()=>window.auditCalls.filter(a=>a[1]==='hit').length),1);
 await p.locator('a[href="/raspisanie/"]:visible').first().click();await p.waitForURL('**/raspisanie/');await p.waitForFunction(()=>window.auditCalls.filter(a=>a[1]==='hit').length===2);
 await p.goBack();await p.waitForFunction(()=>window.auditCalls.filter(a=>a[1]==='hit').length===3);
 const hits=await p.evaluate(()=>window.auditCalls.filter(a=>a[1]==='hit'));assert(hits.every(a=>!a[2].includes('?')&&!a[2].includes('#')));assert(hits.every(a=>!a[3].referer.includes('?')));
 await p.evaluate(k=>{localStorage.setItem(k,'denied');window.dispatchEvent(new Event('primeswim:analytics-consent-change'))},key);await p.waitForFunction(()=>window.auditCalls.some(a=>a[1]==='destruct'));await p.locator('a[href="/raspisanie/"]:visible').first().click();await p.waitForURL('**/raspisanie/');await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>window.auditCalls.filter(a=>a[1]==='hit').length),3);
 console.log('PASS consent, first hit, SPA, back, sanitization, revocation');
 await p.goto(base+'/price/?utm_source=local-test&phone=secret#booking');
 await p.evaluate(k=>{localStorage.setItem(k,'granted');window.dispatchEvent(new Event('primeswim:analytics-consent-change'))},key);
 await p.waitForFunction(()=>window.auditCalls.some(a=>a[1]==='hit'));
 assert.equal(await p.evaluate(()=>window.auditCalls.find(a=>a[1]==='hit')[2]),base+'/price/?utm_source=local-test');
 const requests=[];
 await p.route('**/*',async route=>{
  if(route.request().method()!=='POST')return route.fallback();
  requests.push(route.request().postDataJSON());
  await route.fulfill({status:requests.length===1?503:200,contentType:'application/json',body:JSON.stringify(requests.length===1?{ok:false,message:'LOCAL_TEST_RETRY'}:{ok:true,ticket:'LOCAL-TEST'})});
 });
 await p.locator('[name=name]').fill('Локальный тест');
 await p.locator('[name=phone]').fill('+79161234567');
 await p.locator('[name=age]').selectOption({index:2});
 await p.locator('[name=consent]').check();
 await p.locator('form button[type=submit]').click();
 await p.getByText('LOCAL_TEST_RETRY',{exact:true}).waitFor();
 assert.equal(await p.locator('[name=name]').inputValue(),'Локальный тест');
 assert.equal(await p.evaluate(()=>window.auditCalls.filter(a=>a[1]==='reachGoal'&&a[2]==='lead_delivered').length),0);
 await p.locator('form button[type=submit]').click();
 await p.getByText('LOCAL-TEST',{exact:true}).waitFor();
 assert.equal(requests.length,2);assert.equal(requests[0].requestId,requests[1].requestId);
 assert.equal(await p.evaluate(()=>window.auditCalls.filter(a=>a[1]==='reachGoal'&&a[2]==='lead_delivered').length),1);
 console.log('PASS campaign attribution, mocked failure/retry/success and delivery goal');
 for(const width of [360,390,430])for(const path of ['/price/','/raspisanie/','/'])for(const scale of [100,200]){
  await p.setViewportSize({width,height:844});await p.goto(base+path);await p.waitForFunction(()=>!document.querySelector('fieldset').disabled);await p.evaluate(scale=>{document.documentElement.style.fontSize=scale+'%';document.documentElement.style.scrollBehavior='auto'},scale);await p.waitForTimeout(150);
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  if(overflow>1){console.log('OVERFLOW',width,path,scale,overflow,await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1}).slice(0,6).map(e=>({tag:e.tagName,class:e.className,right:e.getBoundingClientRect().right}))));}
  assert(overflow<=1,`${path} ${width} ${scale}% overflow ${overflow}`);
 }console.log('PASS responsive home/price/schedule 360/390/430 100/200%');await c.close();
} finally {await browser.close()}
