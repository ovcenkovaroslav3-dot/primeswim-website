import Image from 'next/image';

/*
  Портрет тренера.

  Пока съёмки нет, вместо фотографии рисуется абстрактная композиция:
  круги расходящейся по воде волны и монограмма. Это не заглушка «фото
  скоро будет», а самостоятельный визуальный объект — секция выглядит
  законченной.

  Когда фотография появится, достаточно передать `photo` — разметка секции
  и её размеры не меняются.
*/
export function CoachPortrait({
  name,
  photo,
}: {
  name: string;
  photo?: { src: string; alt: string };
}) {
  if (photo) {
    return (
      /*
        Подложка тёмная, а не светлая: секция с тренерами лежит на толще, и
        светлый квадрат просвечивал бы каймой, пока снимок грузится.
      */
      <div className="zoom-frame relative aspect-square w-full overflow-hidden rounded-[16px] bg-abyss-800">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          /*
            Единственная крупная картинка страницы тренера и почти наверняка
            её LCP-элемент. По умолчанию next/image грузит изображения лениво:
            браузер узнавал о снимке только после разбора разметки и стилей,
            и главный элемент страницы появлялся последним.
          */
          priority
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover"
        />
      </div>
    );
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-abyss-900"
      role="img"
      aria-label={`${name} — портрет появится после фотосъёмки`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-10 size-56 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -bottom-16 size-52 rounded-full bg-brand-300/18 blur-3xl"
      />

      {/* круги расходящейся волны */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        className="absolute inset-0 size-full"
      >
        {[34, 52, 70, 88].map((r, i) => (
          <circle
            key={r}
            cx="100"
            cy="104"
            r={r}
            fill="none"
            stroke="var(--color-lime-300)"
            strokeWidth="0.6"
            opacity={0.42 - i * 0.08}
          />
        ))}
        <ellipse
          cx="100"
          cy="104"
          rx="94"
          ry="30"
          fill="none"
          stroke="var(--color-lime-300)"
          strokeWidth="0.5"
          opacity="0.22"
        />
      </svg>

      <span className="absolute inset-0 grid place-items-center">
        <span className="font-display text-5xl font-extrabold tracking-tight text-white/85">
          {initials}
        </span>
      </span>
    </div>
  );
}
