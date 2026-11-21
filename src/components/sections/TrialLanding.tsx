import Link from 'next/link';

import { CoachPortrait } from '../CoachPortrait';
import { EnrollmentLinks } from '../EnrollmentLinks';
import { Picture } from '../Picture';
import { ProgramBookButton } from '../ProgramBookButton';
import { ArrowLink, ButtonLink, Section, SectionHeading } from '../ui';
import { coaches } from '@/content/coaches';
import { contacts } from '@/content/contacts';
import { heroImage } from '@/content/media';
import { prices } from '@/content/prices';
import { programs } from '@/content/programs';
import { gateInstructions, routeSteps } from '@/content/route';
import { site } from '@/content/site';

/*
  Блоки посадочной страницы /probnoe-zanyatie/ для рекламы в Директе.

  Всё, что можно, взято из существующих компонентов и файлов контента
  (форма — FinalCta, отзывы — Reviews, вопросы — Faq). Здесь только то, чего
  в готовом виде нет: первый экран с одной целью, четыре довода и короткий
  маршрут. Новых фактов тут нет, все числа считаются из content/.

  Фон первого экрана без WebGL-сцены: на телефоне из рекламы важнее скорость,
  а фирменные пятна и стекло остаются.
*/

const coach = coaches[0];
const trialPrice = prices.find((price) => price.id === 'trial')?.amount ?? null;
const rub = (amount: number) => `${amount.toLocaleString('ru-RU')} ₽`;

export function TrialHero() {
  return (
    <section
      aria-labelledby="trial-title"
      className="on-dark relative isolate overflow-clip bg-abyss-950 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 -z-10 size-[26rem] rounded-full bg-brand-500/28 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 -z-10 size-[22rem] rounded-full bg-brand-300/14 blur-3xl"
      />

      <div className="mx-auto w-full max-w-[75rem] px-4 pt-7 pb-10 sm:px-6 sm:pt-14 sm:pb-14 md:pt-20 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase sm:tracking-[0.24em]">
              {site.hero.kicker}
            </p>

            <h1
              id="trial-title"
              className="mt-3 text-[clamp(1.7rem,7vw,3.25rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] sm:mt-4"
            >
              Пробное занятие по плаванию для детей с 7 лет в Химках
            </h1>

            <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
              Бассейн МГИК, {contacts.address.district}. Занятие ведёт сам тренер, {coach.name}:
              45 минут вместе с группой.
            </p>

            <div className="mt-5 sm:mt-7">
              <Link
                href="#booking"
                data-goal="cta_booking"
                className="lift glow-accent inline-flex min-h-13 w-full items-center justify-center rounded-control bg-lime-400 px-7 text-center text-base font-semibold text-abyss-950 transition-colors duration-200 hover:bg-lime-300 sm:w-auto"
              >
                Записаться на пробное
              </Link>
              {trialPrice ? (
                <p className="mt-3 text-sm text-white/70">Пробное занятие — {rub(trialPrice)}</p>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-inset border border-white/20 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white">
              <span className="font-semibold">Новый набор</span>
              <EnrollmentLinks dark />
              <span className="w-full text-xs text-white/65">
                Выберите время, и мы подставим его в заявку.
              </span>
            </div>

            <div className="mt-5">
              <p className="text-sm text-white/70">Чему хотите научиться:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {programs.map((program) => (
                  <ProgramBookButton key={program.id} id={program.id} title={program.title} chip />
                ))}
              </div>
            </div>
          </div>

          {/* Только широкий экран: на телефоне кадр отодвигал бы форму, а ленивая картинка в скрытом блоке не грузится. */}
          <div className="hidden lg:block">
            <figure className="zoom-frame relative overflow-hidden rounded-card border border-white/15 bg-abyss-900">
              <Picture
                src={heroImage.src}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                sizes="22rem"
                className="aspect-3/4 w-full object-cover"
              />
              <figcaption className="glass absolute inset-x-3 bottom-3 rounded-inset px-3 py-2 text-xs text-white/90">
                Бассейн МГИК · Химки
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

const reasons = [
  {
    title: 'Занятие ведёт сам тренер',
    text: `${coach.name}: кандидат в мастера спорта, ${coach.yearsExperience} лет тренерской работы. Он ведёт все группы школы.`,
  },
  {
    title: 'Группа по возрасту и уровню',
    text: 'Подберём группу по возрасту и уровню подготовки ребёнка, чтобы он занимался с ровесниками.',
  },
  {
    title: 'Опыт плавания не нужен',
    text: 'С 7 лет. В группах занимаются и те, кто впервые пришёл в бассейн.',
  },
  {
    title: 'Бассейн МГИК',
    text: 'Шесть дорожек по 25 метров. Все группы школы занимаются здесь.',
  },
];

export function TrialWhy() {
  return (
    <Section id="why" labelledBy="why-title" className="bg-surface [overflow-wrap:anywhere]">
      <SectionHeading id="why-title" eyebrow="Почему мы" title="Что ждёт ребёнка на пробном" />
      <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:items-start md:gap-8">
        <div className="mx-auto w-full max-w-[12rem] md:max-w-none">
          <CoachPortrait name={coach.name} photo={coach.photo} priority={false} />
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {reasons.map((reason) => (
            <li
              key={reason.title}
              className="reveal min-w-0 rounded-card border border-hairline bg-surface-alt p-5"
            >
              <h3 className="text-lg font-medium text-ink">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function TrialRoute() {
  return (
    <Section id="route" labelledBy="route-title" className="bg-surface-alt [overflow-wrap:anywhere]">
      <SectionHeading id="route-title" eyebrow="Где занимаемся" title="Как добраться" />
      <address className="mt-6 text-lg leading-relaxed text-ink-soft not-italic">
        {contacts.address.region}, г. {contacts.address.city}, {contacts.address.district},{' '}
        {contacts.address.street}
      </address>
      <ol className="mt-6 grid gap-3 md:grid-cols-3">
        {routeSteps.map((step, index) => (
          <li key={step.id} className="min-w-0 rounded-card border border-hairline bg-surface p-5">
            <span aria-hidden="true" className="text-2xl font-light tabular-nums text-ink-muted">
              {index + 1}
            </span>
            <h3 className="mt-2 text-lg font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {step.id === 'security' ? gateInstructions : step.description}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ButtonLink href={contacts.address.yandexMaps} external variant="ghost" data-goal="click_route">
          Построить маршрут
        </ButtonLink>
        <ArrowLink href="/bassein/">Подробнее, как пройти к бассейну</ArrowLink>
      </div>
    </Section>
  );
}
