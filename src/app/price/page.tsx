import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Prices } from '@/components/sections/Prices';
import { seo } from '@/content/seo';

export const metadata: Metadata = {
  title: seo.prices.title,
  description: seo.prices.description,
  alternates: { canonical: seo.prices.path },
};

/*
  Стоимость. Второй по частоте вопрос после расписания.
*/
export default function PricesPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Стоимость' },
          ]}
        />
      </div>

      <Prices headingAs="h1" />

      <FinalCta />
    </>
  );
}
