import assert from 'node:assert/strict';
import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(join(process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const origin = 'https://www.primeswim.ru';
const endpoint = new URL(process.env.PRIME_CHECK_LEAD_ENDPOINT);
assert.equal(endpoint.protocol, 'https:');
const attemptFile = fileURLToPath(new URL('./live-test-attempt.json', import.meta.url));
assert(!existsSync(attemptFile), 'One test attempt already recorded.');
const marker = 'prime_release_69f0f2b';
const name = 'ТЕСТ ВЫПУСКА PRIME SWIM — не звонить';
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Europe/Moscow' });
  const page = await context.newPage();
  const isLead = request => request.method() === 'POST' && request.url() === endpoint.href;
  const isCounter = response => {
    const url = new URL(response.url());
    return /^(?:mc\.yandex\.(?:ru|com)|mc\.yandex\.md)$/.test(url.hostname) && url.pathname.includes('/watch/111745879');
  };
  const goalResponses = [];
  page.on('response', response => {
    if (!isCounter(response)) return;
    let text = response.url() + ' ' + (response.request().postData() || '');
    for (let i = 0; i < 2; i++) {
      try { text = decodeURIComponent(text); } catch { break; }
    }
    if (text.includes('lead_delivered')) {
      goalResponses.push(response.status());
      console.log('METRIKA_GOAL_HTTP', response.status());
    }
  });
  page.on('console', message => {
    if (/Reach goal|reachGoal/i.test(message.text()) && message.text().includes('lead_delivered')) {
      console.log('METRIKA_DEBUG_LEAD_DELIVERED');
    }
  });

  await context.route('**/*', async route => {
    const request = route.request();
    if (!isLead(request)) {
      if (request.method() === 'POST' && !isCounter(request)) return route.abort();
      return route.continue();
    }
    if (existsSync(attemptFile)) return route.abort();
    const payload = request.postDataJSON();
    if (payload.name !== name || !payload.comment?.includes(marker) || !payload.consent) return route.abort();
    writeFileSync(attemptFile, JSON.stringify({ at: new Date().toISOString(), marker }), { flag: 'wx' });
    console.log('ONE_LEAD_POST_STARTED', new Date().toISOString());
    await route.continue();
  });

  const blog = await context.request.get(origin + '/blog/', { headers: { 'cache-control': 'no-cache' } });
  assert(blog.ok(), 'Live blog did not return success');
  assert.match(await blog.text(), /<meta property="og:url" content="https:\/\/www\.primeswim\.ru\/blog\/"\s*\/?\s*>/, 'New release not visible');
  const firstHit = page.waitForResponse(response => isCounter(response) && response.ok(), { timeout: 25000 }).catch(() => null);
  await page.goto(origin + '/price/?utm_source=' + marker + '&_ym_debug=1#booking', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Принять', exact: true }).click({ timeout: 12000 });
  assert(await firstHit, 'Metrika initial pageview not confirmed. No lead submitted.');
  console.log('METRIKA_PAGEVIEW_HTTP_OK');

  await page.locator('form [name=name]').fill(name);
  await page.locator('form [name=phone]').fill('+70000000000');
  await page.locator('form [name=age]').selectOption({ index: 2 });
  const comment = page.locator('form [name=comment]');
  if (!(await comment.isVisible())) await page.locator('form details > summary').click();
  await comment.fill('Тест после выпуска. Просьба не звонить и не учитывать как обращение. Метка ' + marker);
  await page.locator('form [name=consent]').check();
  const responsePromise = page.waitForResponse(response => isLead(response.request()), { timeout: 26000 }).catch(() => null);
  await page.locator('form button[type=submit]').click();
  const response = await responsePromise;
  assert(response, 'No response from lead receiver');
  const data = await response.json();
  console.log('LEAD_RECEIVER', JSON.stringify({ status: response.status(), ok: data.ok === true, ticket: data.ok ? data.ticket : undefined, duplicate: data.duplicate === true }));
  assert(response.ok() && data.ok === true && data.ticket && !data.duplicate, 'Receiver did not confirm delivery');
  await page.getByText(data.ticket, { exact: true }).waitFor({ timeout: 5000 });
  const until = Date.now() + 20000;
  while (!goalResponses.some(status => status >= 200 && status < 300) && Date.now() < until) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('METRIKA_GOAL_RESPONSES', JSON.stringify(goalResponses));
} finally {
  await browser.close();
}
