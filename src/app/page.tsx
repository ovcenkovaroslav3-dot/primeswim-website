import { Hero } from '@/components/sections/Hero';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { Programs } from '@/components/sections/Programs';
import { PlanPreview } from '@/components/sections/PlanPreview';
import { CoachPreview } from '@/components/sections/CoachPreview';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { Reviews } from '@/components/sections/Reviews';
import { PoolPreview } from '@/components/sections/PoolPreview';
import { Faq } from '@/components/sections/Faq';
import { Contacts } from '@/components/sections/Contacts';
import { FinalCta } from '@/components/sections/FinalCta';
import { StructuredData } from '@/components/StructuredData';

/*
  Главная.

  ПОРЯДОК ЗДЕСЬ — ЭТО РАЗГОВОР С РОДИТЕЛЕМ, А НЕ ОГЛАВЛЕНИЕ САЙТА.

  Раньше страница шла от общего к частному: обещание, чем школа отличается,
  направления, путь ребёнка, техника, отзывы, список разделов — и только
  потом форма. Всё верно по смыслу и всё мимо по порядку. Решающие для
  родителя вещи — когда занятия, сколько стоит, кто тренер, как выглядит
  бассейн — на главной не показывались вовсе: за ними надо было уйти на
  отдельную страницу, догадавшись, что она есть.

  Теперь так:

   1. Hero            — что, для кого, где и почём первый шаг.
   2. ProofStrip      — короткие проверяемые основания поверить.
   3. Programs        — три цели, с которыми приходят: с нуля, техника, спорт.
   4. PlanPreview     — расписание и стоимость, два первых вопроса.
   5. CoachPreview    — кто будет стоять у бортика.
   6. GalleryPreview  — восемь кадров: школа существует и выигрывает старты.
   7. Reviews         — что говорят родители, со ссылкой на источник.
   8. PoolPreview     — куда ехать и как узнать место с улицы.
   9. Faq             — оставшиеся сомнения, короткой выборкой.
  10. FinalCta        — форма и мессенджеры.
  11. Contacts        — адрес, телефон, каналы.

  Аргументы идут от самых конкретных к самым мягким. Родитель, который
  ушёл после четвёртого блока, уже знает время, цену и место — то есть
  получил то, за чем пришёл, даже если не долистал.

  ЧТО УБРАНО И КУДА. Возвращать сюда всё подряд нельзя — главная уже была
  бесконечной лентой из семнадцати секций. Три секции переехали туда, где
  их действительно читают:

    Why      → /roditelyam/ (почему эта школа)
    Progress → /roditelyam/ (что будет с ребёнком)
    Strokes  → /trener/     (что именно ставит тренер)

  Блок «Что ещё есть на сайте» убран совсем: после пяти настоящих превью
  со ссылками он повторял бы то же самое ещё раз. Сквозные ссылки на все
  разделы остались в подвале.

  Чередование тёмных и светлых секций сохранено: ProofStrip, CoachPreview,
  PoolPreview и FinalCta — тёмные, между ними светлые. Четыре светлые
  секции подряд ломали бы ритм, который выправляли отдельной правкой.
*/
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <ProofStrip />
      <Programs />
      <PlanPreview />
      <CoachPreview />
      <GalleryPreview />
      {/*
        Четыре отзыва из шести: все шесть занимали на телефоне 1 700 px и
        вставали долгой паузой ровно там, где родитель уже почти решил.
        Ссылка на карточку школы под блоком ведёт ко всем.
      */}
      <Reviews limit={4} />
      <PoolPreview />
      {/*
        Короткая выборка и без разметки FAQPage: полную отдаёт /roditelyam/,
        и два адреса с одной и той же разметкой конкурировали бы друг с
        другом за расширенный сниппет. Подробности — в самом компоненте.
      */}
      <Faq limit={4} withSchema={false} moreHref="/roditelyam/" />
      <FinalCta variant="water" />
      <Contacts />
    </>
  );
}
