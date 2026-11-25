import { LeadForm } from './LeadForm';
import { OrcaMark } from '../OrcaMark';
import { WaterScene } from '../WaterScene';
import { contacts } from '@/content/contacts';
import { slotOptions } from '@/content/schedule';
import { prices } from '@/content/prices';
import { programs } from '@/content/programs';
import { slotFragment, tariffFragment, programFragment } from '@/lib/booking';

/*
  Финальный экран и запись — один блок.

  Раньше это были две секции подряд: «Начните с первой тренировки» с кнопкой
  и сразу за ней «Запишите ребёнка» с мессенджерами. Два призыва подряд
  ослабляли друг друга, поэтому они сведены в один.

  Якорь `booking` сохранён — на него ведут все кнопки записи со страницы.

  Форма отправляет заявку по-настоящему: проверяет поля, передаёт их на
  приёмник, и тот кладёт заявку ботом в MAX (см. server/lead). Мессенджеры
  рядом — для тех, кому проще написать сразу, без формы.

  ФОН ЗАВИСИТ ОТ ТОГО, ГДЕ СТОИТ СЕКЦИЯ. Сцена воды была задумана как рифма
  к первому экрану — «сайт открывается и закрывается одинаково», и это
  правда, пока секция встречается один раз. После разбивки на страницы
  FinalCta стоит на каждой из восьми — и стала главной причиной, почему
  переход между страницами ощущался медленным: WebGL-контекст и шейдер
  собираются заново при каждом монтировании, а не один раз за сеанс.
  На семи внутренних страницах эта секция вообще не рифмуется ни с чем —
  первый экран там не показывается, рифмовать не с чем.

  Поэтому variant="water" (сцена воды) остался только на самой FinalCta
  на главной, следом за Hero — там рифма настоящая. Остальные страницы
  получают variant="plain": те же два мягких пятна на тёмном фоне, что и
  в Progress/Pool/Competitions — тот же язык, но без WebGL.
*/

export function FinalCta({
  variant = 'plain',
  compact = false,
  intro,
}: {
  variant?: 'water' | 'plain';
  /** Тесная посадка: на посадочной странице форма стоит высоко. */
  compact?: boolean;
  intro?: string;
} = {}) {
  return (
    <section
      aria-labelledby="booking-title"
      className={`on-dark relative isolate overflow-hidden bg-abyss-950 px-4 text-white sm:px-6 ${compact ? 'border-t border-white/10 py-10 sm:py-14' : 'py-20 sm:py-24 md:py-36'}`}
    >
      {variant === 'water' ? (
        <>
          <div className="absolute inset-0 -z-10">
            <WaterScene />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-abyss-950/72" />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-500/24 blur-3xl"
            style={{
              ['--parallax-from' as string]: '-12%',
              ['--parallax-to' as string]: '12%',
            }}
          />
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -right-28 bottom-0 size-[26rem] rounded-full bg-brand-300/14 blur-3xl"
            style={{
              ['--parallax-from' as string]: '14%',
              ['--parallax-to' as string]: '-14%',
            }}
          />
        </>
      )}

      {/*
        Косатка в толще — тот же знак, что и на первом экране, и это
        намеренная рифма: страница открывается и закрывается одной фигурой.
        Здесь она идёт вверх и вправо, к форме, а не поперёк экрана.

        Почти прозрачная и без резких краёв: на тёмной воде это форма,
        которую замечаешь вторым взглядом, а не картинка, с которой спорит
        заголовок. Сама фигура декоративна и из чтения с экрана исключена.
      */}
      <OrcaMark
        tone="white"
        tilt={-16}
        className="pointer-events-none absolute -top-6 -left-[12%] -z-10 w-[68%] opacity-[0.05] sm:-left-[6%] sm:w-[52%] md:-top-10 md:w-[44%]"
      />

      <div className="relative mx-auto min-w-0 w-full max-w-3xl [overflow-wrap:anywhere] text-center">
        <div id="booking" className="relative text-left">
          {slotOptions.map((slot) => (
            <span key={slot.value} id={slotFragment(slot.value)} className="absolute top-0 h-px w-px" />
          ))}
          {prices.map((price) => (
            <span key={price.id} id={tariffFragment(price.id)} className="absolute top-0 h-px w-px" />
          ))}
          {programs.map((program) => (
            <span key={program.id} id={programFragment(program.id)} className="absolute top-0 h-px w-px" />
          ))}
          <h2 id="booking-title" className="mb-4 text-2xl font-medium text-white sm:text-3xl">
            Запись на пробное занятие
          </h2>
          {intro ? <p className="mb-4 max-w-prose text-white/85">{intro}</p> : null}
          <LeadForm />
        </div>
        <p className="mt-6 text-sm text-white/75">Написать администратору: {' '}
          <a href={contacts.social.telegramBooking} target="_blank" rel="noopener noreferrer" data-goal="click_telegram_booking" className="inline-flex min-h-11 items-center link-draw underline-offset-4">Telegram</a>{' · '}
          <a href={contacts.social.max} target="_blank" rel="noopener noreferrer" data-goal="click_max_booking" className="inline-flex min-h-11 items-center link-draw underline-offset-4">MAX</a>
        </p>

        <p className="reveal mt-8 border-t border-white/15 pt-8 text-white/75">
          Удобнее голосом? Позвоните{' '}
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="text-lg font-light text-white link-draw underline-offset-4 decoration-white/40 hover:decoration-white"
          >
            {contacts.phone.display}
          </a>
        </p>
      </div>
    </section>
  );
}
