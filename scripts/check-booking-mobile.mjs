import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';

const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch(
  process.env.SHOT_EXECUTABLE ? { executablePath: process.env.SHOT_EXECUTABLE } : { channel: 'chrome' },
);

async function checkChoice(path, slow) {
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  let release;
  if (slow) {
    // Первый клик делаем, когда HTML уже есть, а JS ещё не получен.
    const scripts = new Promise((resolve) => { release = resolve; });
    await context.route(/\/_next\/static\/chunks\/.*\.js(?:\?|$)/, async (route) => {
      await scripts;
      await route.continue();
    });
  }

  try {
    const page = await context.newPage();
    await page.goto(base + path, { waitUntil: slow ? 'commit' : 'load' });
    const phone = page.getByRole('textbox', { name: /Телефон/ });
    if (slow) {
      await phone.waitFor({ state: 'attached' });
      assert.ok(await phone.isDisabled(), 'Первый выбор должен произойти до загрузки JavaScript');
    } else {
      await page.waitForFunction(() => !document.querySelector('form fieldset')?.disabled);
    }

    const isSchedule = path === '/raspisanie/';
    let expected;
    if (isSchedule) {
      const link = page.locator('#schedule').getByRole('link', { name: /Выбрать время/ }).first();
      const box = await link.boundingBox();
      assert.ok(box && box.y + box.height <= 844, 'Первое время нового набора доступно на первом экране');
      const label = await link.getAttribute('aria-label');
      expected = await page.locator('select[name=slot] option').evaluateAll(
        (options, name) => options.find((o) => o.value && name.includes(o.textContent.trim()))?.textContent.trim(),
        label,
      );
      await link.click();
    } else {
      const tariff = page.locator('#prices li').nth(1);
      expected = (await tariff.getByRole('heading').innerText()).trim();
      await tariff.getByRole('link', { name: /Записаться/ }).click();
    }
    release?.();
    await page.waitForFunction(() => !document.querySelector('form fieldset')?.disabled);
    const form = page.locator('#booking form');
    assert.ok(expected, 'У выбранного варианта есть подпись');
    await form.getByRole('button', { name: 'Изменить', exact: true }).waitFor();
    assert.ok((await form.innerText()).includes(expected), 'Видимая сводка сохраняет первый выбор');
    assert.equal(await form.locator('details').evaluate((el) => el.open), false);
    await form.getByRole('button', { name: 'Изменить', exact: true }).click();
    const field = isSchedule ? form.getByLabel('Удобное время', { exact: true }) : form.getByLabel('Тариф', { exact: true });
    assert.equal((await field.locator('option:checked').innerText()).trim(), expected);
    assert.ok(await field.evaluate((el) => el === document.activeElement), 'Клавиатура попадает в редактор выбора');
  } finally {
    release?.();
    await context.close();
  }
}

async function checkHomeBooking() {
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  try {
    await page.goto(base);
    await page.getByRole('link', { name: 'Записаться на пробное занятие', exact: true }).first().click();
    await page.getByRole('dialog', { name: 'Использование cookie' }).waitFor();
    await page.waitForFunction(() => ['name', 'phone'].every((name) => {
      const input = document.querySelector(`form input[name="${name}"]`);
      if (!input || input.matches(':disabled')) return false;
      const rect = input.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      return rect.top >= 0 && rect.bottom <= innerHeight
        && document.elementFromPoint(x, rect.top + 2) === input
        && document.elementFromPoint(x, rect.bottom - 2) === input;
    }));
  } finally {
    await page.close();
  }
}

try {
  await checkHomeBooking();
  console.log('Главная: контакты видны при открытом уведомлении о cookie');
  for (const path of ['/raspisanie/', '/price/']) {
    for (const slow of [false, true]) {
      await checkChoice(path, slow);
      console.log(path, slow ? 'до загрузки JavaScript' : 'после загрузки JavaScript', 'OK');
    }
  }
} finally {
  await browser.close();
}
