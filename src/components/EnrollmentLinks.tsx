import { enrollmentSlots } from '@/content/enrollment';
import { slotValue } from '@/content/schedule';
import { SlotBookButton } from './SlotBookButton';

export function EnrollmentLinks({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1">
      {enrollmentSlots.flatMap((slot) => slot.times.map((time) => (
        <SlotBookButton
          key={slotValue(slot.id, time)}
          value={slotValue(slot.id, time)}
          time={slot.short + ' ' + time}
          label={slot.day + ', ' + time}
          compact
          dark={dark}
        />
      )))}
    </div>
  );
}
