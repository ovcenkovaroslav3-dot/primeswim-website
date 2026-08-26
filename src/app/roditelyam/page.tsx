import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Faq } from '@/components/sections/Faq';
import { Parents } from '@/components/sections/Parents';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.parents);

/*
  Родителям. Сомнения на входе и частые вопросы — рядом: это один
  и тот же разговор, просто на разной глубине.
*/
export default function ParentsPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Родителям' },
          ]}
        />
      </div>

      <Parents headingAs="h1" />
      <Faq />

      <FinalCta />
    </>
  );
}
