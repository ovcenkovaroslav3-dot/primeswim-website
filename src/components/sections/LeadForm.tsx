'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

import { buttonClass } from '../ui';
import { contacts } from '@/content/contacts';
import { programOptions, validProgramIds, ageOptions, validAgeIds } from '@/content/programs';
import {
  validateLead,
  emptyLeadValues,
  type LeadErrors,
  type LeadValues,
} from '@/lib/lead-schema';
import { trackGoal } from '@/lib/analytics';

/*
  Настоящая отправка заявки — форма больше не открывает мессенджер.

  КАК ЭТО РАБОТАЕТ. Форма проверяет поля в браузере и отправляет их на
  endpoint (`NEXT_PUBLIC_LEAD_ENDPOINT`). Там заявка проверяется ещё раз и
  уходит ботом в MAX, в чат школы. Пока MAX не подтвердил приём, родителю
  показывается ошибка и прямые контакты, а не «спасибо». Цель
  `lead_delivered` отправляется только по ответу сервера с номером заявки.

  Что было раньше и почему изменилось. Форма собирала текст и открывала
  Telegram с черновиком: отправлял его родитель сам, а сайт не знал, дошло
  ли сообщение. Часть заявок терялась молча, а цель `open_telegram_draft`
  считала намерение, а не заявку. Теперь потери видно: неудачная доставка —
  это ошибка на экране, а не тишина.

  Что мы потеряли этим переходом, честно. Раньше сайт вообще не получал
  персональных данных — переписка шла напрямую между родителем и школой.
  Теперь данные проходят через функцию школы. Она их не хранит и не пишет
  в логи (см. server/lead/handler.ts), но обработка появилась, и это
  отражено в политике и в уведомлении в РКН.

  Правила проверки общие с сервером и покрыты тестами (lib/lead-schema.ts).
*/

const labelClass = 'mb-2 block text-sm font-medium text-ink';
const fieldClass =
  'min-h-12 w-full rounded-[10px] border bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand-500 disabled:opacity-60';

/** Адрес приёмника заявок. Пустой — значит форма отправлять некуда. */
const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT?.trim() || '';

function fieldBorder(hasError: boolean) {
  return hasError ? 'border-red-400' : 'border-hairline';
}

/**
 * Рекламные метки текущего визита. Нужны школе, чтобы понимать, откуда
 * пришёл человек: Метрика это знает, но в чате номера заявки рядом с
 * источником не будет, если его не передать.
 *
 * Берём только известные метки, а не всю строку запроса: в query может
 * оказаться что угодно, вплоть до чужих персональных данных.
 */
function collectSource(): string {
  if (typeof window === 'undefined') return '';
  const known = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'];
  const params = new URLSearchParams(window.location.search);
  return known
    .filter((key) => params.get(key))
    .map((key) => `${key}=${params.get(key)?.slice(0, 60)}`)
    .join('&');
}

/**
 * Ключ запроса. Один на экземпляр формы: если сеть подвела и родитель
 * нажал «Отправить» второй раз, сервер узнает повтор и не создаст вторую
 * заявку. `randomUUID` есть не во всех старых браузерах — отсюда запасной
 * вариант, ключ не обязан быть криптостойким.
 */
function makeRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

type Status = 'idle' | 'sending' | 'sent' | 'failed';

export function LeadForm() {
  const [values, setValues] = useState<LeadValues>(emptyLeadValues);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [ticket, setTicket] = useState('');
  const [failure, setFailure] = useState('');
  const [trap, setTrap] = useState('');

  /*
    «Форма начата» — ровно один раз на экземпляр формы. Ref, а не state:
    перерисовывать компонент из-за отметки не нужно, а состояние сбросилось
    бы вместе с ней. Событие показывает разрыв между «дошёл до формы» и
    «отправил»: без него непонятно, теряются люди на самой форме или не
    доходят до неё.
  */
  const formStarted = useRef(false);
  const requestId = useRef(makeRequestId());

  const markStarted = () => {
    if (formStarted.current) return;
    formStarted.current = true;
    trackGoal('start_form');
  };

  const set = <K extends keyof LeadValues>(key: K, value: LeadValues[K]) => {
    markStarted();
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    const found = validateLead(
      { ...values, hpx7: trap },
      validProgramIds,
      validAgeIds,
    );
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // переводим фокус на первое проблемное поле, а не просто краснеем
      const first = Object.keys(found)[0];
      document.getElementById(`lead-${first}`)?.focus();
      return;
    }

    if (!endpoint) {
      // Адрес приёмника не задан при сборке. Молчать нельзя: родитель
      // решит, что заявка ушла.
      setFailure('Отправка заявок сейчас недоступна. Напишите или позвоните нам — ответим сразу.');
      setStatus('failed');
      return;
    }

    setStatus('sending');
    setFailure('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          hpx7: trap,
          requestId: requestId.current,
          page: window.location.pathname,
          source: collectSource(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        // единственное место, где имеем право сказать «заявка принята»:
        // сервер ответил и назвал её номер
        setTicket(typeof data.ticket === 'string' ? data.ticket : '');
        setStatus('sent');
        trackGoal('lead_delivered');
        return;
      }

      if (data?.errors) {
        setErrors(data.errors as LeadErrors);
        setStatus('idle');
        const first = Object.keys(data.errors)[0];
        document.getElementById(`lead-${first}`)?.focus();
        return;
      }

      setFailure(
        typeof data?.message === 'string'
          ? data.message
          : 'Не получилось передать заявку. Напишите или позвоните нам напрямую.',
      );
      setStatus('failed');
    } catch {
      // сеть, блокировщик, оборванное соединение — родителю нужен запасной путь
      setFailure('Заявка не ушла — похоже, пропала связь. Напишите или позвоните нам напрямую.');
      setStatus('failed');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-[20px] bg-surface p-8 text-center sm:p-12">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-lime-400">
          <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
            <path
              d="M2 10.5 9.5 18 24 2"
              stroke="var(--color-abyss-950)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-6 text-2xl font-extralight text-ink sm:text-3xl">
          Заявка принята
        </p>
        {ticket ? (
          <p className="mt-3 text-ink-soft">
            Номер заявки: <span className="font-medium text-ink">{ticket}</span>
          </p>
        ) : null}
        <p className="mt-4 leading-relaxed text-ink-soft">
          Заявка у школы — перезвоним и подберём время. Обычно отвечаем в
          рабочие часы: {contacts.workingHours.display.toLowerCase()}.
        </p>
        <p className="mt-6 text-sm text-ink-muted">
          Не дождались звонка? Позвоните сами:{' '}
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="font-medium text-brand-600 underline underline-offset-4"
          >
            {contacts.phone.display}
          </a>
        </p>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[20px] bg-surface p-6 sm:p-8">
      <div className="grid gap-5">
        <div>
          <label htmlFor="lead-name" className={labelClass}>
            Имя <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            autoComplete="name"
            disabled={sending}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'lead-name-error' : undefined}
            placeholder="Как к вам обращаться"
            className={`${fieldClass} ${fieldBorder(Boolean(errors.name))}`}
          />
          {errors.name ? (
            <p id="lead-name-error" className="mt-2 text-sm text-red-700">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            Телефон <span className="text-red-600">*</span>
          </label>
          {/* маску не ставим: она мешает вставке и нестандартным номерам */}
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            disabled={sending}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'lead-phone-error' : 'lead-phone-hint'}
            placeholder="+7 900 000-00-00"
            className={`${fieldClass} ${fieldBorder(Boolean(errors.phone))}`}
          />
          {errors.phone ? (
            <p id="lead-phone-error" className="mt-2 text-sm text-red-700">
              {errors.phone}
            </p>
          ) : (
            <p id="lead-phone-hint" className="mt-2 text-sm text-ink-muted">
              Можно вводить в любом формате.
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="lead-age" className={labelClass}>
              Возраст ребёнка <span className="text-red-600">*</span>
            </label>
            <select
              id="lead-age"
              name="age"
              disabled={sending}
              value={values.age}
              onChange={(e) => set('age', e.target.value)}
              aria-invalid={Boolean(errors.age)}
              aria-describedby={
                values.age === 'under-7' ? 'lead-age-note' : errors.age ? 'lead-age-error' : undefined
              }
              className={`${fieldClass} ${fieldBorder(Boolean(errors.age))}`}
            >
              <option value="">Выберите возраст</option>
              {ageOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.age ? (
              <p id="lead-age-error" className="mt-2 text-sm text-red-700">
                {errors.age}
              </p>
            ) : values.age === 'under-7' ? (
              <p id="lead-age-note" className="mt-2 text-sm text-ink-muted">
                Обычно набираем с 7 лет — напишите, обсудим ваш случай.
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="lead-program" className={labelClass}>
              Направление
            </label>
            <select
              id="lead-program"
              name="program"
              disabled={sending}
              value={values.program}
              onChange={(e) => set('program', e.target.value)}
              className={`${fieldClass} ${fieldBorder(Boolean(errors.program))}`}
            >
              {programOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="lead-comment" className={labelClass}>
            Комментарий
          </label>
          <textarea
            id="lead-comment"
            name="comment"
            rows={3}
            maxLength={600}
            disabled={sending}
            value={values.comment}
            onChange={(e) => set('comment', e.target.value)}
            aria-invalid={Boolean(errors.comment)}
            aria-describedby="lead-comment-medical"
            placeholder="Опыт занятий, удобное время, вопросы"
            className={`${fieldClass} resize-y ${fieldBorder(Boolean(errors.comment))}`}
          />
          {/*
            Предупреждение о медицинских сведениях.

            Свободное поле рядом со словом «ребёнок» само провоцирует
            родителя написать диагноз. Данные о здоровье — специальная
            категория персональных данных (ст. 10 152-ФЗ), и получать их
            в обычной форме записи школа не должна. Дешевле не спрашивать,
            чем потом обеспечивать особый режим хранения.

            Стоит до поля в потоке чтения через aria-describedby и видимо —
            под ним, где взгляд оказывается перед началом ввода.

            [ТРЕБУЕТ ПРОВЕРКИ ЮРИСТОМ] Формулировка и то, как медицинские
            вопросы обсуждаются после обращения, — за пределами кода.
          */}
          <p id="lead-comment-medical" className="mt-2 text-sm text-ink-muted">
            Не указывайте диагнозы и другие медицинские сведения. Медицинские
            вопросы обсудим отдельно после обращения.
          </p>
          {errors.comment ? (
            <p className="mt-2 text-sm text-red-700">{errors.comment}</p>
          ) : null}
        </div>

        {/*
          Honeypot: скрыт от людей, но доступен ботам.

          Имя, id и подпись — бессмысленные. Поле называлось `company`, и
          заполнял его не бот, а автозаполнение браузера: «организацию» он
          подставляет сам, а `autocomplete="off"` для распознанных категорий
          давно не запрет. Настоящий родитель попадал в ловушку, и заявка
          исчезала. См. пояснение у поля hpx7 в lib/lead-schema.ts.
        */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label htmlFor="lead-hpx7">Оставьте это поле пустым</label>
          <input
            id="lead-hpx7"
            name="hpx7"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
            <input
              id="lead-consent"
              name="consent"
              type="checkbox"
              disabled={sending}
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 size-6 shrink-0 accent-brand-600"
            />
            {/*
              Формулировка длиннее обычной галочки намеренно. Согласие по
              ч. 4 ст. 9 152-ФЗ должно быть конкретным и информированным:
              человек должен понимать, чьи данные, кому и зачем он отдаёт.
              «Согласен на обработку персональных данных» этому не отвечает —
              в заявке есть данные ребёнка, а даёт согласие взрослый, и без
              упоминания законного представителя основание провисает.

              Ссылок две, и это не дублирование. Согласие — то, под чем
              человек ставит отметку прямо сейчас: состав данных, цель, срок,
              куда они уйдут. Политика — как Оператор обращается с данными
              вообще. Раньше галочка вела только на политику, и прочитать
              собственно согласие было негде.

              [ТРЕБУЕТ ПРОВЕРКИ ЮРИСТОМ] Точные слова.
            */}
            <span>
              Я родитель или законный представитель ребёнка и даю{' '}
              <Link
                href="/soglasie/"
                prefetch={false}
                className="font-medium text-brand-600 underline underline-offset-4"
              >
                согласие на обработку
              </Link>{' '}
              моих данных и данных ребёнка, чтобы школа связалась со мной по
              этой заявке — на условиях{' '}
              <Link
                href="/policy/"
                prefetch={false}
                className="font-medium text-brand-600 underline underline-offset-4"
              >
                политики обработки персональных данных
              </Link>
              .
            </span>
          </label>
          {errors.consent ? (
            <p className="mt-2 text-sm text-red-700">{errors.consent}</p>
          ) : null}
        </div>

        {status === 'failed' ? (
          /*
            Неудача показывается на месте, а не вместо формы: заполненные
            поля остаются, и «Отправить» можно нажать ещё раз — ключ запроса
            тот же, так что повтор не создаст вторую заявку.
          */
          <div
            role="alert"
            className="rounded-[14px] border border-red-300 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-900"
          >
            <p>{failure}</p>
            <p className="mt-2">
              <a
                href={contacts.phone.href}
                data-goal="click_phone"
                className="font-medium underline underline-offset-4"
              >
                {contacts.phone.display}
              </a>
              {' · '}
              <a
                href={contacts.social.max}
                target="_blank"
                rel="noopener noreferrer"
                data-goal="click_max_booking"
                className="font-medium underline underline-offset-4"
              >
                MAX
              </a>
              {' · '}
              <a
                href={contacts.social.telegramBooking}
                target="_blank"
                rel="noopener noreferrer"
                data-goal="click_telegram_booking"
                className="font-medium underline underline-offset-4"
              >
                Telegram
              </a>
            </p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className={buttonClass('primary', 'lg', 'w-full sm:w-auto disabled:opacity-70')}
        >
          {sending ? 'Отправляем…' : 'Отправить заявку'}
        </button>

        <p className="text-sm leading-relaxed text-ink-muted">
          Заявка уходит прямо тренеру в MAX. Перезвоним в рабочие часы и
          подберём время — обычно в тот же день.
        </p>
      </div>
    </form>
  );
}
