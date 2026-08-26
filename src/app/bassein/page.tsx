import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { Pool } from '@/components/sections/Pool';
import { Training } from '@/components/sections/Training';
import { StructuredData } from '@/components/StructuredData';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.pool);

/*
  Бассейн и устройство занятия. «Что происходит в эти 45 минут» стоит
  здесь же: родитель, который смотрит, куда придёт ребёнок, тем же
  заходом узнаёт, как пройдёт занятие.
*/
export default function PoolPage() {
  return (
    <>
      {/*
        Карточка организации размечена и здесь, а не только на главной.
        Это страница места: по запросам вида «бассейн МГИК» в выдачу
        попадает именно она, и поиск должен видеть адрес и координаты
        на той самой странице, которую показывает. Идентификатор у
        разметки общий с главной, поэтому вторая организация из этого
        не появляется — это одна и та же школа, описанная дважды.
      */}
      <StructuredData />
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Бассейн' },
          ]}
        />
      </div>

      <Pool headingAs="h1" />
      <Training />

      <FinalCta />
    </>
  );
}
