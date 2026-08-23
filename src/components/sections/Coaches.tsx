import Image from 'next/image';

import { Section, SectionHeading } from '../ui';
import { coaches } from '@/content/coaches';

export function Coaches() {
  return (
    <Section id="trainers" labelledBy="trainers-title" className="bg-surface-alt">
      <SectionHeading
        id="trainers-title"
        eyebrow="Тренеры"
        title="Кто ведёт занятия"
      />

      <div className="mt-12 flex flex-col gap-10">
        {coaches.map((coach) => (
          <article
            key={coach.id}
            className="grid gap-8 rounded-3xl border border-hairline bg-white p-6 sm:p-8 lg:grid-cols-[320px_1fr] lg:items-start"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface-alt">
              <Image
                src={coach.photo.src}
                alt={coach.photo.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-light text-ink sm:text-3xl">
                {coach.name}
              </h3>
              <p className="mt-2 font-medium text-brand-600">{coach.role}</p>

              {coach.bio.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 leading-relaxed text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}

              <h4 className="mt-7 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
                Направления работы
              </h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {coach.specialities.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
