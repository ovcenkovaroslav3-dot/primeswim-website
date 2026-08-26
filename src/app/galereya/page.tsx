import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Gallery } from '@/components/sections/Gallery';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.gallery);

/*
  Галерея. Самая тяжёлая секция сайта — 23 фотографии и 3 видео.
  На главной она одна давала треть длины страницы.
*/
export default function GalleryPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Галерея' },
          ]}
        />
      </div>

      <Gallery headingAs="h1" />

      <FinalCta />
    </>
  );
}
