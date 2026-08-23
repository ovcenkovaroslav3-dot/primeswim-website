import Link from 'next/link';

import { PoolScene } from '../PoolScene';
import { site } from '@/content/site';
import { contacts } from '@/content/contacts';

/*
  Первый экран построен по DESIGN.md: сверхлёгкое начертание заголовка,
  щедрый воздух, лайм ровно один раз — на главном действии.

  Фон — трёхмерная сцена бассейна на WebGL (стартовые тумбы, дорожки,
  преломление воды). Она рисуется кодом, поэтому страница не тянет
  ни одного изображения. Если WebGL недоступен, остаётся фирменная заливка
  brand-950, поверх которой текст читается так же.
*/
export function Hero() {
  const facts = site.pool.facts.slice(0, 3);

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-brand-950 md:min-h-[760px]">
      <div className="absolute inset-0">
        <PoolScene />
      </div>

      {/* ширма под текстом: на широком экране слева направо, на телефоне сверху вниз */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-brand-950/88 via-brand-950/72 to-brand-950/25 md:bg-linear-to-r md:from-brand-950/88 md:via-brand-950/55 md:to-brand-950/10"
      />

      <div className="relative mx-auto flex min-h-[680px] max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 md:min-h-[760px] md:py-24">
        <div className="max-w-[620px] text-white">
          <p className="mb-10 text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
            {site.tagline}
          </p>

          <h1 className="text-4xl leading-[1.05] font-extralight sm:text-5xl md:text-[68px]">
            {site.hero.titleLines[0]}
            <br />
            {site.hero.titleLines[1]}
          </h1>

          <p className="mt-8 max-w-[520px] text-base leading-relaxed text-white/75">
            {site.hero.subtitle}
          </p>

          <p className="mt-4 text-sm text-white/55">{contacts.address.short}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="#booking"
              data-goal="cta_booking"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-lime-brand px-5 text-sm font-medium text-brand-950 transition-colors hover:bg-lime-brand-dark"
            >
              {site.cta.primary}
            </Link>
            <Link
              href="#schedule"
              data-goal="cta_schedule"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {site.cta.schedule}
            </Link>
          </div>

          <dl className="mt-16 grid max-w-md grid-cols-3 gap-5 border-t border-white/20 pt-8 sm:gap-8">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className="text-xs leading-snug text-white/60">
                  {fact.label}
                </dt>
                {/* mt-auto держит значения на одной линии, когда подпись переносится */}
                <dd className="mt-auto pt-2 text-lg font-extralight sm:text-xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
