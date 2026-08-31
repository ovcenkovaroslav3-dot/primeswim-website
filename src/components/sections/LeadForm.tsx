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
  Черновик заявки, а не отправка.

  ЧТО ПРОИСХОДИТ НА САМОМ ДЕЛЕ: форма проверяет поля в браузере и открывает
  Telegram с уже набранным сообщением. Дальше родитель нажимает «Отправить»
  сам, в своём мессенджере. Сайт не передаёт данные школе и не получает
  подтверждения, что сообщение ушло. Часть родителей закроет вкладку, и школа
  об этой попытке не узнает — это известная и пока не закрытая потеря.

  Поэтому здесь нельзя писать «заявка отправлена» ни в интерфейсе, ни в
  аналитике. Цель называется `open_telegram_draft`: раньше отправлялась
  `lead_submitted`, и каждое открытие черновика считалось лидом — число
  заявок в Метрике было завышено, а CPL занижен.

  Побочный эффект решения ценный: сайт вообще не получает персональные данные.
  Ничего не уходит на наши серверы и третьим лицам — переписка идёт напрямую
  между родителем и школой. Поэтому кнопка называется «Открыть Telegram»,
  а не «Отправить».

  Настоящая доставка с подтверждением — следующий этап, разобран в
  docs/lead-delivery.md. Пока его нет, цели `lead_delivered` в проекте
  быть не должно.

  Правила проверки общие с остальным проектом и покрыты тестами
  (lead-schema.ts, npm test) — здесь они не дублируются.
*/

const labelClass = 'mb-2 block text-sm font-medium text-ink';
const fieldClass =
  'min-h-12 w-full rounded-[10px] border bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand-500';

function fieldBorder(hasError: boolean) {
  return hasError ? 'border-red-400' : 'border-hairline';
}

/** Собирает читаемое сообщение — тренер видит заявку целиком одним куском. */
function buildMessage(v: LeadValues): string {
  const age = ageOptions.find((o) => o.value === v.age)?.label ?? v.age;
  const program =
    programOptions.find((o) => o.value === v.program)?.label ?? 'не выбрано';

  const lines = [
    'Заявка с сайта PRIME SWIM',
    '',
    `Имя: ${v.name.trim()}`,
    `Телефон: ${v.phone.trim()}`,
    `Возраст ребёнка: ${age}`,
    `Направление: ${program}`,
  ];
  if (v.comment.trim()) lines.push(`Комментарий: ${v.comment.trim()}`);
  return lines.join('\n');
}

export function LeadForm() {
  const [values, setValues] = useState<LeadValues>(emptyLeadValues);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [sent, setSent] = useState(false);
  const [trap, setTrap] = useState('');

  /*
    «Форма начата» — ровно один раз на экземпляр формы. Ref, а не state:
    перерисовывать компонент из-за отметки не нужно, а состояние сбросилось
    бы вместе с ней. Событие показывает разрыв между «дошёл до формы» и
    «открыл черновик»: без него непонятно, теряются люди на самой форме
    или не доходят до неё.
  */
  const formStarted = useRef(false);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ловушка для ботов: люди это поле не видят и не заполняют
    if (trap.trim() !== '') {
      setSent(true);
      return;
    }

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

    // именно открытие черновика, а не отправленная заявка — см. шапку файла
    trackGoal('open_telegram_draft');
    const url = `${contacts.social.telegramBooking}?text=${encodeURIComponent(buildMessage(values))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  if (sent) {
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
          Остался один шаг
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Мы открыли Telegram с готовым сообщением. Пока вы не нажмёте в нём
          «Отправить», школа заявку не получит — сайт ничего не передаёт сам.
          Если вкладка не открылась, напишите или позвоните нам напрямую.
        </p>
        <p className="mt-4">
          <a
            href={contacts.social.telegramBooking}
            target="_blank"
            rel="noopener noreferrer"
            data-goal="click_telegram_booking"
            className="font-medium text-brand-600 underline underline-offset-4"
          >
            Открыть Telegram ещё раз
          </a>
        </p>
        <p className="mt-6 text-sm text-ink-muted">
          Или позвоните:{' '}
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
          давно не запрет. Настоящий родитель попадал в ловушку, форма
          показывала успех и не открывала Telegram — заявка исчезала.
          См. пояснение у поля hpx7 в lib/lead-schema.ts.
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
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              className="mt-0.5 size-6 shrink-0 accent-brand-600"
            />
            <span>
              Я согласен(а) на{' '}
              <Link
                href="/policy"
                prefetch={false}
                className="font-medium text-brand-600 underline underline-offset-4"
              >
                обработку персональных данных
              </Link>
              .
            </span>
          </label>
          {errors.consent ? (
            <p className="mt-2 text-sm text-red-700">{errors.consent}</p>
          ) : null}
        </div>

        <button type="submit" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
          Открыть Telegram с заявкой
        </button>

        <p className="text-sm leading-relaxed text-ink-muted">
          Сайт не отправляет заявку сам. По кнопке откроется Telegram с уже
          набранным сообщением — школа получит его после того, как вы нажмёте
          в мессенджере «Отправить».
        </p>
      </div>
    </form>
  );
}
