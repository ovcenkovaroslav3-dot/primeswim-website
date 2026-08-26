import { Hero } from '@/components/sections/Hero';
import { Why } from '@/components/sections/Why';
import { Programs } from '@/components/sections/Programs';
import { Progress } from '@/components/sections/Progress';
import { Strokes } from '@/components/sections/Strokes';
import { Reviews } from '@/components/sections/Reviews';
import { Contacts } from '@/components/sections/Contacts';
import { FinalCta } from '@/components/sections/FinalCta';
import { SiteMap } from '@/components/SiteMap';
import { StructuredData } from '@/components/StructuredData';

/*
  Главная.

  Раньше сюда сваливался весь сайт — семнадцать секций и почти 27 000 px
  на телефоне. Разделы, у которых есть собственный поисковый запрос
  (расписание, цены, тренер, бассейн, галерея, соревнования, родителям),
  вынесены на свои адреса: у каждого теперь свой title и своя точка входа
  из поиска, а главная перестала быть бесконечной лентой.

  Здесь остаётся то, что продаёт и доказывает: обещание, чем школа
  отличается, направления, путь ребёнка, техника и отзывы. Ссылки на
  вынесенные разделы собраны в SiteMap перед формой записи — навигация в
  шапке на телефоне спрятана в меню, и без этого блока разделы было бы
  легко не заметить.

  Чередование тёмных и светлых секций сохранено намеренно: Progress —
  тёмный, и без него после первого экрана шли бы четыре светлые секции
  подряд. Этот ритм выправляли отдельной правкой, ломать его разбивкой
  на страницы незачем.
*/
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Why />
      <Programs />
      <Progress />
      <Strokes />
      <Reviews />
      <SiteMap />
      <FinalCta variant="water" />
      <Contacts />
    </>
  );
}
