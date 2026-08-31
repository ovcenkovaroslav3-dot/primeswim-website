import { proofPoints } from '@/content/method';

/*
  Полоса доказательств — первое, что идёт после первого экрана.

  Родитель только что прочитал обещание. Дальше он либо получает основания
  ему верить, либо уходит. Раньше на этом месте начиналась большая секция
  «Почему мы» с рассуждением про технику: аргумент верный, но он требует
  чтения, а здесь нужна проверяемая конкретика за один взгляд.

  Секция намеренно низкая — это полоса, а не блок. Ни заголовка, ни
  подводки: каждый пункт сам себе утверждение, а лишний заголовок отодвинул
  бы вниз всё, что за ним.

  Тёмная, потому что стоит вплотную к первому экрану и дочитывает его —
  светлая полоса здесь резала бы страницу пополам сразу после hero.
*/
export function ProofStrip() {
  return (
    <section
      aria-label="Коротко о школе"
      className="on-dark bg-abyss-900 px-4 py-8 text-white sm:px-6 sm:py-10"
    >
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
        {proofPoints.map((point, i) => (
          <li
            key={point.id}
            className="reveal"
            style={{ ['--reveal-delay' as string]: `${i * 70}ms` }}
          >
            <p className="text-base leading-snug font-medium text-lime-300 sm:text-lg">
              {point.value}
            </p>
            <p className="mt-1.5 text-sm leading-snug text-white/60">
              {point.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
