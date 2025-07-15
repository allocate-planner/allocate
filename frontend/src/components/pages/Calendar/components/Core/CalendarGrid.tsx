import { useMemo } from "react";

import { isSameDay } from "date-fns";

import { calendarHours, times, transformTo24HourFormat } from "@/utils/TimeUtils";
import type { ITransformedEvent } from "@/models/IEvent";

import Event from "@/components/pages/Calendar/components/events/Event";
import EventEmpty from "@/components/pages/Calendar/components/events/EventEmpty";

import type { CalendarView } from "@/components/pages/Calendar/hooks/useCalendarView";
import React from "react";

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
          className="w-full h-full min-w-0 col-span-1 row-span-48 grid grid-rows-subgrid grid-cols-subgrid box-border divide-gray-200 divide-y relative"
        >
          {calendarHours.map((_: number, index: number) => {
            const timeSlotForTop = times[index * 2]!;
            const timeSlotForBottom = times[index * 2 + 1]!;

            return (
              <React.Fragment key={`${day}-${index}`}>
                <div className="flex flex-col relative row-span-2">
                  <EventEmpty
                    id={`${day}-${index * 2}`}
                    onClick={() => onEventClick(day, timeSlotForTop)}
                  />
                  <EventEmpty
                    id={`${day}-${index * 2 + 1}`}
                    onClick={() => onEventClick(day, timeSlotForBottom)}
                  />
                </div>
                {getEventsForTimeSlot(day, timeSlotForTop).map(event => (
                  <Event
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    colour={event.colour}
                    startTime={event.start_time}
                    endTime={event.end_time}
                    onClick={eventClickHandlers.get(event.id)}
                  />
                ))}
                {getEventsForTimeSlot(day, timeSlotForBottom).map(event => (
                  <Event
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    colour={event.colour}
                    startTime={event.start_time}
                    endTime={event.end_time}
                    onClick={eventClickHandlers.get(event.id)}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
