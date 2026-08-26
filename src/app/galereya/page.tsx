import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Gallery } from '@/components/sections/Gallery';
import { seo } from '@/content/seo';

export const metadata: Metadata = {
  title: seo.gallery.title,
  description: seo.gallery.description,
  alternates: { canonical: seo.gallery.path },
};

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
