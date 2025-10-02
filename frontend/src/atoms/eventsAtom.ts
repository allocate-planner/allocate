import { atom } from "jotai";
import { parseISO, isSameWeek, isWithinInterval, addDays, startOfDay } from "date-fns";
import type { ITransformedEvent } from "@/models/IEvent";

export const eventsAtom = atom<ITransformedEvent[]>([]);

export const currentWeekAtom = atom<Date>(new Date());

export const weekEventsAtom = atom(get => {
  const events = get(eventsAtom);
  const currentWeek = get(currentWeekAtom);
  return events.filter(event => isSameWeek(parseISO(event.date), currentWeek, { weekStartsOn: 0 }));
});

export const next7DaysEventsAtom = atom(get => {
  const events = get(eventsAtom);
  const today = startOfDay(new Date());
  const sevenDaysFromNow = addDays(today, 6);

  return events.filter(event =>
    isWithinInterval(parseISO(event.date), { start: today, end: sevenDaysFromNow })
  );
});
