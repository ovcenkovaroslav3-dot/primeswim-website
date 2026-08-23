import { Section } from '../ui';
import { LeadForm } from './LeadForm';
import { contacts } from '@/content/contacts';
import { isLeadDeliveryConfigured } from '@/lib/crm';

/** Крупная кнопка мессенджера: основной способ записи. */
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
      className="group flex min-h-24 flex-col justify-center rounded-2xl bg-white/10 p-6 ring-1 ring-white/20 transition-colors hover:bg-white/15 hover:ring-lime-brand"
    >
      <span className="flex items-center gap-2 font-display text-xl font-bold text-lime-brand">
        {title}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
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
      <span className="mt-1.5 text-sm leading-relaxed text-white/75">
        {description}
      </span>
    </a>
  );
}

export function Booking() {
  /*
    Форма показывается только тогда, когда заявке действительно есть куда уйти.
    Пока канал доставки не настроен, запись идёт напрямую в мессенджеры —
    так посетитель не отправляет заявку «в никуда».
  */
  const showForm = isLeadDeliveryConfigured();

  return (
    <Section id="booking" labelledBy="booking-title" className="bg-brand-900">
      <div
        className={
          showForm
            ? 'grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start'
            : 'mx-auto max-w-3xl text-center'
        }
      >
        <div className="text-white">
          <h2
            id="booking-title"
            className="font-display text-3xl leading-tight font-bold sm:text-4xl"
          >
            Запишите ребёнка на пробное занятие
          </h2>
          <p className="mt-5 leading-relaxed text-white/80">
            Напишите нам в мессенджер — подберём группу по возрасту и уровню
            подготовки, назовём ближайшее свободное время и расскажем, что взять
            с собой.
          </p>

          <div
            className={`mt-8 grid gap-4 sm:grid-cols-2 ${
              showForm ? '' : 'text-left'
            }`}
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

          <p className="mt-6 text-sm leading-relaxed text-white/70">
            Чтобы ответить сразу по делу, укажите в сообщении{' '}
            <span className="text-white">возраст ребёнка</span>,{' '}
            <span className="text-white">опыт занятий в бассейне</span> и{' '}
            <span className="text-white">удобные дни</span>.
          </p>

          <p className="mt-6 border-t border-white/15 pt-6 text-white/80">
            Удобнее голосом? Позвоните:{' '}
            <a
              href={contacts.phone.href}
              data-goal="click_phone"
              className="font-display text-lg font-bold text-lime-brand underline-offset-4 hover:underline"
            >
              {contacts.phone.display}
            </a>
          </p>
        </div>

        {showForm ? <LeadForm /> : null}
      </div>
    </Section>
  );
}
