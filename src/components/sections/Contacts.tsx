import { ButtonLink, Section, SectionHeading } from '../ui';
import { ViewGoal } from '../ViewGoal';
import { contacts } from '@/content/contacts';

/*
  ЗДЕСЬ БЫЛ ТРЕТИЙ ЭКЗЕМПЛЯР КАНАЛОВ ШКОЛЫ, И ЕГО СНЯЛИ 19 сентября 2026.

  Блок «Каналы школы» с тремя плитками стоял отдельной полосой во всю ширину.
  Он появился по верной причине: внутри карточки «Связь» каналы были тремя
  кружками под кнопками записи и терялись — посетитель видел два действия и
  не замечал, что у школы есть открытые страницы.

  Причина ушла сама. Над шапкой теперь идёт полоса «Каналы школы ·
  Telegram · MAX · ВКонтакте», и она есть на каждой странице выше сгиба —
  то есть решает ровно ту задачу, ради которой блок сюда и ставили, только
  раньше и надёжнее. Плюс те же три ссылки в подвале и в мобильном меню.

  Получалось, что на главной каналы названы четыре раза, и третий из них —
  на 10 600-м пикселе прокрутки с телефона, между формой записи и подвалом,
  где их читает уже никто. Осталось три места, и все три сквозные.

  Что здесь остаётся: адрес с маршрутом и телефон с личными чатами. И то и
  другое отвечает на вопрос заголовка «как нас найти», а каналы отвечали на
  другой — «что почитать».
*/
export function Contacts() {
  return (
    <Section id="contacts" labelledBy="contacts-title" className="bg-surface">
      <ViewGoal goal="view_contacts" />
      <SectionHeading
        id="contacts-title"
        eyebrow="Контакты"
        title="Как нас найти"
        lead="Позвоните или напишите в Telegram или MAX — поможем выбрать группу и ответим на вопросы."
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
            /*
              Зона нажатия 44 px вместо 32. Номер набран крупно и оттого
              выглядел просторным, но нажимается не кегль, а строчный бокс:
              у extralight 24 px он выходил 32 — на палец мало. Это главный
              номер школы на странице и отдельное действие, а не ссылка
              внутри предложения, поэтому исключение из правила 44 px к нему
              не относится. Отрицательный внешний отступ возвращает набранную
              высоту в вёрстку — карточка «Связь» осталась прежней.
            */
            className="mt-1.5 -mb-1.5 inline-flex min-h-11 items-center text-2xl font-extralight text-brand-600 underline-offset-4 hover:underline sm:text-3xl"
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
    </Section>
  );
}
