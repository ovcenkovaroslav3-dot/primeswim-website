import { coaches } from '@/content/coaches';
import { coachIntroVideo } from '@/content/media';
import { ArrowLink } from '../ui';
import { VideoCard } from '../VideoCard';

/*
  Тренер на главной — короткая карточка, а не вторая копия страницы.

  Ярослав ведёт занятия лично: для родителя это не сведения о персонале,
  а сведения о самой услуге — кто будет стоять у бортика рядом с его
  ребёнком. Поэтому блок стоит на главной, а не только на /trener/.

  Здесь ровно три вещи: лицо, стаж и что именно человек делает. Биография,
  полный список направлений и разбор методики остались на /trener/ —
  дублировать их значило бы получить два текста, которые однажды разойдутся.

  Фон тёмный, как и на самой странице тренера: цифра стажа лаймом по
  толще читается раньше любого текста, ради этого блок и тёмный.
*/
export function CoachPreview() {
  const coach = coaches[0];
  if (!coach) return null;

  return (
    <section
      aria-labelledby="coach-preview-title"
      className="on-dark relative overflow-clip bg-abyss-900 px-4 py-14 text-white sm:px-6 sm:py-16 md:py-28"
    >
      <div
        aria-hidden="true"
        className="parallax pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-brand-500/22 blur-3xl"
        style={{
          ['--parallax-from' as string]: '12%',
          ['--parallax-to' as string]: '-12%',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[260px_1fr] md:items-center md:gap-14">
        {/*
          Вместо портрета — видео-знакомство: то же лицо, но человек ещё и
          говорит. Портрет остался на /trener/, дублировать его здесь незачем.

          preload="none" — на странице не грузится ни байта видео, пока
          родитель не нажал play; до этого виден только постер, он же кадр
          из самого ролика. Кадр вертикальный, 9:16, поэтому колонка держит
          пропорции сама, без фиксированной высоты.

          Своя кнопка воспроизведения вместо нативной панели: браузер рисует
          её поверх постера серой полосой во всю ширину — единственное место
          на сайте, выглядевшее вставкой с видеохостинга. Разбор — в
          VideoCard.tsx. Автозапуска нет и не будет: в ролике речь.
        */}
        <div className="reveal mx-auto w-full max-w-[260px]">
          <VideoCard
            src={coachIntroVideo.src}
            poster={coachIntroVideo.poster}
            label={coachIntroVideo.alt}
            width={coachIntroVideo.width}
            height={coachIntroVideo.height}
          />
        </div>

        <div className="reveal" style={{ ['--reveal-delay' as string]: '90ms' }}>
          <p className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
            Тренер
          </p>

          <h2
            id="coach-preview-title"
            className="mt-4 text-3xl leading-[1.08] font-normal tracking-[-0.02em] sm:text-4xl"
          >
            {coach.name}
          </h2>
          <p className="mt-2 text-white/70">{coach.role}</p>

          {/* выравнивание по низу: у многострочной подписи базовая линия
              берётся от первой строки, и подпись цеплялась за верх цифры */}
          <p className="mt-7 flex items-end gap-4">
            <span className="text-5xl leading-none font-extralight tabular-nums text-lime-300 sm:text-6xl">
              {coach.yearsExperience}
            </span>
            <span className="mb-1.5 max-w-[13ch] text-sm leading-snug text-white/60">
              лет тренерской работы
            </span>
          </p>

          <p className="mt-7 max-w-[58ch] leading-relaxed text-white/70">
            {coach.bio[0]}
          </p>

          <ArrowLink href="/trener/" tone="white" className="mt-8">
            О тренере и методике
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
