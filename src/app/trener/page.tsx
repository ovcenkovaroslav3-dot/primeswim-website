import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Coaches } from '@/components/sections/Coaches';
import { Strokes } from '@/components/sections/Strokes';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.coach);

/*
  Тренер. Ярослав ведёт занятия лично, поэтому страница про него —
  это страница про саму услугу, а не справка о персонале.

  Разбор четырёх стилей переехал сюда с главной: техника — это ровно то,
  что тренер ставит, и рассказ о ней на странице тренера отвечает на
  вопрос «чему именно он научит», а не висит отдельной витриной.
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
      <Strokes />

      <FinalCta />
    </>
  );
}
