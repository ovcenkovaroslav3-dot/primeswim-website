import { schedule } from './schedule.ts';

/** Owner-requested campaign. No seat counts or start dates are promised. */
export const enrollmentDayIds = ['tue', 'wed', 'thu'] as const;
export const enrollmentSlots = schedule.filter((slot) =>
  enrollmentDayIds.some((id) => id === slot.id),
);
export const enrollmentSummary = enrollmentSlots
  .map((slot) => `${slot.short} ${slot.times.join(' / ')}`)
  .join(' · ');
export const isEnrollmentDay = (id: string) =>
  enrollmentDayIds.some((day) => day === id);
