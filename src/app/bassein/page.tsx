import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Pool } from '@/components/sections/Pool';
import { Training } from '@/components/sections/Training';
import { seo } from '@/content/seo';

export const metadata: Metadata = {
  title: seo.pool.title,
  description: seo.pool.description,
  alternates: { canonical: seo.pool.path },
};

/*
  Бассейн и устройство занятия. «Что происходит в эти 45 минут» стоит
  здесь же: родитель, который смотрит, куда придёт ребёнок, тем же
  заходом узнаёт, как пройдёт занятие.
*/
export default function PoolPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Бассейн' },
          ]}
        />
      </div>

      <Pool headingAs="h1" />
      <Training />

      <FinalCta />
    </>
  );
}
