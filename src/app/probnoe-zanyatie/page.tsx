import type { Metadata } from 'next';

import { FinalCta } from '@/components/sections/FinalCta';
import { Faq } from '@/components/sections/Faq';
import { Reviews } from '@/components/sections/Reviews';
import { TrialHero, TrialRoute, TrialWhy } from '@/components/sections/TrialLanding';
import { pageMetadata, seo } from '@/content/seo';

/*
  Посадочная для рекламы в Яндекс Директе. Подробности: docs/direct-landing.md.

  noindex, follow: страница нужна только тем, кто пришёл из объявления, и
  не должна конкурировать с главной в выдаче. В sitemap её нет, а в robots.txt
  она НЕ закрыта: закрытую страницу робот не откроет и директиву noindex не
  увидит. Canonical на саму себя (его даёт pageMetadata).
*/
export const metadata: Metadata = {
  ...pageMetadata(seo.trialLanding),
  robots: { index: false, follow: true },
};

export default function TrialLandingPage() {
  return (
    <>
      <TrialHero />
      <FinalCta compact />
      <TrialWhy />
      <Reviews />
      <TrialRoute />
      <Faq ids={['medical', 'what-to-bring', 'age', 'trial']} withSchema={false} />
    </>
  );
}
