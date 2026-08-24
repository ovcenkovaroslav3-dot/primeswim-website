import { LeadForm } from './LeadForm';
import { WaterScene } from '../WaterScene';
import { contacts } from '@/content/contacts';

/*
  Финальный экран и запись — один блок.

  Раньше это были две секции подряд: «Начните с первой тренировки» с кнопкой
  и сразу за ней «Запишите ребёнка» с мессенджерами. Два призыва подряд
  ослабляли друг друга, поэтому они сведены в один.

  Секция намеренно рифмуется с первым экраном: та же сцена воды, та же
  типографика, тот же акцент. Сайт открывается и закрывается одинаково.

  Якорь `booking` сохранён — на него ведут все кнопки записи со страницы.

  Форма работает без сервера: проверяет поля в браузере и открывает Telegram
  с готовым сообщением. Мессенджеры рядом — для тех, кому проще написать
  сразу, без формы.
*/

function MessengerCard({
  href,
  title,
  description,
  goal,
}: {
  href: string;
  title: string;
  description: string;
  goal: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-goal={goal}
      className="group lift glass flex min-h-24 flex-col justify-center rounded-[16px] p-6 text-left transition-colors duration-200 hover:border-lime-300/60"
    >
      <span className="flex items-center gap-2 text-lg font-medium text-white">
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className="text-lime-300 transition-transform duration-200 group-hover:translate-x-1"
        >
          <path
            d="M4 14 14 4M6 4h8v8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="mt-1.5 text-sm leading-relaxed text-white/65">
        {description}
      </span>
    </a>
  );
}

export function FinalCta() {
  return (
    <section
      id="booking"
      aria-labelledby="booking-title"
      className="on-dark relative isolate overflow-hidden bg-abyss-950 px-4 py-20 text-white sm:px-6 sm:py-24 md:py-36"
    >
      <div className="absolute inset-0 -z-10">
        <WaterScene />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-abyss-950/72" />

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <p className="reveal text-xs font-medium tracking-[0.28em] text-lime-300 uppercase">
          Первый шаг
        </p>

        <h2
          id="booking-title"
          className="reveal mt-6 text-[clamp(2.2rem,7vw,4.2rem)] leading-[1.02] font-extralight"
          style={{ ['--reveal-delay' as string]: '90ms' }}
        >
          Начните с первой тренировки
        </h2>

        <p
          className="reveal mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-white/75"
          style={{ ['--reveal-delay' as string]: '180ms' }}
        >
          Заполните форму или напишите в мессенджер — подберём группу по возрасту
          и уровню подготовки и назовём ближайшее свободное время.
        </p>

        <div
          className="reveal mt-10 grid gap-4 sm:grid-cols-2"
          style={{ ['--reveal-delay' as string]: '270ms' }}
        >
          <MessengerCard
            href={contacts.social.telegramBooking}
            title="Telegram"
            description="Ответим в рабочее время школы"
            goal="click_telegram"
          />
          <MessengerCard
            href={contacts.social.max}
            title="MAX"
            description="Если удобнее — пишите сюда"
            goal="click_max"
          />
        </div>

        <div
          className="reveal mt-10 text-left"
          style={{ ['--reveal-delay' as string]: '340ms' }}
        >
          <LeadForm />
        </div>

        <p className="reveal mt-8 border-t border-white/15 pt-8 text-white/75">
          Удобнее голосом? Позвоните{' '}
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="text-lg font-light text-lime-300 underline-offset-4 hover:underline"
          >
            {contacts.phone.display}
          </a>
        </p>
      </div>
    </section>
  );
}
