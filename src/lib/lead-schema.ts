/**
 * Правила проверки заявки. Используются и на клиенте, и на сервере,
 * чтобы сообщения об ошибках совпадали.
 */

export type LeadInput = {
  name: string;
  phone: string;
  /** Возрастной диапазон ребёнка — определяет группу */
  age: string;
  program: string;
  comment: string;
  consent: boolean;
  /*
    Honeypot: настоящий человек это поле не видит и не заполняет.

    Имя намеренно бессмысленное. Раньше поле называлось `company` — и его
    заполнял не бот, а автозаполнение браузера: «организация» входит в
    распознаваемые профильные категории, а `autocomplete="off"` для них
    сегодня не запрет, а пожелание, которое Chrome и Яндекс.Браузер
    игнорируют. Форма считала такого посетителя ботом и молча не открывала
    Telegram — заявка терялась без следа для обеих сторон.

    Проверено на соседнем проекте: там та же ловушка съедала заявки на
    боевом сайте. Поэтому здесь у поля нет ни одного признака, за который
    автозаполнение могло бы зацепиться.
  */
  hpx7: string;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

/** Что вернуть в поля после неудачной отправки, чтобы не вводить заново. */
export type LeadValues = Pick<
  LeadInput,
  'name' | 'phone' | 'age' | 'program' | 'comment' | 'consent'
>;

export type LeadFormState = {
  status: 'idle' | 'success' | 'error';
  errors: LeadErrors;
  /** Общее сообщение, когда проблема не в конкретном поле */
  message: string | null;
  values: LeadValues;
};

export const emptyLeadValues: LeadValues = {
  name: '',
  phone: '',
  age: '',
  program: '',
  comment: '',
  consent: false,
};

export const initialLeadState: LeadFormState = {
  status: 'idle',
  errors: {},
  message: null,
  values: emptyLeadValues,
};

/** Оставляем только цифры, чтобы не зависеть от того, как человек ввёл номер. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Список допустимых направлений передаётся аргументом, чтобы проверка
 * не зависела от файлов с контентом и оставалась тестируемой.
 */
export function validateLead(
  input: LeadInput,
  validPrograms: ReadonlySet<string>,
  validAges: ReadonlySet<string>,
): LeadErrors {
  const errors: LeadErrors = {};

  const name = input.name.trim();
  if (name.length < 2) {
    errors.name = 'Укажите имя — не короче двух символов.';
  } else if (name.length > 80) {
    errors.name = 'Имя слишком длинное.';
  }

  const digits = normalizePhone(input.phone);
  if (digits.length === 0) {
    errors.phone = 'Укажите номер телефона, чтобы мы могли перезвонить.';
  } else if (digits.length < 10 || digits.length > 15) {
    errors.phone = 'Проверьте номер: в российском номере 11 цифр.';
  }

  if (!validAges.has(input.age)) {
    errors.age = 'Выберите возраст ребёнка.';
  }

  if (!validPrograms.has(input.program)) {
    errors.program = 'Выберите направление из списка.';
  }

  if (input.comment.length > 600) {
    errors.comment = 'Комментарий слишком длинный — уложитесь в 600 символов.';
  }

  if (!input.consent) {
    errors.consent = 'Без согласия на обработку данных мы не сможем связаться.';
  }

  return errors;
}
