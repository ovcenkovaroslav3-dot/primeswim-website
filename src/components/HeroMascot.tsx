import { MascotPointer } from './MascotPointer';
import { Picture } from './Picture';

import { heroImage, mascot } from '@/content/media';
import imageLoader from '@/lib/image-loader';

/*
  WebP уже подготовлен ровно в размере показа и должен пройти через тот же
  статический basePath, что и остальные public-ресурсы. next/image здесь не
  даёт оптимизации, а только размножает один файл в одинаковый srcset.
*/
/* eslint-disable @next/next/no-img-element */

export function HeroMascot({
  venue,
  district,
}: {
  venue: string;
  district: string;
}) {
  const mascotSrc = imageLoader({ src: mascot.src });

  return (
    <figure className="mascot-stage reveal relative mx-auto w-full max-w-sm md:max-w-none">
      <svg
        aria-hidden="true"
        className="absolute h-0 w-0"
        focusable="false"
      >
        <defs>
          <filter id="mascot-water-warp" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.009 0.034"
              numOctaves="2"
              seed="7"
              result="waterNoise"
            >
              <animate
                attributeName="baseFrequency"
                dur="3.8s"
                values="0.009 0.034;0.014 0.046;0.009 0.034"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="waterNoise"
              scale="10"
              xChannelSelector="B"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <span aria-hidden="true" className="mascot-aura" />
      <span aria-hidden="true" className="mascot-trident-glow" />

      {/*
        Реальная площадка остаётся на первом экране как доказательство места.
        Маскот отвечает за узнаваемость бренда, но не подменяет собой бассейн.
      */}
      <div className="mascot-venue-card absolute bottom-5 left-0 z-10 w-[62%] overflow-hidden rounded-[18px] border border-white/20 shadow-[0_28px_64px_-30px_rgba(0,0,0,0.95)] sm:w-[58%] md:bottom-7">
        <Picture
          src={heroImage.src}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          priority
          sizes="(min-width: 1024px) 15rem, (min-width: 768px) 13rem, 13rem"
          className="h-44 w-full object-cover sm:h-52 md:h-56"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-abyss-950/95"
        />
        <figcaption className="absolute inset-x-0 bottom-0 p-3 text-[11px] leading-snug text-white/85 sm:p-4 sm:text-xs">
          {venue} · {district}
        </figcaption>
      </div>

      <div className="mascot-tilt pointer-events-none absolute -top-2 -right-[7%] z-20 w-[89%] sm:-right-[3%] sm:w-[86%] md:-top-4 md:-right-[9%] md:w-[96%] lg:-right-[7%]">
        <div className="mascot-float">
          <div className="mascot-motion-surface relative">
            <img
              src={mascotSrc}
              alt={mascot.alt}
              width={mascot.width}
              height={mascot.height}
              decoding="async"
              fetchPriority="low"
              className="h-auto w-full select-none"
            />
                        <img
              aria-hidden="true"
              src={mascotSrc}
              alt=""
              width={mascot.width}
              height={mascot.height}
              decoding="async"
              draggable="false"
              className="mascot-water-motion absolute inset-0 h-auto w-full select-none"
            />

            {/*
              Блик. Маской служит сам WebP: светлая полоса видна только там,
              где у картинки непрозрачные пиксели, поэтому свет идёт по
              силуэту, а не по прямоугольнику вокруг него.
            */}
            <span
              aria-hidden="true"
              className="mascot-shine absolute inset-0"
              style={{
                maskImage: `url(${mascotSrc})`,
                WebkitMaskImage: `url(${mascotSrc})`,
              }}
            />
          </div>
        </div>
      </div>

      <span aria-hidden="true" className="mascot-ripple mascot-ripple-one" />
      <span aria-hidden="true" className="mascot-ripple mascot-ripple-two" />

      {/*
        Пузырьки из водяного вихря. Шесть штук достаточно, чтобы вихрь
        перестал читаться как застывшая картинка: каждый идёт своим путём,
        со своей задержкой и скоростью, и цикл не выглядит зациклённым.
      */}
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <span
          key={n}
          aria-hidden="true"
          className={`mascot-bubble mascot-bubble-${n}`}
        />
      ))}

      <MascotPointer />
    </figure>
  );
}
