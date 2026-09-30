import { ArrowLink, Section, SectionHeading } from '../ui';
import { programs } from '@/content/programs';

/*
  Чему учим в бассейне.

  Три одинаковые карточки читались плоско — три пункта меню, а не рассказ.
  Программы на самом деле идут по порядку, от новичка до спортсмена, и
  первая — «с нуля» — самая частая точка входа. Она и выделена крупной
  тёмной плашкой.

  ГЛАВНАЯ КАРТОЧКА ШИРЕ ОСТАЛЬНЫХ, А НЕ ВЫШЕ. Раньше она занимала две
  колонки и обе строки сетки, и высоту ей задавали две соседние плитки:
  на 1440 карточка выходила 606 px при 177 px содержимого — 349 px, почти
  три пятых, приходились на пустоту между текстом и подписью внизу.
  Выделять размером было верно, брать этот размер высотой — нет. Теперь
  все три стоят в одну строку, а первой отдана лишняя доля ширины.

  ВЫСОТА У КАЖДОЙ СВОЯ (items-start). Выровненные по низу карточки —
  верный приём, когда содержимого в них поровну; здесь не поровну, и
  выравнивание просто переносило пустоту из одной карточки в другие.
  По той же причине с абзацев снят flex-1: он растягивал текст до низа и
  выдавливал хайрлайн с подписью вниз, оставляя дыру посередине. Нижний
  край строки получился ступенчатым, и это честно — карточки правда
  разной длины, а разница читается как вес главной, а не как ошибка.

  Пустоту в главной карточке закрывает не только ширина: четыре шага
  первых занятий лежали в description одной строкой через запятую и
  теперь разложены списком (см. content/programs.ts). Родитель, который
  выбирает «с нуля», спрашивает ровно об этом.

  ТО ЖЕ ЛЕКАРСТВО ПРИМЕНЕНО К ДВУМ ПРАВЫМ КАРТОЧКАМ. Ступенька снизу —
  это вес, но 233 и 311 px против 451 читались уже не как вес, а как
  заглушки: три строки прозы, хайрлайн, подпись. Списки взяты из тех же
  файлов, что и страницы /trener/ и /sorevnovaniya/ (см. `points` в
  content/programs.ts), и отвечают на тот же вопрос, что и список в
  главной карточке: «а что там конкретно».

  СПИСКИ РАЗМЕЧЕНЫ ПО-РАЗНОМУ, И ЭТО НЕ РАЗНОБОЙ. В «с нуля» — <ol> с
  цифрами: занятия правда идут по порядку, и порядок здесь и есть ответ.
  В двух других — <ul> с тире: стили и старты со сборами делаются не по
  очереди, и пронумеровать их значило бы соврать про методику ради
  симметрии. Колонка маркера одной ширины у всех трёх (w-4, gap-3.5),
  поэтому строки стоят по одной сетке.

  ПОДПИСЬ «КОМУ ПОДХОДИТ» НАБРАНА ЧЕРНЫМ, А НЕ ФИОЛЕТОВЫМ. Она стояла
  в brand-600 — ровно тот же цвет, что у ArrowLink на светлой секции.
  В карточке «Спортивная подготовка» две фиолетовые строки лежали одна
  под другой, и кликалась только нижняя; в «Технике» фиолетовая строка
  была единственной и не кликалась вовсе. По DESIGN.md акцент живёт на
  действии и больше нигде — теперь в секции ровно одна фиолетовая
  строка, и она ссылка. На тёмной карточке та же подпись всегда была
  белой, то есть цвет и не означал «кому подходит».
*/
export function Programs() {
  const [first, ...rest] = programs;

  return (
    <Section id="programs" labelledBy="programs-title" className="bg-surface-alt">
      <SectionHeading
        id="programs-title"
        eyebrow="Цели"
        title="Три цели, с которыми к нам приходят"
        lead="Ребёнок попадает в группу по возрасту и уровню подготовки, поэтому программа подходит и новичку, и тому, кто уже плавает."
      />

      <ul className="mt-12 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr]">
        <li
          className="reveal relative overflow-clip rounded-[20px] bg-abyss-900 p-8 text-white sm:col-span-2 lg:col-span-1 lg:p-10"
          style={{ ['--reveal-delay' as string]: '60ms' }}
        >
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-brand-300/18 blur-3xl"
            style={{
              ['--parallax-from' as string]: '10%',
              ['--parallax-to' as string]: '-10%',
            }}
          />
          <div className="relative flex h-full flex-col">
            <h3 className="max-w-[18ch] text-2xl leading-tight font-light sm:text-3xl">
              {first.title}
            </h3>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-white/70">
              {first.description}
            </p>

            {first.steps ? (
              <ol className="mt-6 space-y-3.5">
                {first.steps.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-3.5">
                    <span
                      aria-hidden="true"
                      /*
                        Было white/35 — контраст 3,1 при требуемых 4,5.
                        Цифра дублирует порядок, который уже несёт <ol>,
                        но читает её глазами живой человек, и «декоративно»
                        не значит «можно не разглядеть».
                      */
                      className="w-4 shrink-0 text-sm tabular-nums text-white/55"
                    >
                      {i + 1}
                    </span>
                    <span className="text-white/85">{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}

            <p className="mt-8 border-t border-white/15 pt-5 text-sm font-medium text-white">
              {first.audience}
            </p>
          </div>
        </li>

        {rest.map((program, i) => (
          <li
            key={program.id}
            className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface p-7"
            style={{ ['--reveal-delay' as string]: `${140 + i * 80}ms` }}
          >
            <h3 className="text-xl font-light text-ink">{program.title}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              {program.description}
            </p>

            {program.points ? (
              <ul className="mt-6 space-y-3.5">
                {program.points.map((point) => (
                  <li key={point} className="flex items-baseline gap-3.5">
                    <span
                      aria-hidden="true"
                      className="w-4 shrink-0 text-sm text-ink-muted"
                    >
                      —
                    </span>
                    <span className="text-ink">{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-8 border-t border-hairline pt-5 text-sm font-medium text-ink">
              {program.audience}
            </p>

            {program.href ? (
              <ArrowLink href={program.href} className="mt-4 self-start">
                Старты, сборы и разряды
              </ArrowLink>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
