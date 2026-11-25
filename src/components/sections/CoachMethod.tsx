import { coachIntroVideo } from '@/content/media';
import { advantages } from '@/content/method';
import { trainingSteps } from '@/content/training';
import { Section, SectionHeading } from '../ui';
import { VideoCard } from '../VideoCard';

/* Пункты методики, которые описывают именно работу тренера на занятии. */
const methodIds = ['technique', 'styles', 'group', 'system'];

/*
  Как Ярослав Сергеевич ведёт занятие.

  Всё из method.ts и training.ts: ни одного нового обещания. Рядом ролик-
  знакомство — тот же VideoCard, что на главной, без правок (фиолетовые
  эффекты вшиты в сам кадр). Полный разбор 45 минут остался на /bassein/.
*/
export function CoachMethod() {
  const items = methodIds.flatMap((id) => {
    const item = advantages.find((a) => a.id === id);
    return item ? [item] : [];
  });

  return (
    <Section
      id="how-it-goes"
      labelledBy="coach-method-title"
      className="bg-surface-alt [overflow-wrap:anywhere]"
    >
      <div className="grid gap-10 md:grid-cols-[260px_1fr] md:gap-14">
        <div className="reveal mx-auto w-full max-w-[260px] md:mx-0">
          <VideoCard
            goal="play_coach_video"
            src={coachIntroVideo.src}
            poster={coachIntroVideo.poster}
            label={coachIntroVideo.alt}
            width={coachIntroVideo.width}
            height={coachIntroVideo.height}
          />
        </div>

        <div>
          <SectionHeading
            id="coach-method-title"
            eyebrow="Методика"
            title="Как Ярослав Сергеевич ведёт занятие"
            lead="Занятие длится 45 минут и идёт по плану. Тренер ведёт его лично, в каждой группе."
          />

          <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.id} className="reveal border-t border-hairline pt-4">
                <h3 className="text-lg font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            План занятия
          </p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {trainingSteps.map((step) => (
              <li
                key={step.id}
                className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm text-ink-soft"
              >
                {step.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
