import Link from 'next/link';

import { WaterScene } from '../WaterScene';
import { contacts } from '@/content/contacts';
import { site } from '@/content/site';

/*
  Финальный экран.

  Намеренно рифмуется с первым: та же сцена воды, та же типографика, тот же
  акцент. Сайт открывается и закрывается одним и тем же образом, поэтому
  ощущается цельным, а не набором блоков.

  Сцена здесь та же самая, но вторая её копия не грузит устройство: обе
  останавливаются, когда уходят за пределы экрана, а между первым и
  последним экраном они никогда не видны одновременно.
*/
export function FinalCta() {
  return (
    <section
      id="start"
      aria-labelledby="start-title"
      className="on-dark relative isolate overflow-hidden bg-abyss-950 px-4 py-28 text-white sm:px-6 md:py-36"
    >
      <div className="absolute inset-0 -z-10">
        <WaterScene />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-abyss-950/70"
      />

      <div className="relative mx-auto w-full max-w-3xl text-center">
        <p className="reveal text-xs font-medium tracking-[0.28em] text-aqua-300 uppercase">
          Первый шаг
        </p>

        <h2
          id="start-title"
          className="reveal mt-6 text-[clamp(2.2rem,7vw,4.2rem)] leading-[1.02] font-extralight"
          style={{ ['--reveal-delay' as string]: '90ms' }}
        >
          Начните с первой тренировки
        </h2>

        <p
          className="reveal mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-white/70"
          style={{ ['--reveal-delay' as string]: '180ms' }}
        >
          Напишите нам — подберём группу по возрасту и уровню подготовки,
          назовём ближайшее свободное время и расскажем, что взять с собой.
        </p>

        <div
          className="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ ['--reveal-delay' as string]: '270ms' }}
        >
          <Link
            href="#booking"
            data-goal="cta_booking"
            className="glow-aqua inline-flex min-h-13 w-full items-center justify-center rounded-[10px] bg-aqua-400 px-8 text-[15px] font-semibold text-abyss-950 transition-colors duration-200 hover:bg-aqua-300 sm:w-auto"
          >
            {site.cta.primary}
          </Link>
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="inline-flex min-h-13 w-full items-center justify-center rounded-[10px] border border-white/25 px-8 text-[15px] font-medium text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10 sm:w-auto"
          >
            {contacts.phone.display}
          </a>
        </div>

        <p
          className="reveal mt-8 text-sm text-white/60"
          style={{ ['--reveal-delay' as string]: '340ms' }}
        >
          {contacts.address.short}
        </p>
      </div>
    </section>
  );
}
