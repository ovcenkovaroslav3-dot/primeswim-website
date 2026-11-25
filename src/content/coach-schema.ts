import { coaches } from './coaches.ts';
import { strokes } from './method.ts';
import { site } from './site.ts';

/**
 * Разметка страницы тренера: ProfilePage с Person в mainEntity.
 *
 * Собирается только из подтверждённых полей coaches.ts и method.ts —
 * ничего, чего нет на самой странице. Идентификаторы приходят аргументами,
 * чтобы файл не зависел от компонентов и проверялся обычным тестом.
 * Статьи блога ссылаются на тот же personId, поэтому поиск видит одного
 * автора, а не десять тёзок.
 */
export function buildCoachProfile(ids: { organization: string; person: string }) {
  const coach = coaches[0];
  if (!coach) throw new Error('coaches.ts пуст');

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${site.url}/trener/`,
    mainEntity: {
      '@type': 'Person',
      '@id': ids.person,
      name: coach.name,
      jobTitle: coach.role,
      description: coach.bio.join(' '),
      image: `${site.url}${coach.photo.src}`,
      url: `${site.url}/trener/`,
      worksFor: {
        '@type': 'Organization',
        '@id': ids.organization,
        name: site.name,
        url: site.url,
      },
      knowsAbout: strokes.map((stroke) => stroke.name),
    },
  };
}
