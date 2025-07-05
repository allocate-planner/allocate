import { useMemo } from "react";

import { isSameDay } from "date-fns";

import { times, transformTo24HourFormat } from "@/utils/TimeUtils";
import type { ITransformedEvent } from "@/models/IEvent";

import Event from "@/components/pages/Calendar/components/events/Event";
import EventEmpty from "@/components/pages/Calendar/components/events/EventEmpty";

import type { CalendarView } from "@/components/pages/Calendar/hooks/useCalendarView";

interface IProps {
  daysOfWeek: number[];
  calendarView: CalendarView;
  events: ITransformedEvent[];
  onEventClick: (day: number, timeSlot: string) => void;
  onEventDetailsClick: (event: ITransformedEvent) => void;
  weekStart: Date;
}

export const CalendarGrid = ({
  daysOfWeek,
  calendarView,
  events,
  onEventClick,
  onEventDetailsClick,
  weekStart,
}: IProps) => {
  const getColSpan = () => {
    switch (calendarView) {
      case "single":
        return "col-span-1";
      case "triple":
        return "col-span-3";
      default:
        return "col-span-7";
    }
  };

  const getEventsForTimeSlot = (day: number, time: string) => {
    return events.filter(
      (event: ITransformedEvent) =>
        isSameDay(event.event_week_start, weekStart) &&
        event.day === day &&
        event.start_time == transformTo24HourFormat(time)
    );
  };

  const eventClickHandlers = useMemo(() => {
    const handlers = new Map();
    events.forEach((event: ITransformedEvent) => {
      handlers.set(event.id, () => onEventDetailsClick(event));
    });
    return handlers;
  }, [events, onEventDetailsClick]);

  return (
    <div
      className={`${getColSpan()} w-full h-full row-span-48 grid-rows-subgrid grid-cols-subgrid grid divide-gray-200 divide-x`}
    >
      {daysOfWeek.map((day: number) => (
        <div
          key={day}
          className="w-full h-full min-w-0 col-span-1 row-span-48 grid grid-rows-subgrid grid-cols-subgrid box-border divide-gray-200 divide-y"
        >
          {times.map((timeSlot: string, index: number) => {
            const events = getEventsForTimeSlot(day, timeSlot);

            if (events.length > 0) {
              return events.map(event => (
                <Event
                  id={event.id}
                  title={event.title}
                  colour={event.colour}
                  startTime={event.start_time}
                  endTime={event.end_time}
                  onClick={eventClickHandlers.get(event.id)}
                  key={`${day}-${index}`}
                />
              ));
            } else {
              return (
                <EventEmpty
                  key={`${day}-${index}`}
                  id={`${day}-${index}`}
                  onClick={() => onEventClick(day, timeSlot)}
                />
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};
