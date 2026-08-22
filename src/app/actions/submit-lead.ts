'use server';

import { deliverLead } from '@/lib/crm';
import {
  validateLead,
  normalizePhone,
  emptyLeadValues,
  type LeadFormState,
  type LeadInput,
} from '@/lib/lead-schema';
import { validProgramIds } from '@/content/programs';

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const input: LeadInput = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    program: String(formData.get('program') ?? ''),
    comment: String(formData.get('comment') ?? ''),
    consent: formData.get('consent') === 'on',
    company: String(formData.get('company') ?? ''),
  };

  // То, что вернём в поля при ошибке, чтобы человек не вводил всё заново.
  const values = {
    name: input.name,
    phone: input.phone,
    program: input.program,
    comment: input.comment,
    consent: input.consent,
  };

  // Ловушка для ботов: люди это поле не видят и не заполняют.
  if (input.company.trim() !== '') {
    return {
      status: 'success',
      errors: {},
      message: null,
      values: emptyLeadValues,
    };
  }

  const errors = validateLead(input, validProgramIds);
  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      errors,
      message: 'Проверьте отмеченные поля и отправьте заявку ещё раз.',
      values,
    };
  }

  const result = await deliverLead({
    name: input.name.trim(),
    phone: normalizePhone(input.phone),
    program: input.program,
    comment: input.comment.trim(),
    submittedAt: new Date().toISOString(),
  });

  if (!result.ok) {
    // Ложный успех показывать нельзя — предлагаем прямой канал связи.
    return {
      status: 'error',
      errors: {},
      message:
        'Не удалось отправить заявку — сбой на нашей стороне. Позвоните нам или напишите в Telegram, мы запишем вас вручную.',
      values,
    };
  }

  return {
    status: 'success',
    errors: {},
    message: null,
    values: emptyLeadValues,
  };
}
