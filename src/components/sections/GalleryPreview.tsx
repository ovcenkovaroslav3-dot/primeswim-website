import { Picture } from '../Picture';
import { ArrowLink, Section } from '../ui';
import { galleryGridImages } from '@/content/media';

const stories = [
  { name: 'mgik-warmup-close.jpg', caption: 'Разминка перед тренировкой', position: 'object-[center_25%]' },
  { name: 'mgik-kids-at-edge-kickboards.jpg', caption: 'Упражнения у бортика', position: 'object-[center_65%]' },
  { name: 'mgik-lanes-swimmers-edge.jpg', caption: 'Плавание по дорожкам', position: 'object-[center_70%]' },
];

export function GalleryPreview() {
  return (
    <Section id="gallery-preview" labelledBy="gallery-preview-title" className="bg-surface-alt [overflow-wrap:anywhere]">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-end md:gap-12">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">Как это выглядит</p>
          <h2 id="gallery-preview-title" className="mt-4 text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl md:text-[44px]">Тренировки в бассейне</h2>
        </div>
        <div>
          <p className="leading-relaxed text-ink-soft">Разминка и занятия в воде в бассейне МГИК.</p>
          <ArrowLink href="/galereya/" className="mt-4">Все фото и видео с тренировок</ArrowLink>
        </div>
      </div>
      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
        {stories.map((story, i) => {
          const photo = galleryGridImages.find((image) => image.src.endsWith(story.name));
          if (!photo) return null;
          return (
            <li key={photo.src} className={`reveal ${i === 0 ? 'md:col-span-7 md:row-span-2' : 'md:col-span-5'}`}>
              <figure className="flex h-full flex-col">
                <div className={`zoom-frame relative aspect-[4/3] overflow-hidden rounded-card bg-surface ${i === 0 ? 'md:aspect-auto md:flex-1' : 'md:aspect-[16/9]'}`}>
                  <Picture src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 768px) 100vw, 60vw" className={`absolute inset-0 size-full object-cover ${story.position}`} />
                </div>
                <figcaption className="mt-3 flex gap-4 border-t border-hairline pt-3 text-sm font-medium text-ink"><span aria-hidden="true" className="tabular-nums text-ink-muted">0{i + 1}</span>{story.caption}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
