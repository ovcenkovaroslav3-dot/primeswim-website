/**
 * Подбор направления по четырём ответам родителя.
 *
 * Обычный код, а не модель: вопросов четыре, вариантов в каждом по три-шесть,
 * и правила целиком помещаются на экран. Ответ предсказуем, проверяется
 * тестом и ничего не стоит в обслуживании.
 *
 * ЧЕГО ПОДБОР НЕ ДЕЛАЕТ И НЕ ДОЛЖЕН. Он не знает, сколько мест в группе и в
 * какую именно из двух вечерних групп пойдёт ребёнок: этих данных на сайте
 * нет, их знает только администратор. Поэтому результат — направление и
 * время, когда идут занятия, а не «место забронировано». Свободное место
 * подтверждает человек после заявки.
 *
 * Правила взяты из подписей направлений (content/programs.ts): «с нуля» —
 * детям без опыта, «техника» — тем, кто уже держится на воде, «спорт» —
 * тем, кто хочет развиваться в спорте. Ребёнку, который держится на воде, но
 * сам ещё не плывёт, остаётся «с нуля»: его первые шаги (положение тела,
 * скольжение) — ровно эта программа.
 */

import type { SlotOption } from '../content/schedule.ts';

export type SwimLevel = 'none' | 'floats' | 'swims';
export type SwimGoal = 'learn' | 'technique' | 'sport';
export type DaysPreference = 'weekdays' | 'weekend' | 'any';

export type PickerAnswers = {
  /** Значение из ageOptions (content/programs.ts) */
  age: string;
  level: SwimLevel;
  goal: SwimGoal;
  days: DaysPreference;
};

export type GroupMatch = {
  /** id направления из content/programs.ts */
  program: 'beginners' | 'technique' | 'sport';
  /** Почему именно оно — одной фразой, для родителя */
  reason: string;
  /** Время занятий, подходящее под выбранные дни */
  slots: SlotOption[];
  /** Оговорка по возрасту, если ребёнок младше набора */
  ageNote: string | null;
  /** Короткая строка для школы: что ответил родитель */
  summary: string;
};

export const levelLabels: Record<SwimLevel, string> = {
  none: 'Пока не держится на воде',
  floats: 'Держится на воде, но сам не плывёт',
  swims: 'Плавает самостоятельно',
};

export const goalLabels: Record<SwimGoal, string> = {
  learn: 'Научиться плавать',
  technique: 'Поставить технику',
  sport: 'Соревнования и разряды',
};

export const daysLabels: Record<DaysPreference, string> = {
  weekdays: 'Будни, вечер',
  weekend: 'Выходные, день',
  any: 'Любые дни',
};

function pickProgram(level: SwimLevel, goal: SwimGoal): Pick<GroupMatch, 'program' | 'reason'> {
  if (level === 'none') {
    return {
      program: 'beginners',
      reason:
        goal === 'learn'
          ? 'Начнём с привыкания к воде и дыхания — в своём темпе, без давления.'
          : 'Сначала база: привыкание к воде, дыхание, положение тела. Технику и старты строим уже на ней.',
    };
  }
  if (level === 'floats') {
    if (goal === 'learn') {
      return {
        program: 'beginners',
        reason:
          'Ребёнок уже не боится воды — дальше положение тела и скольжение, первые самостоятельные метры.',
      };
    }
    return {
      program: 'technique',
      reason:
        goal === 'sport'
          ? 'Сначала ставим технику четырёх стилей — к соревнованиям переходят с ней.'
          : 'Разберём движения по каждому стилю и уберём ошибки.',
    };
  }
  if (goal === 'sport') {
    return {
      program: 'sport',
      reason: 'Подготовка к соревнованиям и разрядам, участие в стартах и сборах.',
    };
  }
  return {
    program: 'technique',
    reason:
      goal === 'learn'
        ? 'Плавать ребёнок уже умеет — следующий шаг техника всех четырёх стилей.'
        : 'Разберём движения по каждому стилю, уберём ошибки, нарастим дистанцию.',
  };
}

export function matchGroup(answers: PickerAnswers, slots: readonly SlotOption[]): GroupMatch {
  const { program, reason } = pickProgram(answers.level, answers.goal);

  const fitting = slots.filter((slot) =>
    answers.days === 'any' ? true : answers.days === 'weekend' ? slot.weekend : !slot.weekend,
  );

  return {
    program,
    reason,
    slots: fitting,
    ageNote:
      answers.age === 'under-7'
        ? 'Обычно набираем с 7 лет. Оставьте заявку — обсудим ваш случай.'
        : null,
    summary: `Подбор на сайте: ${levelLabels[answers.level].toLowerCase()}; цель — ${goalLabels[
      answers.goal
    ].toLowerCase()}; дни — ${daysLabels[answers.days].toLowerCase()}.`,
  };
}
