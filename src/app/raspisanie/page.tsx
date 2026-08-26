import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Schedule } from '@/components/sections/Schedule';
import { seo } from '@/content/seo';

export const metadata: Metadata = {
  title: seo.schedule.title,
  description: seo.schedule.description,
  alternates: { canonical: seo.schedule.path },
};

/*
  Расписание отдельной страницей: это первый вопрос родителя и
  самостоятельный поисковый запрос.
*/
export default function SchedulePage() {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Расписание' },
          ]}
        />
      </div>

      <Schedule headingAs="h1" />

      <FinalCta />
    </>
  );
}
