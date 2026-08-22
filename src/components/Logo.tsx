/**
 * Текстовый логотип PRIME SWIM.
 * Свёрстан текстом, а не картинкой: чётко на любом экране и не тормозит первый экран.
 */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="font-display text-xl leading-none font-extrabold tracking-tight sm:text-2xl">
      <span className={inverted ? 'text-white' : 'text-brand-600'}>PRIME</span>
      <span className={inverted ? 'text-lime-brand' : 'text-lime-brand-deep'}>
        SWIM
      </span>
    </span>
  );
}
