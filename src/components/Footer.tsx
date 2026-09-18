import Link from 'next/link';

import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';
import { sectionLinks } from '@/content/sections';
import { contacts } from '@/content/contacts';
import { site } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-abyss-900 text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {site.tagline}. Групповые занятия для детей в бассейне МГИК.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Контакты
            </h2>
            {/*
              ЗОНА НАЖАТИЯ 44 px ЗДЕСЬ БЕРЁТСЯ ОТРИЦАТЕЛЬНЫМ ОТСТУПОМ, А В
              СОСЕДНЕМ СТОЛБЦЕ «РАЗДЕЛЫ» — НЕТ, И ЭТО НЕ РАЗНОБОЙ.

              Приём работает, только когда между действиями есть что забрать.
              Здесь ссылок две, и между ними лежит строка адреса — обычный
              текст, в который никто не целится: после отрицательного отступа
              между зонами остаётся 12 px, и промахнуться в соседнюю нельзя.

              В «Разделах» ссылки идут подряд. Тот же приём наложил бы зоны
              друг на друга на 8 px, и палец, метивший в «Галерею», попадал бы
              в «Родителям» — это хуже мелкой зоны, а не лучше. Поэтому там
              высота набирается по-настоящему, а под мышью снимается обратно;
              почему — в комментарии у самого списка.
            */}
            <ul className="mt-4 space-y-1 text-sm text-white/80">
              <li>
                {/* цели те же, что и везде: подвал стоит на каждой странице,
                    и без разметки его клики просто не попадали в отчёт */}
                <a
                  href={contacts.phone.href}
                  data-goal="click_phone"
                  className="-my-2 inline-flex min-h-11 items-center font-medium text-white transition-colors hover:text-lime-300"
                >
                  {contacts.phone.display}
                </a>
              </li>
              <li>{contacts.address.short}</li>
              <li>
                <a
                  href={contacts.address.yandexMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-goal="click_route"
                  className="-my-2 inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-lime-300"
                >
                  Посмотреть на Яндекс Картах
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <SocialLinks inverted />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Разделы
            </h2>
            {/*
              Все разделы, а не два.

              Раньше отсюда вели ссылки только на расписание и стоимость.
              На тренера, бассейн, соревнования, галерею и страницу для
              родителей сквозной ссылки не было вовсе: попасть туда можно
              было только с главной, через блок «Что ещё есть на сайте».
              Для поиска это значило, что пять страниц из восьми держатся
              на одной-единственной ссылке — а вес страницы во многом и
              складывается из того, сколько раз на неё ссылаются внутри
              сайта.

              Список лежит в content/sections.ts. Блок «Что ещё есть на
              сайте» с главной убран — там теперь настоящие превью разделов
              со ссылками, — но подвал остался единственной сквозной ссылкой
              на «Соревнования» и потому важнее прежнего.

              Адрес политики со слешем на конце: сборка настроена на
              trailingSlash, и без него переход шёл лишним редиректом.

              prefetch={false} на всех девяти: подвал есть на каждой
              странице и всегда лежит ниже экрана, а Next по умолчанию
              тянет полезную нагрузку каждого маршрута, до которого
              долистали. На главной это давало 376 KiB фоновой закачки
              на восемь страниц, из которых посетитель откроет одну.
              По наведению и касанию маршрут всё равно догружается —
              то есть при настоящем намерении скорость не теряется.
            */}
            {/*
              ОДИННАДЦАТЬ ССЫЛОК ПО 44 px ПОД ПАЛЬЦЕМ И ПО 28 ПОД МЫШЬЮ.

              Стояли 28 — при собственном правиле сайта в 44. Ошибка тем
              обиднее, что правило родилось ровно из такого замера: семь
              ссылок «Всё расписание →» были ростом 28, их подняли через
              ArrowLink, а подвал — самый частый список ссылок на сайте, он
              стоит на каждой из одиннадцати страниц, — так и остался.

              Наложить зоны отрицательным отступом, как у соседнего столбца,
              здесь нельзя: ссылки идут подряд. Значит, высоту приходится
              набирать по-настоящему, а это +176 px подвала.

              На телефоне эти 176 px ничего не стоят: подвал лежит ниже
              всего остального, а список наконец нажимается. На десктопе
              они стоили заметно — столбец разъезжался на 824 px, и рядом
              с ним два коротких столбца превращались в дыру.

              Отсюда `pointer-fine`: под мышью шаг возвращается к прежним
              28 px (подвал снова 648), под пальцем остаётся 44. Это не
              лазейка в правиле, а его собственное обоснование: в DESIGN.md
              44 px объяснены подушечкой пальца, и у мыши такой подушечки
              нет. 28 px при этом выше минимума WCAG 2.5.8 (24).

              Запасной вариант безопасный: если вариант `pointer-fine`
              однажды перестанет собираться, класс просто не появится и
              везде останется 44 — то есть сломается в сторону доступности,
              а не от неё.
            */}
            <ul className="mt-4 space-y-1 text-sm text-white/80">
              {sectionLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="flex min-h-11 items-center transition-colors pointer-fine:min-h-0 pointer-fine:py-1 hover:text-lime-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="#booking"
                  className="flex min-h-11 items-center transition-colors pointer-fine:min-h-0 pointer-fine:py-1 hover:text-lime-300"
                >
                  Запись на тренировку
                </Link>
              </li>
              <li>
                <Link
                  href="/dogovor/"
                  prefetch={false}
                  className="flex min-h-11 items-center transition-colors pointer-fine:min-h-0 pointer-fine:py-1 hover:text-lime-300"
                >
                  Договор на занятия
                </Link>
              </li>
              <li>
                <Link
                  href="/policy/"
                  prefetch={false}
                  className="flex min-h-11 items-center transition-colors pointer-fine:min-h-0 pointer-fine:py-1 hover:text-lime-300"
                >
                  Политика обработки персональных данных
                </Link>
              </li>
              <li>
                <Link
                  href="/soglasie/"
                  prefetch={false}
                  className="flex min-h-11 items-center transition-colors pointer-fine:min-h-0 pointer-fine:py-1 hover:text-lime-300"
                >
                  Согласие на обработку персональных данных
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/*
          Сведения об исполнителе. Статья 9 Закона «О защите прав
          потребителей» требует показать их самому потребителю, а не прятать
          в политике: ФИО предпринимателя, данные о госрегистрации,
          наименование зарегистрировавшего органа и режим работы.
        */}
        <div className="mt-12 space-y-3 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/55">
          <p>
            {contacts.legal.operator}. ОГРНИП {contacts.legal.ogrnip}, ИНН{' '}
            {contacts.legal.inn}. Зарегистрирован:{' '}
            {contacts.legal.registrar}.
          </p>
          <p>
            Режим работы: {contacts.workingHours.display}. Место оказания услуг:{' '}
            {contacts.address.full}.
          </p>
          <p>
            © {year} {site.name}. Информация на сайте не является публичной
            офертой.
          </p>
        </div>
      </div>
    </footer>
  );
}
