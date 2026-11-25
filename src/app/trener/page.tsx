import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BlogTeaser } from '@/components/sections/BlogTeaser';
import { CoachMethod } from '@/components/sections/CoachMethod';
import { Coaches } from '@/components/sections/Coaches';
import { FinalCta } from '@/components/sections/FinalCta';
import { Reviews } from '@/components/sections/Reviews';
import { Strokes } from '@/components/sections/Strokes';
import { JsonLd, schemaId } from '@/components/StructuredData';
import { buildCoachProfile } from '@/content/coach-schema';
import { coachReviewIds } from '@/content/coach-reviews';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.coach);

/*
  Тренер. Ярослав ведёт занятия лично, поэтому страница про него —
  это страница про саму услугу, а не справка о персонале. Она же — страница
  автора для всех статей блога (Person с тем же @id стоит в их разметке).

  Разбор четырёх стилей переехал сюда с главной: техника — это ровно то,
  что тренер ставит, и рассказ о ней на странице тренера отвечает на
  вопрос «чему именно он научит», а не висит отдельной витриной.

  Всё содержимое — из подтверждённых фактов репозитория. Диплом, год КМС,
  результаты учеников сюда не попадают, пока владелец их не подтвердил
  (список — в content/coaches.ts).
*/
export default function CoachPage() {
  return (
    <>
      <JsonLd
        data={buildCoachProfile({
          organization: schemaId.organization,
          person: schemaId.person,
        })}
      />

      <div className="mx-auto w-full max-w-[75rem] px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Тренер' },
          ]}
        />
      </div>

      <Coaches headingAs="h1" />
      <CoachMethod />
      <Strokes />

      <Reviews
        ids={coachReviewIds}
        tone="alt"
        showCta={false}
        eyebrow="Отзывы"
        title="Родители о тренере"
        lead="Отзывы на Яндекс Картах, в которых родители называют Ярослава Сергеевича по имени. Полные тексты — в карточке школы."
      />

      <BlogTeaser
        title="Статьи тренера"
        slugs={[
          's-kakogo-vozrasta-otdavat-rebenka-v-bassein',
          'rebenok-boitsya-vody-chto-delat',
          'skolko-vremeni-nauchit-rebenka-plavat',
          'stili-plavaniya-dlya-detej',
        ]}
      />

      <FinalCta />
    </>
  );
}
