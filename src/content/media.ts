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
  width: 1920,
  height: 2560,
};

/** Фотографии бассейна МГИК. */
export const poolImages: MediaItem[] = [
  {
    src: '/media/pool/mgik-pool-flags.jpg',
    alt: 'Зал бассейна МГИК с флажками поворота над водой и электронным табло',
    width: 1920,
    height: 2560,
  },
  {
    src: '/media/pool/mgik-pool-starting-blocks.jpg',
    alt: 'Ряд стартовых тумб вдоль бортика бассейна МГИК, отражение в спокойной воде',
    width: 1920,
    height: 2560,
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
    width: 1600,
    height: 900,
  },
  {
    src: '/media/pool/mgik-entrance-gate.jpg',
    alt: 'Вход на территорию Московского государственного института культуры в Химках',
    width: 2222,
    height: 1000,
  },
];

/** Галерея «PRIME SWIM в жизни». */
export const galleryImages: MediaItem[] = [
  {
    src: '/media/gallery/award-handshake.jpg',
    alt: 'Тренер пожимает руку юному пловцу с медалью после соревнований',
    width: 1707,
    height: 2560,
  },
  {
    src: '/media/gallery/award-medals.jpg',
    alt: 'Тренер надевает медаль девочке в шапочке для плавания на награждении',
    width: 1707,
    height: 2560,
  },
  {
    src: '/media/gallery/award-diplomas.jpg',
    alt: 'Группа юных пловцов с дипломами и тренер после соревнований в бассейне',
    width: 1280,
    height: 960,
  },
];

/** Логотип школы. */
export const logo: MediaItem = {
  src: '/media/brand/prime-swim-logo.jpg',
  alt: 'Логотип школы плавания PRIME SWIM',
  width: 2560,
  height: 2560,
};
