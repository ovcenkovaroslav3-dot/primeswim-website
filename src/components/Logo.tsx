/**
 * Текстовый логотип PRIME SWIM.
 * Свёрстан текстом, а не картинкой: чёткий на любом экране и не тормозит первый экран.
 *
 * Слова написаны слитно, поэтому разделяет их только цвет. На тёмном это пара
 * из фирменных белого и лайма. На светлом лайм пришлось бы тушить до
 * оливкового — он читается грязно, поэтому там знак целиком фиолетовый, а
 * границу слова держит перепад светлоты внутри одного тона.
 */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="font-display text-xl leading-none font-extrabold tracking-tight sm:text-2xl lg:text-xl xl:text-2xl">
      <span className={inverted ? 'text-white' : 'text-brand-600'}>PRIME</span>
      <span className={inverted ? 'text-lime-400' : 'text-brand-400'}>
        SWIM
      </span>
    </span>
  );
}
