import { format } from 'date-fns';
import type { TimeSlot } from '../types/booking';

/** Local Date at midnight for a `YYYY-MM-DD` string (avoids UTC parsing shifts). */
function dateFromIso(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** `"09:00"` → `"9:00 AM"` */
function formatSlotTime(hhmm: string): string {
  const [hour, minute] = hhmm.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
}

/** `"Mon, 14 Jul · 10:00 AM – 11:00 AM"` */
function formatSlotLabel(slot: TimeSlot): string {
  return `${format(dateFromIso(slot.date), 'EEE, d MMM')} · ${formatSlotTime(slot.startTime)} – ${formatSlotTime(slot.endTime)}`;
}

/** ISO instant → `"Mon, 14 Jul · 10:00 AM"` (confirmation / booking cards). */
function formatScheduledAt(iso: string): string {
  const date = new Date(iso);
  return `${format(date, 'EEE, d MMM')} · ${format(date, 'h:mm a')}`;
}

interface SlotPeriodGroup {
  label: 'Morning' | 'Afternoon' | 'Evening';
  slots: TimeSlot[];
}

/** Groups slots into Morning (before 12), Afternoon (12–16), Evening (17+). */
function groupSlotsByPeriod(slots: TimeSlot[]): SlotPeriodGroup[] {
  const groups: SlotPeriodGroup[] = [
    { label: 'Morning', slots: [] },
    { label: 'Afternoon', slots: [] },
    { label: 'Evening', slots: [] },
  ];
  for (const slot of slots) {
    const hour = Number(slot.startTime.slice(0, 2));
    if (hour < 12) groups[0].slots.push(slot);
    else if (hour < 17) groups[1].slots.push(slot);
    else groups[2].slots.push(slot);
  }
  return groups.filter((group) => group.slots.length > 0);
}

export { dateFromIso, formatScheduledAt, formatSlotLabel, formatSlotTime, groupSlotsByPeriod };
export type { SlotPeriodGroup };
