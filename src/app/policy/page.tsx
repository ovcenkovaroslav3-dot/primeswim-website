import { Breadcrumbs } from '@/components/Breadcrumbs';
import { contacts } from '@/content/contacts';
import { pageMetadata, seo } from '@/content/seo';
import { policySections, policyPublishedAt } from '@/content/policy';

export const metadata = pageMetadata(seo.policy);

export default function PolicyPage() {
  const { legal } = contacts;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 md:py-20">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Политика обработки персональных данных' },
        ]}
      />

      <h1 className="text-3xl leading-[1.08] font-extralight text-ink sm:text-4xl">
        Политика обработки персональных данных
      </h1>
      <p className="mt-4 text-ink-muted">
        Действует для сайта primeswim.ru. Дата публикации: {policyPublishedAt}.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-ink">
          Оператор персональных данных
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          1.2. Оператором персональных данных является {legal.operator}
          {legal.inn ? `, ИНН ${legal.inn}` : ''}
          {legal.ogrnip ? `, ОГРНИП ${legal.ogrnip}` : ''}
          {legal.registrar
            ? `, зарегистрирован ${legal.registrar}`
            : ''} — далее «Оператор», владелец сайта primeswim.ru.
        </p>
        {!legal.inn || !legal.ogrnip ? (
          <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
            <strong>[ТРЕБУЕТ УТОЧНЕНИЯ]</strong> Не заполнены реквизиты
            оператора: ИНН и ОГРНИП. Заполните их в файле{' '}
            <code className="rounded bg-amber-100 px-1">
              src/content/contacts.ts
            </code>{' '}
            до публикации — без них документ юридически неполный. Этот блок
            исчезнет автоматически.
          </p>
        ) : null}
      </section>

      {policySections.map((section) => (
        <section key={section.id} className="mt-10">
          <h2 className="text-xl font-medium text-ink">
            {section.title}
          </h2>

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
        <h2 className="text-xl font-medium text-ink">
          11. Контакты оператора
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          По всем вопросам, связанным с обработкой персональных данных, можно
          обратиться:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
          <li>
            телефон:{' '}
            <a
              href={contacts.phone.href}
              className="font-medium text-brand-600 underline underline-offset-4"
            >
              {contacts.phone.display}
            </a>
            ;
          </li>
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
          <li>
            Telegram:{' '}
            <a
              href={contacts.social.telegramBooking}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline underline-offset-4"
            >
              @primeswim_khimki
            </a>
            ;
          </li>
          <li>адрес места оказания услуг: {contacts.address.full}.</li>
          {legal.email ? <li>электронная почта: {legal.email}.</li> : null}
        </ul>
      </section>
    </div>
  );
}
