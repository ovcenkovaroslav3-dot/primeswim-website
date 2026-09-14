import { ArrowLink, ButtonLink, Section, SectionHeading } from '../ui';
import { schedule } from '@/content/schedule';
import { prices, pricesNote } from '@/content/prices';

/*
  Расписание и стоимость рядом — самый нужный блок главной.

  Это два первых вопроса родителя, и раньше ответ на оба лежал за
  переходом: на главной их не было вовсе, только ссылка в общем списке
  разделов. Человек, пришедший с рекламы, должен был догадаться уйти на
  другую страницу — часть уходила вообще.

  Здесь ровно то, что нужно для решения: когда занятия и сколько стоит.
  Всё остальное — недели целиком, оговорки по абонементу, скидки, условия
  переноса — осталось на /raspisanie/ и /price/, куда ведут обе ссылки.
  Блок специально не превращается в третью копию этих страниц: копия
  устареет отдельно от оригинала.

  Данные берутся из тех же файлов, что и полные страницы. Поправить цену
  в одном месте и забыть про главную здесь невозможно.

  Списки не растянуты по высоте. С flex-1 более короткий из двух — тарифы,
  их три против четырёх дней расписания — дотягивался до низа карточки и
  выдавливал сноску со ссылкой вниз, оставляя дыру посередине. Теперь
  лишняя высота, которую даёт выравнивание карточек, уходит под низ и
  читается полем, а не пропуском.
*/
export function PlanPreview() {
  return (
    <Section id="plan" labelledBy="plan-title" className="bg-surface">
      <SectionHeading
        id="plan-title"
        eyebrow="Когда и сколько"
        title="Расписание и стоимость"
        lead="Занятия идут четыре дня в неделю в бассейне МГИК, по будням — две группы подряд. Группу подберём по возрасту и уровню подготовки ребёнка."
      />

      <div className="mt-10 grid gap-4 sm:mt-12 lg:grid-cols-2">
        {/* расписание */}
        <div className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-6 sm:p-8">
          <h3 className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Расписание
          </h3>

          <ul className="mt-6 divide-y divide-hairline">
            {schedule.map((slot) => (
              <li
                key={slot.id}
                className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0"
              >
                <span className="text-ink-soft">{slot.day}</span>
                <span className="text-right">
                  {slot.times.map((time) => (
                    <span
                      key={time}
                      className="block text-lg font-light tabular-nums text-ink"
                    >
                      {time}
                    </span>
                  ))}
                  <span className="block text-xs text-ink-muted">
                    {slot.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-hairline pt-5 text-sm text-ink-muted">
            Тренировка — 45 минут, группа до 12 человек.
          </p>

          <ArrowLink
            href="/raspisanie/"
            data-goal="cta_schedule"
            className="mt-5 self-start"
          >
            Всё расписание
          </ArrowLink>
        </div>

        {/* стоимость */}
        <div className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-6 sm:p-8">
          <h3 className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            Стоимость
          </h3>

          <ul className="mt-6 divide-y divide-hairline">
            {prices.map((price) => (
              <li
                key={price.id}
                className="flex items-baseline justify-between gap-4 py-3.5 first:pt-0"
              >
                <span className="text-ink-soft">
                  {price.title}
                  <span className="block text-xs text-ink-muted">
                    {price.note}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span
                    className={`text-lg font-light tabular-nums ${
                      price.featured ? 'text-brand-600' : 'text-ink'
                    }`}
                  >
                    {price.amount.toLocaleString('ru-RU')} ₽
                  </span>
                  {price.unit ? (
                    <span className="block text-xs text-ink-muted">
                      {price.unit}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-hairline pt-5 text-sm text-ink-muted">
            {pricesNote}
          </p>

          <ArrowLink href="/price/" className="mt-5 self-start">
            Условия оплаты и абонемента
          </ArrowLink>
        </div>
      </div>

      {/*
        Запись стоит ровно здесь, и это единственная кнопка между первым
        экраном и финальной формой.

        Раньше между ними не было ничего: родитель прокручивал время, цену,
        тренера, галерею и бассейн — пять экранов — и всё это время
        единственной кнопкой под рукой оставалась липкая панель на телефоне.
        На десктопе не было и её: только кнопка в шапке, которую на прокрутке
        не ищут.

        Именно после расписания и стоимости, а не после тренера или галереи:
        человек только что получил ответ на два вопроса, с которыми пришёл, и
        это первый момент, когда «записаться» — следующий по смыслу шаг, а не
        перебивка. Дальше по странице идут доводы, а не решения.

        Плашка фиолетовая внутри светлой секции, а не отдельной тёмной полосой:
        ритм чередования полос (см. page.tsx) требует, чтобы за двумя светлыми
        секциями шла тёмная — CoachPreview. Своя тёмная полоса перед ней дала
        бы две тёмные подряд и сломала бы разбивку страницы.
      */}
      <div className="reveal mt-4 flex flex-col gap-6 rounded-[20px] bg-brand-600 p-7 text-white sm:p-9 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="min-w-0">
          <p className="text-xl leading-snug font-light sm:text-2xl">
            Подберём группу по возрасту и уровню подготовки
          </p>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-white/70">
            Напишите — назовём ближайшее свободное время и ответим на вопросы
            до первого занятия.
          </p>
        </div>

        <ButtonLink
          href="#booking"
          variant="secondary"
          size="lg"
          data-goal="cta_booking"
          className="shrink-0"
        >
          Записаться на пробное занятие
        </ButtonLink>
      </div>
    </Section>
  );
}
