import Image from 'next/image';

import { ButtonLink } from '../ui';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';
import { heroImage } from '@/content/media';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      {/* Мягкое свечение вместо тяжёлого градиента на всю секцию */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 h-96 w-96 rounded-full bg-brand-500/40 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-5 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-lime-brand">
            {site.tagline}
          </p>

          <h1 className="font-display text-4xl leading-[1.08] font-extrabold sm:text-5xl md:text-6xl">
            {site.hero.titleLines[0]}
            <br />
            <span className="text-lime-brand">{site.hero.titleLines[1]}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            {site.hero.subtitle}
          </p>

          <p className="mt-5 flex items-start gap-2 text-sm text-white/70">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            >
              <path
                d="M9 1.5c-2.9 0-5.25 2.35-5.25 5.25 0 3.94 5.25 9.75 5.25 9.75s5.25-5.81 5.25-9.75C14.25 3.85 11.9 1.5 9 1.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="9" cy="6.75" r="1.875" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {contacts.address.short}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              href="#booking"
              variant="secondary"
              size="lg"
              data-goal="cta_booking"
            >
              {site.cta.primary}
            </ButtonLink>
            <ButtonLink
              href="#schedule"
              size="lg"
              data-goal="cta_schedule"
              className="border-2 border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
            >
              {site.cta.schedule}
            </ButtonLink>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {site.pool.facts.slice(0, 3).map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs leading-snug text-white/60">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-bold text-lime-brand">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-800 shadow-2xl">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
