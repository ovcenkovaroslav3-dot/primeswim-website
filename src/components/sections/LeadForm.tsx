'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { buttonClass } from '../ui';
import { contacts } from '@/content/contacts';
import { initialLeadState } from '@/lib/lead-schema';
import { programOptions } from '@/content/programs';
import { submitLead } from '@/app/actions/submit-lead';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={buttonClass('secondary', 'lg', 'w-full sm:w-auto')}
    >
      {pending ? 'Отправляем…' : 'Отправить заявку'}
    </button>
  );
}

const fieldClass =
  'min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand-600';

export function LeadForm() {
  const [state, formAction] = useActionState(submitLead, initialLeadState);

  if (state.status === 'success') {
    return (
      <div className="rounded-[20px] bg-white p-8 text-center sm:p-12">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-aqua-400">
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
              <path
                d="M2 10.5 9.5 18 24 2"
                stroke="#24003a"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="mt-6 text-2xl font-extralight text-ink sm:text-3xl">
            Заявка отправлена
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Мы получили вашу заявку и свяжемся по указанному номеру, чтобы
            подобрать группу и ответить на вопросы.
          </p>
          <p className="mt-6 text-sm text-ink-muted">
            Если нужно быстрее — позвоните:{' '}
            <a
              href={contacts.phone.href}
              className="font-medium text-brand-600 underline underline-offset-4"
            >
              {contacts.phone.display}
            </a>
          </p>
      </div>
    );
  }

  return (
        <form
          action={formAction}
          noValidate
          className="rounded-[20px] bg-white p-6 sm:p-8"
        >
          {state.message ? (
            <p
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {state.message}
            </p>
          ) : null}

          <div className="grid gap-5">
            <div>
              <label
                htmlFor="lead-name"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Имя <span className="text-red-600">*</span>
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                defaultValue={state.values.name}
                aria-invalid={Boolean(state.errors.name)}
                aria-describedby={state.errors.name ? 'lead-name-error' : undefined}
                placeholder="Как к вам обращаться"
                className={`${fieldClass} ${
                  state.errors.name ? 'border-red-400' : 'border-hairline'
                }`}
              />
              {state.errors.name ? (
                <p id="lead-name-error" className="mt-2 text-sm text-red-700">
                  {state.errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="lead-phone"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Телефон <span className="text-red-600">*</span>
              </label>
              {/* Маску не ставим: она мешает вставке и вводу нестандартных номеров */}
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                defaultValue={state.values.phone}
                aria-invalid={Boolean(state.errors.phone)}
                aria-describedby={
                  state.errors.phone ? 'lead-phone-error' : 'lead-phone-hint'
                }
                placeholder="+7 900 000-00-00"
                className={`${fieldClass} ${
                  state.errors.phone ? 'border-red-400' : 'border-hairline'
                }`}
              />
              {state.errors.phone ? (
                <p id="lead-phone-error" className="mt-2 text-sm text-red-700">
                  {state.errors.phone}
                </p>
              ) : (
                <p id="lead-phone-hint" className="mt-2 text-sm text-ink-muted">
                  Можно вводить в любом формате.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-program"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Направление
              </label>
              <select
                id="lead-program"
                name="program"
                defaultValue={state.values.program}
                aria-invalid={Boolean(state.errors.program)}
                className={`${fieldClass} ${
                  state.errors.program ? 'border-red-400' : 'border-hairline'
                }`}
              >
                {programOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="lead-comment"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Комментарий
              </label>
              <textarea
                id="lead-comment"
                name="comment"
                rows={3}
                maxLength={600}
                defaultValue={state.values.comment}
                aria-invalid={Boolean(state.errors.comment)}
                aria-describedby={
                  state.errors.comment ? 'lead-comment-error' : undefined
                }
                placeholder="Возраст ребёнка, удобное время, опыт плавания"
                className={`${fieldClass} resize-y ${
                  state.errors.comment ? 'border-red-400' : 'border-hairline'
                }`}
              />
              {state.errors.comment ? (
                <p id="lead-comment-error" className="mt-2 text-sm text-red-700">
                  {state.errors.comment}
                </p>
              ) : null}
            </div>

            {/* Honeypot: скрыт от людей, но доступен ботам */}
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <label htmlFor="lead-company">Не заполняйте это поле</label>
              <input
                id="lead-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  defaultChecked={state.values.consent}
                  aria-invalid={Boolean(state.errors.consent)}
                  aria-describedby={
                    state.errors.consent ? 'lead-consent-error' : undefined
                  }
                  className="mt-0.5 size-6 shrink-0 accent-brand-600"
                />
                <span>
                  Я согласен(а) на{' '}
                  <Link
                    href="/policy"
                    className="font-medium text-brand-600 underline underline-offset-4"
                  >
                    обработку персональных данных
                  </Link>
                  .
                </span>
              </label>
              {state.errors.consent ? (
                <p id="lead-consent-error" className="mt-2 text-sm text-red-700">
                  {state.errors.consent}
                </p>
              ) : null}
            </div>

            <SubmitButton />
          </div>
        </form>
  );
}
