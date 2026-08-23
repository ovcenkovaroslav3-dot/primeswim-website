/**
 * Загрузчик картинок для статической сборки.
 *
 * На статике нет сервера, который пересжимал бы изображения, поэтому путь
 * отдаётся как есть. Единственная задача загрузчика — приклеить basePath:
 * встроенный загрузчик Next этого не делает, когда оптимизация отключена,
 * и на GitHub Pages все картинки отдавали бы 404.
 *
 * При переезде на собственный домен NEXT_PUBLIC_BASE_PATH пустеет,
 * и загрузчик перестаёт что-либо менять.
 */
export default function imageLoader({ src }: { src: string }): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  // внешние адреса и data-URI трогать нельзя
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;

  return `${base}${src.startsWith('/') ? '' : '/'}${src}`;
}
