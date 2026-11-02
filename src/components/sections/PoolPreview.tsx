import { Picture } from '../Picture';
import { ArrowLink, ButtonLink } from '../ui';
import { contacts } from '@/content/contacts';
import { venuePreviewImages } from '@/content/media';

export function PoolPreview() {
  const [building, gate] = venuePreviewImages;

  return (
    <section id="pool-preview" aria-labelledby="pool-preview-title" className="on-dark relative overflow-clip bg-abyss-950 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-28">
      <div aria-hidden="true" className="parallax pointer-events-none absolute -top-32 -left-24 size-[30rem] rounded-full bg-brand-500/18 blur-3xl" style={{ ['--parallax-from' as string]: '-12%', ['--parallax-to' as string]: '12%' }} />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="reveal">
          <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">Где занимаемся</p>
          <h2 id="pool-preview-title" className="mt-4 text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl">Бассейн МГИК в Химках</h2>
          <address className="mt-6 text-lg leading-relaxed text-white/80 not-italic">
            {contacts.address.region}, г. {contacts.address.city}, {contacts.address.district}<br />{contacts.address.street}
          </address>
          <p className="mt-4 leading-relaxed text-white/70">Шесть дорожек по 25 метров. Все группы школы занимаются здесь.</p>
          <p className="mt-3 leading-relaxed text-white/70">Вход через проходную с Библиотечной или Совхозной улицы. На охране скажите, что вы к тренеру Овченкову Ярославу Сергеевичу.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={contacts.address.yandexMaps} external variant="outline" data-goal="click_route">Построить маршрут</ButtonLink>
            <ArrowLink href="/bassein/" tone="white">Как пройти к бассейну</ArrowLink>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[building, gate].filter(Boolean).map((photo, i) => (
            <div key={photo.src} className="reveal zoom-frame relative aspect-[4/3] overflow-hidden rounded-card bg-abyss-800 lg:aspect-[3/4]" style={{ ['--reveal-delay' as string]: `${80 + i * 80}ms` }}>
              <Picture src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 1024px) 50vw, 25vw" className={`absolute inset-0 size-full object-cover ${i === 1 ? 'object-[50%_20%]' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
