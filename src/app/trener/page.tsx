import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Coaches } from '@/components/sections/Coaches';
import { seo } from '@/content/seo';

export const metadata: Metadata = {
  title: seo.coach.title,
  description: seo.coach.description,
  alternates: { canonical: seo.coach.path },
};

/*
  Тренер. Ярослав ведёт занятия лично, поэтому страница про него —
  это страница про саму услугу, а не справка о персонале.
*/
export default function CoachPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Тренер' },
          ]}
        />
      </div>

      <Coaches headingAs="h1" />

      <FinalCta />
    </>
  );
}
