import { Section, SectionHeading } from "../ui";
import { advantages } from "@/content/method";

/*
  Почему PRIME SWIM.

  Сознательно не ряд одинаковых карточек: первый пункт несёт главное
  обещание школы и занимает крупную тёмную плашку, остальные идут светлыми
  плитками вокруг. Так у блока появляется точка входа для взгляда.
*/
export function Why() {
  const [lead, ...rest] = advantages;

  return (
    <Section id="why" labelledBy="why-title" className="bg-surface">
      <SectionHeading
        id="why-title"
        eyebrow="Почему мы"
        size="statement"
        title="Плавание как навык, а не как развлечение"
        lead="Разница между «ребёнок держится на воде» и «ребёнок плавает» — это техника. Мы строим занятие вокруг неё."
      />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* главный пункт: тёмная плашка с подсветкой, занимает две колонки */}
        <li
          className="reveal relative overflow-clip rounded-[20px] bg-abyss-900 p-8 text-white sm:col-span-2 sm:p-10"
          style={{ ["--reveal-delay" as string]: "60ms" }}
        >
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-brand-300/18 blur-3xl"
            style={{
              ["--parallax-from" as string]: "10%",
              ["--parallax-to" as string]: "-10%",
            }}
          />
          <div
            aria-hidden="true"
            className="parallax pointer-events-none absolute -bottom-28 -left-10 size-56 rounded-full bg-brand-500/25 blur-3xl"
            style={{
              ["--parallax-from" as string]: "-14%",
              ["--parallax-to" as string]: "14%",
            }}
          />
          <div className="relative">
            <h3 className="max-w-[18ch] text-2xl leading-tight font-light sm:text-3xl">
              {lead.title}
            </h3>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-white/70">
              {lead.description}
            </p>
          </div>
        </li>

        {rest.map((item, i) => (
          <li
            key={item.id}
            className="reveal flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-7"
            style={{ ["--reveal-delay" as string]: `${120 + i * 70}ms` }}
          >
            {item.metric ? (
              <p className="mb-5 flex items-baseline gap-2">
                <span className="text-4xl font-extralight tabular-nums text-brand-600">
                  {item.metric}
                </span>
                <span className="text-sm text-ink-muted">
                  {item.metricLabel}
                </span>
              </p>
            ) : null}
            <h3 className="text-lg font-medium text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
