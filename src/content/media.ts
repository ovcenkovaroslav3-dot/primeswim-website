/**
 * Галерея и крупные изображения страниц.
 * Файлы лежат в public/media/. Полный реестр — public/media/media-manifest.json.
 */

export type MediaItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Изображение первого экрана. Грузится с приоритетом.
 *
 * Здесь должен стоять кадр, снятый именно в бассейне МГИК, — родитель по нему
 * понимает, куда придёт ребёнок. Прежнее фото с детьми снято на другой площадке
 * и убрано в public/media/review-required/kids-in-pool-other-venue.jpg.
 *
 * [ТРЕБУЕТ УТОЧНЕНИЯ] Нужна фотография занятия с детьми в МГИК — сейчас все
 * кадры оттуда без людей, из-за чего первый экран менее живой.
 */
export const heroImage: MediaItem = {
  src: '/media/pool/mgik-pool-lanes.jpg',
  alt: 'Бассейн МГИК в Химках: дорожки, стартовые тумбы и панорамное остекление зала, где проходят занятия PRIME SWIM',
  width: 1050,
  height: 1400,
};

/** Фотографии бассейна МГИК. */
export const poolImages: MediaItem[] = [
  {
    src: '/media/pool/mgik-pool-flags.jpg',
    alt: 'Зал бассейна МГИК с флажками поворота над водой и электронным табло',
    width: 1050,
    height: 1400,
  },
  {
    src: '/media/pool/mgik-pool-starting-blocks.jpg',
    alt: 'Ряд стартовых тумб вдоль бортика бассейна МГИК, отражение в спокойной воде',
    width: 1050,
    height: 1400,
  },
  {
    src: '/media/pool/mgik-pool-window-view.jpg',
    alt: 'Групповое занятие в бассейне МГИК: пловцы на дорожках, вид из холла через стеклянную стену',
    width: 960,
    height: 1280,
  },
];

/** Фотографии здания и входа — помогают родителю найти бассейн. */
export const venueImages: MediaItem[] = [
  {
    src: '/media/pool/mgik-building.jpg',
    alt: 'Здание бассейна МГИК в Химках: белый корпус с синей отделкой и арочной крышей',
    width: 1400,
    height: 788,
  },
  {
    src: '/media/pool/mgik-entrance-gate.jpg',
    alt: 'Вход на территорию Московского государственного института культуры в Химках',
    width: 1400,
    height: 630,
  },
];

/** Галерея «PRIME SWIM в жизни». */
export const galleryImages: MediaItem[] = [
  {
    src: '/media/gallery/award-handshake.jpg',
    alt: 'Тренер пожимает руку юному пловцу с медалью после соревнований',
    width: 934,
    height: 1400,
  },
  {
    src: '/media/gallery/award-medals.jpg',
    alt: 'Тренер надевает медаль девочке в шапочке для плавания на награждении',
    width: 934,
    height: 1400,
  },
  {
    src: '/media/gallery/award-diplomas.jpg',
    alt: 'Группа юных пловцов с дипломами и тренер после соревнований в бассейне',
    width: 1280,
    height: 960,
  },
  {
    src: '/media/gallery/flag-wall-lineup.jpg',
    alt: 'Юные пловцы на бортике бассейна перед тренировкой, на стене баннер с гербом и флагом России',
    width: 1500,
    height: 997,
  },
  {
    src: '/media/gallery/tolyatti-team-poolside.jpg',
    alt: 'Команда PRIME SWIM у бассейна на соревнованиях в Тольятти',
    width: 1500,
    height: 1125,
  },
  {
    src: '/media/gallery/young-group-thumbs-up.jpg',
    alt: 'Группа юных пловцов с ластами показывает большой палец у бортика бассейна',
    width: 1280,
    height: 960,
  },
  {
    src: '/media/gallery/kids-cheering-in-water.jpg',
    alt: 'Дети поднимают руки в воде во время занятия в бассейне',
    width: 1125,
    height: 1500,
  },
  {
    src: '/media/gallery/coach-poolside-fins.jpg',
    alt: 'Тренер наблюдает за группой детей с ластами у бортика',
    width: 1086,
    height: 1448,
  },
  {
    src: '/media/gallery/two-kids-goggles-thumbs-up.jpg',
    alt: 'Два пловца в воде показывают большой палец в ярких очках для плавания',
    width: 1280,
    height: 960,
  },
  {
    src: '/media/gallery/coach-briefing-at-blocks.jpg',
    alt: 'Тренер инструктирует группу детей у стартовых тумб перед заплывом',
    width: 1500,
    height: 1125,
  },
  {
    src: '/media/gallery/coach-with-young-swimmers.jpg',
    alt: 'Тренер идёт вдоль бортика с группой маленьких пловцов',
    width: 1500,
    height: 1125,
  },
  {
    src: '/media/gallery/kickboard-drill-lineup.jpg',
    alt: 'Дети отрабатывают технику ног с досками у бортика бассейна',
    width: 960,
    height: 1280,
  },
  {
    src: '/media/gallery/teen-swimmers-long-fins.jpg',
    alt: 'Два подростка надевают длинные ласты перед тренировкой',
    width: 960,
    height: 1280,
  },
  {
    src: '/media/gallery/kids-yellow-kickboards.jpg',
    alt: 'Группа детей с жёлтыми досками для плавания выстроилась у бассейна',
    width: 960,
    height: 1280,
  },
  {
    src: '/media/gallery/two-girls-portrait.jpg',
    alt: 'Две девочки в шапочках и очках для плавания сидят на бортике',
    width: 1125,
    height: 1500,
  },
  {
    src: '/media/gallery/two-boys-heart-hands.jpg',
    alt: 'Два мальчика в шапочках для плавания складывают руки в форме сердца',
    width: 1125,
    height: 1500,
  },
  {
    src: '/media/gallery/pool-noodle-drill.jpg',
    alt: 'Дети плывут с нудлами между ног во время занятия',
    width: 960,
    height: 1280,
  },
  {
    src: '/media/gallery/two-girls-pink-fins.jpg',
    alt: 'Две девочки обнимаются, держа розовые ласты, и показывают большой палец',
    width: 960,
    height: 1280,
  },
  {
    src: '/media/gallery/medal-coach-highfive.jpg',
    alt: 'Тренер поздравляет подростка с медалью после соревнований',
    width: 1000,
    height: 1500,
  },
  {
    src: '/media/gallery/teens-celebrating-medals.jpg',
    alt: 'Подростки с медалями радуются победе на соревнованиях',
    width: 1000,
    height: 1500,
  },
  {
    src: '/media/gallery/team-group-competition.jpg',
    alt: 'Команда подростков позирует у бассейна на соревнованиях',
    width: 1125,
    height: 1500,
  },
  {
    src: '/media/gallery/competition-pool-wide.jpg',
    alt: 'Пловцы на дорожках большого бассейна во время соревнований',
    width: 1125,
    height: 1500,
  },
  {
    src: '/media/gallery/team-ice-skating.jpg',
    alt: 'Команда PRIME SWIM на катке с тренером в новогодней шапке',
    width: 960,
    height: 1280,
  },
];

/**
 * Восемь кадров для главной.
 *
 * Не первые восемь из массива, а отобранные: будни в воде, работа тренера
 * с группой и результат на соревнованиях — по каждому сюжету понятно, что
 * происходит. Родителю на главной нужен не архив, а доказательство, что
 * школа настоящая; весь набор лежит на /galereya/.
 *
 * Кадры, где крупный настенный баннер забирает половину плитки, сюда не
 * берутся: в квадратной обрезке от снимка остаётся текст на стене, а не
 * дети в воде. В самой галерее они остаются — там кадр показан целиком и
 * читается как есть. Это то же правило, по которому из видео отобраны три
 * клипа из шести.
 *
 * ГЛАВНАЯ ОТДАЁТ НЕ ОРИГИНАЛЫ, А УМЕНЬШЕННЫЕ КОПИИ из media/preview.
 * Плитка занимает 171 px на телефоне и 276 px на десктопе, а исходные
 * файлы шириной 1280–1500 px весили 1 861 KB на восемь снимков. Свой
 * загрузчик на статике вариантов по ширине не создаёт (см. next.config.ts),
 * поэтому копии сделаны заранее и лежат готовыми — 440 KB вместо 1 861 KB
 * при том же изображении на экране. Рецепт пересборки — в
 * public/media/preview/README.md.
 *
 * Обрезка вшита в файл: копии уже квадратные, с тем же смещением вверх,
 * что раньше задавал object-position. Подпись берётся из galleryImages —
 * alt правится в одном месте и не разъезжается между главной и галереей.
 */
const highlightSources = [
  '/media/gallery/coach-briefing-at-blocks.jpg',
  '/media/gallery/kickboard-drill-lineup.jpg',
  '/media/gallery/coach-with-young-swimmers.jpg',
  '/media/gallery/two-kids-goggles-thumbs-up.jpg',
  '/media/gallery/kids-yellow-kickboards.jpg',
  '/media/gallery/award-handshake.jpg',
  '/media/gallery/teens-celebrating-medals.jpg',
  '/media/gallery/team-group-competition.jpg',
];

/** Сторона квадратной копии. 276 px на десктопе при 2x — 552, берём 560. */
const TILE_SIZE = 560;

export const galleryHighlights: MediaItem[] = highlightSources
  .map((src) => {
    const original = galleryImages.find((image) => image.src === src);
    if (!original) return null;

    return {
      src: src.replace('/media/gallery/', '/media/preview/'),
      alt: original.alt,
      width: TILE_SIZE,
      height: TILE_SIZE,
    };
  })
  .filter((image): image is MediaItem => Boolean(image));

/**
 * Здание и ворота для блока «Где занимаемся» на главной — те же снимки,
 * что в venueImages, но 720×540 вместо 1400 px по ширине. На странице
 * бассейна остаются оригиналы: там кадр показан крупно.
 */
export const venuePreviewImages: MediaItem[] = venueImages.map((image) => ({
  src: image.src.replace('/media/pool/', '/media/preview/'),
  alt: image.alt,
  width: 720,
  height: 540,
}));

export type VideoItem = {
  src: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Видео с тренировок для галереи «PRIME SWIM в жизни».
 * Из шести присланных клипов выбраны три: старт с тумб, разбор техники у
 * бортика и обход тренера с группой — без политической рекламы на фоне
 * (баннер партии на кадре с бортика), без футбола на выезде (не про
 * плавание) и без клипа с вопросом-ответом для соцсетей (реплика обрывается
 * на кадре, вне приложения не читается).
 */
export const galleryVideos: VideoItem[] = [
  {
    src: '/media/video/starts-drill.mp4',
    poster: '/media/video/starts-drill-poster.jpg',
    alt: 'Дети готовятся к старту с тумб на тренировке в бассейне МГИК',
    width: 720,
    height: 1280,
  },
  {
    src: '/media/video/coach-poolside.mp4',
    poster: '/media/video/coach-poolside-poster.jpg',
    alt: 'Тренер идёт вдоль бортика и разбирает технику с группой в воде',
    width: 720,
    height: 1280,
  },
  {
    src: '/media/video/coach-demo.mp4',
    poster: '/media/video/coach-demo-poster.jpg',
    alt: 'Тренер объясняет упражнение перед началом заплыва',
    width: 720,
    height: 1280,
  },
];

/** Логотип школы. */
export const logo: MediaItem = {
  src: '/media/brand/prime-swim-logo.jpg',
  alt: 'Логотип школы плавания PRIME SWIM',
  width: 1400,
  height: 1400,
};
