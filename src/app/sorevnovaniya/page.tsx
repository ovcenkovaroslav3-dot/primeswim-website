import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogTeaser } from '@/components/sections/BlogTeaser';
import { FinalCta } from '@/components/sections/FinalCta';
import { Competitions } from '@/components/sections/Competitions';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.competitions);

/*
  Спортивное направление: старты, сборы, разряды.
*/
export default function CompetitionsPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[75rem] px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Соревнования' },
          ]}
        />
      </div>

      <Competitions headingAs="h1" />

      <BlogTeaser
        title="О разрядах и первых стартах"
        slugs={[
          'razryady-po-plavaniyu-normativy-detej',
          'pervye-sorevnovaniya-po-plavaniyu-deti',
        ]}
      />

      <FinalCta />
    </>
  );
}
