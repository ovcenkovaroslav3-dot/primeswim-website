/**
 * Направления занятий и преимущества школы.
 * Источник: primeswim.ru (блоки «Тренировки в воде с результатом», FAQ, раздел тренера).
 */

export type Program = {
  id: string;
  title: string;
  description: string;
  /** Кому подходит */
  audience: string;
};

export const programs: Program[] = [
  {
    id: 'beginners',
    title: 'Обучение с нуля',
    description:
      'Первые занятия в воде: привыкание, дыхание, положение тела и скольжение. Ребёнок осваивается в своём темпе — форсировать никто не будет.',
    audience: 'Детям с 7 лет без опыта плавания',
  },
  {
    id: 'technique',
    title: 'Техника четырёх стилей',
    description:
      'Кроль на груди, кроль на спине, брасс и баттерфляй. Разбираем и ставим движения, убираем ошибки, наращиваем дистанцию.',
    audience: 'Тем, кто уже держится на воде',
  },
  {
    id: 'sport',
    title: 'Спортивная подготовка',
    description:
      'Подготовка к соревнованиям и выполнению спортивных разрядов, участие в стартах, тренировочные сборы.',
    audience: 'Тем, кто хочет развиваться в спорте',
  },
];

/** Варианты для выпадающего списка в форме записи. */
export const programOptions = [
  { value: '', label: 'Не знаю, помогите выбрать' },
  ...programs.map((program) => ({ value: program.id, label: program.title })),
];

/** Допустимые значения поля «Направление» — используются при проверке заявки. */
export const validProgramIds: ReadonlySet<string> = new Set(
  programOptions.map((option) => option.value),
);


