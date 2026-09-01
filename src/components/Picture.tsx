import imageLoader from '@/lib/image-loader';

/*
  Картинка в двух форматах.

  ЗАЧЕМ НЕ next/image. На статике оптимизации нет вообще: свой загрузчик
  умеет только приклеить basePath, вариантов по ширине не создаёт и srcset
  не отдаёт (см. next.config.ts). То есть от next/image здесь оставались
  ленивая загрузка и атрибуты размеров — и то и другое умеет обычный <img>.
  Зато next/image рендерит ровно один <img> с одним src и не умеет <picture>,
  а без <picture> нельзя отдать современный формат с запасным вариантом.

  Размер файлов мы уже привели к размеру показа (media/preview). Осталась
  вторая половина: формат. AVIF при сопоставимом качестве весит на треть
  меньше — 3 897 KB против 2 479 KB на всём наборе, который сайт отдаёт.
  WebP пробовали, он дал всего 14%: JPEG у нас уже сжаты прогрессивно и
  под нужный размер, и отыгрывать WebP было почти нечего.

  ПОЧЕМУ ЭТО БЕЗОПАСНО. <picture> устроен так, что браузер берёт первый
  формат, который понимает. Не понял AVIF — молча грузит JPEG из <img>.
  Никаких проверок в JavaScript, никакой деградации: у старого браузера
  всё ровно как было.

  Пути AVIF не хранятся в контенте: они выводятся из адреса JPEG заменой
  расширения. Файлы лежат рядом и собираются одной командой — рецепт в
  public/media/preview/README.md. Если .avif не окажется, сломается только
  <source>, а <img> отработает.
*/
export function Picture({
  src,
  alt,
  width,
  height,
  sizes,
  className = '',
  /*
    Для первого экрана. Снимает ленивую загрузку и просит браузер взяться
    за файл раньше остальных: это кандидат в LCP, и по умолчанию он вставал
    бы в общую очередь. Везде остальном — false.
  */
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const jpeg = imageLoader({ src });
  const avif = imageLoader({ src: src.replace(/\.jpe?g$/i, '.avif') });

  return (
    /* block: по умолчанию picture строчный и добавляет зазор под картинкой */
    <picture className="block">
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img
        src={jpeg}
        alt={alt}
        /*
          width и height обязательны и на растянутых картинках тоже: браузер
          считает по ним пропорции и резервирует место до загрузки. Без них
          страница дёргается, когда картинка приезжает.
        */
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className={className}
      />
    </picture>
  );
}
