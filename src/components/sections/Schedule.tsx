import { ButtonLink, Section, SectionHeading } from '../ui';
import { schedule, scheduleIntro } from '@/content/schedule';
import { contacts } from '@/content/contacts';
import { site } from '@/content/site';

export function Schedule() {
  return (
    <Section id="schedule" labelledBy="schedule-title" className="bg-surface-alt">
      <SectionHeading
        id="schedule-title"
        eyebrow="Расписание"
        title="Когда проходят тренировки"
        lead={scheduleIntro}
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schedule.map((slot) => (
          <li
            key={slot.id}
            className="flex flex-col rounded-[20px] border border-hairline bg-white p-6"
          >
            <p className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
              {slot.day}
            </p>
            <p className="mt-2 text-3xl font-extralight tabular-nums text-ink">
              {slot.time}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
              {slot.note} · 45 минут
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-[20px] border border-hairline bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-soft">
          Не нашли удобное время? Напишите — подберём группу под ваш график.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink
            href={contacts.social.telegramBooking}
            external
            variant="primary"
          >
            {site.cta.telegram}
          </ButtonLink>
          <ButtonLink href={contacts.social.max} external variant="ghost">
            {site.cta.max}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
