import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { consentPublishedAt, consentSections } from '@/content/consent';
import { contacts } from '@/content/contacts';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.consent);

/*
  Согласие на обработку персональных данных.

  Отдельная страница, а не абзац внутри политики: на неё ссылается сама
  галочка в форме, и человек должен успеть прочитать то, под чем ставит
  отметку, не пробираясь через десять разделов документа о другом.

  Вёрстка повторяет страницу политики намеренно — это документы одного
  рода, и разный вид сбивал бы с толку. Текст лежит в content/consent.ts,
  здесь только реквизиты и контакты, которые подставляются из
  content/contacts.ts, чтобы не разъезжаться с подвалом.
*/
export default function ConsentPage() {
  const { legal } = contacts;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 md:py-20">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Согласие на обработку персональных данных' },
        ]}
      />

      <h1 className="text-3xl leading-[1.08] font-extralight text-ink sm:text-4xl">
        Согласие на обработку персональных данных
      </h1>
      <p className="mt-4 text-ink-muted">
        Редакция от {consentPublishedAt}. Это согласие вы даёте, отмечая
        соответствующий пункт в форме записи на сайте primeswim.ru.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-ink">Кому даётся согласие</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Оператор — {legal.operator}
          {legal.inn ? `, ИНН ${legal.inn}` : ''}
          {legal.ogrnip ? `, ОГРНИП ${legal.ogrnip}` : ''}
          {legal.registrar ? `, регистрирующий орган — ${legal.registrar}` : ''} —
          владелец сайта primeswim.ru и школы плавания PRIME SWIM.
        </p>
      </section>

      {consentSections.map((section) => (
        <section key={section.id} className="mt-10">
          <h2 className="text-xl font-medium text-ink">{section.title}</h2>

          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-3 leading-relaxed text-ink-soft">
              {paragraph}
            </p>
          ))}

          {section.list ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <section className="mt-10">
        <h2 className="text-xl font-medium text-ink">Куда обращаться</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
          <li>
            телефон:{' '}
            <a
              href={contacts.phone.href}
              className="font-medium text-brand-600 underline underline-offset-4"
            >
              {contacts.phone.display}
            </a>{' '}
            ({contacts.workingHours.display.toLowerCase()});
          </li>
          {legal.email ? <li>электронная почта: {legal.email};</li> : null}
          <li>
            MAX:{' '}
            <a
              href={contacts.social.max}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline underline-offset-4"
            >
              чат школы
            </a>
            ;
          </li>
          <li>адрес места оказания услуг: {contacts.address.full}.</li>
        </ul>
      </section>

      <p className="mt-10 leading-relaxed text-ink-soft">
        О том, как Оператор обращается с персональными данными в целом, — в{' '}
        <Link
          href="/policy/"
          prefetch={false}
          className="font-medium text-brand-600 underline underline-offset-4"
        >
          политике обработки персональных данных
        </Link>
        .
      </p>
    </div>
  );
}
