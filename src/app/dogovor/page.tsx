import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink } from '@/components/ui';
import { contacts } from '@/content/contacts';
import {
  contractSections,
  dogovorPublishedAt,
  photoConsent,
} from '@/content/dogovor';
import { pageMetadata, seo } from '@/content/seo';

export const metadata = pageMetadata(seo.dogovor);

/*
  Договор до записи, а не после.

  Условия пропусков, отработок и возврата денег — то, о чём родитель
  спрашивает первым, и раньше страница цен ссылалась на договор, которого на
  сайте не было. «Условия описаны в договоре» без возможности его прочитать
  работает против доверия, а не на него.

  Страница не заменяет подписываемый экземпляр и прямо об этом говорит: здесь
  условия, там — реквизиты сторон и подписи.
*/
export default function DogovorPage() {
  const { legal } = contacts;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 md:py-20">
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Договор на занятия' },
        ]}
      />

      <h1 className="text-3xl leading-[1.08] font-extralight text-ink sm:text-4xl">
        Договор на оказание физкультурно&#8209;оздоровительных услуг по плаванию
      </h1>
      <p className="mt-4 leading-relaxed text-ink-muted">
        Текст договора, который подписывается до начала занятий. Редакция от{' '}
        {dogovorPublishedAt}. Здесь — условия; реквизиты сторон, подписи и
        данные ребёнка заполняются в бумажном экземпляре, один из двух остаётся
        у вас.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium text-ink">Стороны</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Исполнитель — {legal.operator}
          {legal.inn ? `, ИНН ${legal.inn}` : ''}
          {legal.ogrnip ? `, ОГРНИП ${legal.ogrnip}` : ''}, осуществляющий
          деятельность под обозначением PRIME SWIM.
        </p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Заказчик — родитель или иной законный представитель, действующий в
          интересах несовершеннолетнего Участника. Их данные вносятся в договор
          при подписании.
        </p>
      </section>

      {contractSections.map((section) => (
        <section key={section.id} className="mt-10">
          <h2 className="text-xl font-medium text-ink">{section.title}</h2>
          {section.clauses.map((clause) => (
            <p key={clause} className="mt-3 leading-relaxed text-ink-soft">
              {clause}
            </p>
          ))}
        </section>
      ))}

      <section className="mt-10">
        <h2 className="text-xl font-medium text-ink">9. Реквизиты и подписи</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Полные реквизиты Исполнителя, данные Заказчика и Участника, подписи
          обеих сторон — в бумажном экземпляре договора. Он составляется в двух
          экземплярах равной силы, один из них вы получаете на руки при
          подписании.
        </p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Организационные вопросы решаются по телефону{' '}
          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="font-medium text-brand-600 underline underline-offset-4"
          >
            {contacts.phone.display}
          </a>{' '}
          и в мессенджерах с контактов, указанных сторонами.
        </p>
      </section>

      {/*
        Лист согласия на съёмку идёт следом, потому что подписывают их вместе.
        Отдельным разделом, а не пунктом договора, — так он и оформлен: это
        приложение, и подписывать его необязательно.
      */}
      <section className="mt-10 rounded-[20px] border border-hairline bg-surface-alt p-6 sm:p-8">
        <h2 className="text-xl font-medium text-ink">{photoConsent.title}</h2>
        <p className="mt-2 text-sm text-ink-muted">{photoConsent.note}</p>
        {photoConsent.clauses.map((clause) => (
          <p key={clause} className="mt-3 leading-relaxed text-ink-soft">
            {clause}
          </p>
        ))}
      </section>

      <section className="mt-10 border-t border-hairline pt-8">
        <p className="leading-relaxed text-ink-soft">
          Остались вопросы по условиям — задайте их до записи, это нормально и
          быстрее, чем разбираться потом.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/#booking" data-goal="cta_booking">
            Записаться на пробное занятие
          </ButtonLink>
          {/* ghost, а не outline: outline — белая кромка и белый текст,
              он для тёмных секций и на светлой странице не виден вовсе */}
          <ButtonLink href="/price/" variant="ghost">
            Стоимость занятий
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
