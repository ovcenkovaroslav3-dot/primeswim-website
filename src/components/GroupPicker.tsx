'use client';

import { useEffect, useRef, useState } from 'react';

import { ageOptions, programs } from '@/content/programs';
import { slotOptions } from '@/content/schedule';
import { trackGoal } from '@/lib/analytics';
import { requestBooking } from '@/lib/booking';
import {
  daysLabels,
  goalLabels,
  levelLabels,
  matchGroup,
  type DaysPreference,
  type PickerAnswers,
  type SwimGoal,
  type SwimLevel,
} from '@/lib/group-match';

/*
  «Подберём группу за 30 секунд».

  Стоит на месте прежней фиолетовой плашки «Подберём группу по возрасту и
  уровню подготовки» после расписания и цен — и говорит то же самое, только
  делом: четыре вопроса по одному касанию, без клавиатуры. Длина страницы не
  выросла, ритм светлых и тёмных полос не тронут.

  Зачем он вообще. Родитель, который не знает, «с нуля» его ребёнку или
  «техника», и не понимает, какая группа подойдёт, раньше мог только
  написать и ждать ответа. Теперь он за полминуты получает направление и
  время, а форма записи открывается уже заполненной: возраст, направление,
  удобное время. Заявка становится короче, а школа получает её с ответами.

  Чего здесь нет. Свободных мест, «осталось 2 места» и прочего давления: этих
  данных у сайта нет. Результат так и говорит — место подтвердит
  администратор. Кнопка «Сразу к заявке» оставлена для тех, кто уже решил,
  чтобы подбор не встал лишней ступенькой перед формой.

  Подбор сам ничего не отправляет и персональных данных не собирает —
  телефон и имя родитель вводит только в форме, под согласием.
*/

type Step = 'age' | 'level' | 'goal' | 'days';
const steps: Step[] = ['age', 'level', 'goal', 'days'];

const questions: Record<Step, string> = {
  age: 'Сколько лет ребёнку?',
  level: 'Как ребёнок чувствует себя в воде?',
  goal: 'Главная цель занятий?',
  days: 'Какие дни удобнее?',
};

const choices: Record<Step, { value: string; label: string }[]> = {
  age: ageOptions,
  level: (Object.keys(levelLabels) as SwimLevel[]).map((value) => ({
    value,
    label: levelLabels[value],
  })),
  goal: (Object.keys(goalLabels) as SwimGoal[]).map((value) => ({
    value,
    label: goalLabels[value],
  })),
  days: (Object.keys(daysLabels) as DaysPreference[]).map((value) => ({
    value,
    label: daysLabels[value],
  })),
};

const chipClass =
  'min-h-12 rounded-[12px] border border-white/25 bg-white/5 px-4 py-3 text-left text-[15px] text-white transition-colors hover:border-lime-300 hover:bg-white/10';

export function GroupPicker() {
  const [answers, setAnswers] = useState<Partial<PickerAnswers>>({});
  const [index, setIndex] = useState(0);
  const [slot, setSlot] = useState('');
  const headingRef = useRef<HTMLParagraphElement>(null);
  const moved = useRef(false);
  const started = useRef(false);

  const done = index >= steps.length;
  const match = done ? matchGroup(answers as PickerAnswers, slotOptions) : null;
  const program = match ? programs.find((p) => p.id === match.program) : null;

  /*
    После каждого ответа фокус переходит на новый вопрос: иначе он остаётся
    на кнопке, которой в разметке уже нет, и клавиатура с программой чтения
    теряют место. При первой отрисовке фокус не трогаем — страница не должна
    сама прыгать к подбору.
  */
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  useEffect(() => {
    if (match) trackGoal('quiz_complete', { program: match.program, days: answers.days });
    // цель — один раз на показ результата, а не на каждую перерисовку
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const answer = (step: Step, value: string) => {
    if (!started.current) {
      started.current = true;
      trackGoal('quiz_start');
    }
    moved.current = true;
    setAnswers((a) => ({ ...a, [step]: value }));
    setIndex((i) => i + 1);
  };

  const restart = () => {
    moved.current = true;
    setAnswers({});
    setSlot('');
    setIndex(0);
  };

  const book = () => {
    if (!match) return;
    trackGoal('quiz_to_form', { program: match.program });
    requestBooking({
      age: answers.age,
      program: match.program,
      slot,
      note: match.summary,
    });
  };

  return (
    <div
      id="podbor"
      className="reveal mt-4 scroll-mt-24 rounded-[20px] bg-brand-600 p-5 text-white sm:p-9"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6">
        <h3 className="text-xl leading-snug font-light sm:text-2xl">
          Подберём группу за 30 секунд
        </h3>
        <a
          href="#booking"
          data-goal="cta_booking"
          className="text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
        >
          Уже решили? Сразу к заявке
        </a>
      </div>

      {!done ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <p
              ref={headingRef}
              tabIndex={-1}
              id="podbor-question"
              className="text-base font-medium outline-none sm:text-lg"
            >
              {questions[steps[index]]}
            </p>
            <span className="shrink-0 text-xs tabular-nums text-white/60">
              {index + 1} из {steps.length}
            </span>
          </div>
          {/* полоса шагов: видно, что вопросов немного и сколько осталось */}
          <div aria-hidden="true" className="mt-3 grid grid-cols-4 gap-1.5">
            {steps.map((step, i) => (
              <span
                key={step}
                className={`h-1 rounded-full ${i <= index ? 'bg-lime-300' : 'bg-white/20'}`}
              />
            ))}
          </div>

          <div
            role="group"
            aria-labelledby="podbor-question"
            className={`mt-5 grid gap-2.5 ${
              steps[index] === 'age' ? 'grid-cols-2 sm:grid-cols-3' : 'sm:grid-cols-3'
            }`}
          >
            {choices[steps[index]].map((choice) => (
              <button
                key={choice.value}
                type="button"
                onClick={() => answer(steps[index], choice.value)}
                className={chipClass}
              >
                {choice.label}
              </button>
            ))}
          </div>

          {index > 0 ? (
            <button
              type="button"
              onClick={() => {
                moved.current = true;
                setIndex((i) => Math.max(0, i - 1));
              }}
              className="mt-4 min-h-11 text-sm text-white/70 underline underline-offset-4 hover:text-white"
            >
              ← Назад
            </button>
          ) : null}
        </div>
      ) : match && program ? (
        <div className="mt-6" role="status">
          <p
            ref={headingRef}
            tabIndex={-1}
            className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase outline-none"
          >
            Вам подойдёт
          </p>
          <p className="mt-2 text-2xl leading-tight font-normal text-lime-300 sm:text-3xl">
            {program.title}
          </p>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-white/85">{match.reason}</p>
          {match.ageNote ? (
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-white/85">
              {match.ageNote}
            </p>
          ) : null}

          <fieldset className="mt-6">
            <legend className="text-sm text-white/70">
              Когда идут занятия — выберите удобное время, мы подставим его в заявку:
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {match.slots.map((option) => {
                const active = slot === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    aria-label={option.label}
                    onClick={() => setSlot(active ? '' : option.value)}
                    className={`min-h-11 rounded-full border px-4 text-sm tabular-nums transition-colors ${
                      active
                        ? 'border-lime-300 bg-lime-300 text-abyss-950'
                        : 'border-white/30 text-white hover:border-lime-300'
                    }`}
                  >
                    {option.short}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Свободное место и точную группу подтвердит администратор, когда
            перезвонит.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={book}
              className="lift inline-flex min-h-13 items-center justify-center rounded-lg bg-white px-7 py-3.5 text-base font-medium text-abyss-900 transition-colors hover:bg-lime-100"
            >
              Записаться на пробное
            </button>
            <button
              type="button"
              onClick={restart}
              className="min-h-11 text-sm text-white/70 underline underline-offset-4 hover:text-white"
            >
              Пройти заново
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
