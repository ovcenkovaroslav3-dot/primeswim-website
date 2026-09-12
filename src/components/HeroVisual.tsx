import { OrcaMark } from './OrcaMark';
import { Picture } from './Picture';

import { heroImage } from '@/content/media';

/*
  Визуальная половина первого экрана.

  ЗДЕСЬ БЫЛА ТРЁХМЕРНАЯ КОСАТКА-ПЕРСОНАЖ, и её сняли 13 сентября 2026.
  Она занимала на телефоне 520 px между кнопкой записи и первым
  доказательством — то есть полэкрана чистой декорации ровно в том месте,
  где родитель решает, читать дальше или закрыть. И она же задавала тон:
  улыбающийся мультяшный герой обещает кружок, а школа возит детей на
  старты и готовит разряды. Разбор — в шапке OrcaMark.tsx.

  Теперь главный визуал — настоящий кадр бассейна МГИК. Это единственное на
  экране, что нельзя подделать вёрсткой: родитель видит воду, дорожки и свет
  того зала, куда он приедет. Бренд держится знаком в углу кадра и крупным
  силуэтом в толще позади — присутствие есть, персонажа нет.

  ПРОПОРЦИИ РАЗНЫЕ ПО ШИРИНЕ ЭКРАНА, И ЭТО НЕ КОСМЕТИКА. На телефоне кадр
  идёт после кнопок и держит 4:3: вертикальный снимок там отодвинул бы
  полосу фактов и весь дальнейший разговор за третий экран. На десктопе он
  стоит справа от текста, места по вертикали не отнимает и разворачивается
  в исходные 3:4 — так в кадр попадает и вода, и остекление зала.
*/
export function HeroVisual({
  venue,
  district,
}: {
  venue: string;
  district: string;
}) {
  return (
    <figure className="reveal relative mx-auto w-full max-w-md md:max-w-none">
      {/*
        Силуэт в толще. Лежит под кадром и наполовину за ним — знак читается
        как что-то, что проходит мимо, а не как наклейка поверх фотографии.
        Крупный, но почти прозрачный: на тёмной воде это форма, а не пятно.
      */}
      <OrcaMark
        tone="white"
        tilt={-16}
        className="pointer-events-none absolute -top-10 -right-6 -z-10 w-[78%] opacity-[0.07] md:-top-16 md:-right-16 md:w-[92%]"
      />

      <div className="zoom-frame relative overflow-hidden rounded-[20px] border border-white/15 bg-abyss-900 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]">
        <Picture
          src={heroImage.src}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          priority
          sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 92vw"
          className="aspect-4/3 w-full object-cover md:aspect-3/4"
        />

        {/* подпись читается только по низу — затемняем ровно его */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-abyss-950/92"
        />

        {/*
          Знак в углу кадра. Маленький и на стекле — это подпись под
          фотографией, а не логотип поверх неё.
        */}
        <div className="glass absolute top-3 left-3 flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 sm:top-4 sm:left-4">
          <OrcaMark tone="white" className="w-5 shrink-0" />
          <span className="font-display text-[11px] leading-none font-extrabold tracking-tight text-white">
            PRIME SWIM
          </span>
        </div>

        <figcaption className="absolute inset-x-0 bottom-0 p-4 text-xs leading-snug text-white/85 sm:text-[13px]">
          {venue} · {district}
        </figcaption>
      </div>
    </figure>
  );
}
