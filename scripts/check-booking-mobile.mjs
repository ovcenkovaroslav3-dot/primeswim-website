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
      const link = page.locator('#schedule').getByRole('link', { name: /выбрать время/i }).first();
      const box = await link.boundingBox();
      assert.ok(box && box.y + box.height <= 844, 'Первое время нового набора доступно на первом экране');
      // Имя кнопки начинается с видимого текста (WCAG 2.5.3).
      const label = await link.getAttribute('aria-label');
      const visible = (await link.innerText()).replace('→', '').trim();
      assert.ok(label.startsWith(visible), `Имя «${label}» начинается с видимого текста «${visible}»`);
      const [, day, hours, minutes] = /booking-slot-([a-z]+)-(\d\d)-(\d\d)$/.exec(await link.getAttribute('href')) ?? [];
      expected = await page.locator('select[name=slot] option').evaluateAll(
        (options, value) => options.find((o) => o.value === value)?.textContent.trim(),
        `${day}-${hours}:${minutes}`,
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
    const changeName = isSchedule ? 'Изменить время' : 'Изменить тариф';
    assert.ok(expected, 'У выбранного варианта есть подпись');
    await form.getByRole('button', { name: changeName, exact: true }).waitFor();
    assert.ok((await form.innerText()).includes(expected), 'Видимая сводка сохраняет первый выбор');
    assert.equal(await form.locator('details').evaluate((el) => el.open), false);
    await form.getByRole('button', { name: changeName, exact: true }).click();
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

async function checkWednesdayUnavailable() {
  const page = await browser.newPage(devices['iPhone 13']);
  try {
    for (const path of ['/', '/price/', '/raspisanie/', '/probnoe-zanyatie/']) {
      await page.goto(base + path + '#booking-slot-wed-19-45');
      await page.waitForFunction(() => !document.querySelector('form fieldset')?.disabled);
      const time = page.locator('#booking select[name=slot]');
      assert.equal(await time.locator('option[value="wed-19:45"]').count(), 0, path);
      assert.equal(await time.locator('option[value="fri-19:45"]').count(), 1, path);
      assert.equal(await time.inputValue(), '', 'Старая ссылка не выбирает среду');
      assert.equal(await page.locator('a[href*="booking-slot-wed-19-45"]').count(), 0, path);
      const intro = page.locator('#booking').getByText(
        'Пробное плавание для детей от 7 лет в бассейне МГИК, Химки, Левобережный. 45 минут в группе с тренером, 1 100 ₽. Подберём группу по возрасту и уровню ребёнка.',
        { exact: true },
      );
      assert.equal(await intro.count(), path === '/' ? 1 : 0, path);
    }
  } finally {
    await page.close();
  }
}

try {
  await checkWednesdayUnavailable();
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
