import { ButtonLink, Section, SectionHeading } from '../ui';
import { SocialLinks } from '../SocialLinks';
import { ViewGoal } from '../ViewGoal';
import { contacts } from '@/content/contacts';

export function Contacts() {
  return (
    <Section id="contacts" labelledBy="contacts-title" className="bg-surface">
      <ViewGoal goal="view_contacts" />
      <SectionHeading
        id="contacts-title"
        eyebrow="Контакты"
        title="Как нас найти"
        lead="Напишите в Telegram, MAX или ВКонтакте — поможем выбрать группу и ответим на вопросы."
      />

      {/* карточки тянутся по высоте, кнопки уходят к нижнему краю:
          иначе адресная колонка выглядела наполовину пустой */}
      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-7">
          <h3 className="text-lg font-light text-ink">Адрес</h3>
          <address className="mt-3 text-lg leading-relaxed text-ink-soft not-italic">
            {contacts.address.venue}
            <br />
            {contacts.address.region}, г. {contacts.address.city},{' '}
            {contacts.address.district}
            <br />
            {contacts.address.street}
          </address>

          <ButtonLink
            href={contacts.address.yandexMaps}
            external
            variant="ghost"
            data-goal="click_route"
            className="mt-auto pt-6 self-start"
          >
            Построить маршрут на Яндекс Картах
          </ButtonLink>

          {/*
            Карта не встраивается iframe-ом намеренно: сторонний скрипт тянет
            много JavaScript и замедляет страницу. Если карта нужна на странице —
            подключите её здесь по клику пользователя.
          */}
        </div>

        <div className="flex flex-col rounded-[20px] border border-hairline bg-surface-alt p-7">
          <h3 className="text-lg font-light text-ink">Связь</h3>

          <a
            href={contacts.phone.href}
            data-goal="click_phone"
            className="mt-3 inline-block text-2xl font-extralight text-brand-600 underline-offset-4 hover:underline sm:text-3xl"
          >
            {contacts.phone.display}
          </a>

          {/* mb-6 держит зазор до разделителя: кнопки прижаты mt-auto,
              и при равной высоте карточек линия вставала вплотную к тексту */}
          <p className="mt-4 mb-6 text-ink-soft">
            Звоните или пишите в мессенджеры — {contacts.workingHours.display.toLowerCase()}.
          </p>

          <div className="mt-auto flex flex-wrap gap-3 border-t border-hairline pt-6">
            <ButtonLink
              href={contacts.social.telegramBooking}
              external
              variant="primary"
              data-goal="click_telegram_booking"
            >
              Написать в Telegram
            </ButtonLink>
            <ButtonLink
              href={contacts.social.max}
              external
              variant="ghost"
              data-goal="click_max_booking"
            >
              Написать в MAX
            </ButtonLink>
          </div>
        </div>
      </div>

      {/*
        Каналы вынесены из карточки «Связь» отдельным блоком во всю ширину.
        Внутри карточки они стояли тремя кружками «VK/TG/MAX» под кнопками
        записи и терялись: посетитель видел два действия — позвонить и
        написать — и не замечал, что у школы вообще есть открытые страницы.

        Порядок именно такой: сперва как связаться (телефон и личные чаты),
        потом что почитать. Читают до того, как пишут, но кнопка записи
        всё равно важнее, и уводить её вниз ради каналов нельзя.
      */}
      <div className="mt-6 rounded-[20px] border border-hairline bg-surface-alt p-7">
        <h3 className="text-lg font-light text-ink">Каналы школы</h3>
        <p className="mt-2 max-w-[62ch] text-ink-soft">
          Открытые страницы — можно просто читать, подписываться необязательно.
          Чтобы записаться или задать вопрос, пишите в личные сообщения:
          кнопки выше.
        </p>

        <div className="mt-5">
          <SocialLinks variant="cards" />
        </div>
      </div>
    </Section>
  );
}
