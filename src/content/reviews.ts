/** Verified on 2026-11-10. Verbatim excerpts, explicitly labelled in UI.
 * Dates omit year as on source. No ratings inferred. */
export type Review = { id: string; text: string; author: string; date: string };
export const reviews: Review[] = [
  {
    "id": "yandex-ekaterina-p",
    "author": "Екатерина П.",
    "date": "9 ноября",
    "text": "Уже год водим дочку на плавание в школу к Ярославу Сергеевичу. Довольна вся семья, ребёнок перестал бояться воды, а как хорошо плавать стала и даже на спине."
  },
  {
    "id": "yandex-marina-kochieva",
    "author": "Marina Kochieva",
    "date": "9 ноября",
    "text": "Изначально искала бассейн для того, чтобы сын просто научился плавать. В итоге мы ходим на занятия уже не первый год."
  },
  {
    "id": "yandex-valentina-l",
    "author": "Valentina L.",
    "date": "6 ноября",
    "text": "Сын научился нырять, плавать за несколько занятий!"
  },
  {
    "id": "yandex-viktoria-e",
    "author": "Виктория Е.",
    "date": "6 ноября",
    "text": "Доче очень нравится! Очень довольны занятиями. Хочу выразить благодарность Ярославу! Отличное место для развития ребенка! Рекомендую!!!"
  },
  {
    "id": "yandex-natalya-levochkina",
    "author": "Наталья Левочкина",
    "date": "6 ноября",
    "text": "Замечательная школа плавания! Сын занимается у Ярослава Сергеевича, это настоящий профессионал: доброжелательный, ответственный, всегда открытый для общения."
  },
  {
    "id": "yandex-elena-p",
    "author": "Елена П",
    "date": "19 августа",
    "text": "Отдельно хочется отметить великолепную организацию внутри школы - все четко, слаженно, всегда на связи и готовы помочь."
  }
];
export const reviewsSource = {
 label: 'Отзывы на Яндекс Картах',
 href: 'https://yandex.com/maps/org/prime_swim_swimming_school/52003694679/reviews/',
};
