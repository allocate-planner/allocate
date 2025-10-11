import { atom } from "jotai";
import { parseISO, isSameWeek, isWithinInterval, addDays, startOfDay } from "date-fns";
import type { ITransformedEvent } from "@/models/IEvent";

export const eventsAtom = atom<ITransformedEvent[]>([]);
export const currentDayAtom = atom<Date>(new Date());

export const weekEventsAtom = atom(get => {
  const events = get(eventsAtom);
  const currentDay = get(currentDayAtom);

  return events.filter(event => isSameWeek(parseISO(event.date), currentDay, { weekStartsOn: 0 }));
});

export const scheduledEventsAtom = atom(get => {
  const events = get(eventsAtom);
  const today = startOfDay(new Date());

  const sevenDaysBefore = addDays(today, -7);
  const sevenDaysAfter = addDays(today, 7);

  return events.filter(event =>
    isWithinInterval(parseISO(event.date), { start: sevenDaysBefore, end: sevenDaysAfter })
  );
});
