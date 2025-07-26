import { atom } from "jotai";
import { isToday, parseISO, isSameWeek } from "date-fns";
import type { ITransformedEvent } from "@/models/IEvent";

export const eventsAtom = atom<ITransformedEvent[]>([]);

export const currentWeekAtom = atom<Date>(new Date());

export const todaysEventsAtom = atom(get => {
  const events = get(eventsAtom);
  return events.filter(event => isToday(parseISO(event.date)));
});

export const weekEventsAtom = atom(get => {
  const events = get(eventsAtom);
  const currentWeek = get(currentWeekAtom);
  return events.filter(event => isSameWeek(parseISO(event.date), currentWeek, { weekStartsOn: 0 }));
});
