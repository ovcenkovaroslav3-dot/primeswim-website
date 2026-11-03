import { MascotOrca } from './MascotOrca';
import { OrcaMark } from './OrcaMark';
import { Picture } from './Picture';
import { heroImage, heroImageNarrow } from '@/content/media';

export function HeroVisual() {
  return (
    <figure className="praimi-stage reveal relative mx-auto w-full max-w-md md:max-w-xl lg:max-w-none">
      <MascotOrca className="absolute -top-[12%] -right-[5%] z-20 w-[30%] drop-shadow-[0_20px_30px_rgba(11,1,20,0.5)] sm:w-[32%] lg:-top-[26%] lg:-right-[18%] lg:w-[74%]" />
      <div className="zoom-frame relative overflow-hidden rounded-card border border-white/15 bg-abyss-900 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)]">
        <Picture
          src={heroImage.src}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          narrow={heroImageNarrow}
          priority
          sizes="(min-width: 1280px) 26rem, (min-width: 1024px) 22rem, (min-width: 768px) 36rem, 92vw"
          className="aspect-4/3 w-full object-cover lg:aspect-3/4"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-abyss-950/92" />
        <div className="glass absolute top-3 left-3 flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 sm:top-4 sm:left-4">
          <OrcaMark tone="white" className="w-5 shrink-0" />
          <span className="font-display text-xs leading-none font-extrabold tracking-tight text-white">PRIME SWIM</span>
        </div>
        <figcaption className="absolute inset-x-0 bottom-0 p-4 text-xs leading-snug text-white/85">
          Тренировка PRIME SWIM · бассейн МГИК
        </figcaption>
      </div>
    </figure>
  );
}
