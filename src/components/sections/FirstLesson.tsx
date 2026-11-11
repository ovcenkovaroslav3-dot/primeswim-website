import { ArrowLink } from '../ui';

const steps = [
  { title: 'Подберите группу', text: 'Оставьте заявку: администратор подберёт группу по возрасту и уровню подготовки ребёнка и согласует время.' },
  { title: 'Подготовьтесь', text: 'На пробное занятие справка не обязательна. Для дальнейших занятий пришлите справку от педиатра администратору в чат. Список вещей — в разделе для родителей.' },
  { title: 'Приходите на пробное', text: 'Занятие проходит вместе с группой и длится 45 минут. Пробное оплачивается отдельно и не входит в абонемент.' },
];

export function FirstLesson() {
  return (
    <section id="first-lesson" aria-labelledby="first-lesson-title" className="bg-surface px-4 pt-14 sm:px-6 sm:pt-16 md:pt-24 [overflow-wrap:anywhere]">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">Первый шаг</p>
        <h2 id="first-lesson-title" className="mt-4 text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl">Как начать заниматься</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-0 md:border-t md:border-hairline">
          {steps.map((step, i) => (
            <li key={step.title} className="min-w-0 border-t border-hairline pt-4 md:border-t-0 md:pr-8 md:pt-6">
              <span aria-hidden="true" className="text-4xl leading-none font-light tabular-nums text-ink-muted sm:text-5xl">0{i + 1}</span>
              <h3 className="mt-5 text-xl text-ink">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          <ArrowLink href="#booking">Оставить заявку</ArrowLink>
          <ArrowLink href="/roditelyam/">Что взять с собой</ArrowLink>
        </div>
      </div>
    </section>
  );
}
