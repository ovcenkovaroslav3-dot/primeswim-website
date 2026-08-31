import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Faq } from '@/components/sections/Faq';
import { Parents } from '@/components/sections/Parents';
import { Progress } from '@/components/sections/Progress';
import { Why } from '@/components/sections/Why';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.parents);

/*
  Родителям.

  Один разговор на разной глубине: с каким уровнем приходить → почему
  именно эта школа → что будет происходить с ребёнком → частые вопросы.

  «Почему мы» и «Путь ребёнка» переехали сюда с главной. Оба текста
  хорошие, но требуют чтения, а на главной они стояли раньше расписания,
  цены и тренера — то есть отодвигали вниз всё, ради чего человек пришёл.
  Здесь их читает тот, кто уже заинтересовался и хочет разобраться.

  FAQ отдаёт разметку FAQPage — по умолчанию, и это единственное место на
  сайте, где она должна отдаваться. На главной стоит короткая выборка без
  разметки.
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
      <Why />
      <Progress />
      <Faq />

      <FinalCta />
    </>
  );
}
