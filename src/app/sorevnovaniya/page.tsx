import { Breadcrumbs } from '@/components/Breadcrumbs';
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
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Соревнования' },
          ]}
        />
      </div>

      <Competitions headingAs="h1" />

      <FinalCta />
    </>
  );
}
