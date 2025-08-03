import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { calendarHours, times, transformTo24HourFormat } from "@/utils/TimeUtils";
import { weekEventsAtom } from "@/atoms/eventsAtom";
import type { ITransformedEvent } from "@/models/IEvent";

import Event from "@/components/pages/Calendar/components/events/Event";
import EventEmpty from "@/components/pages/Calendar/components/events/EventEmpty";

import type { CalendarView } from "@/components/pages/Calendar/hooks/useCalendarView";
import React from "react";

interface IProps {
  daysOfWeek: number[];
  calendarView: CalendarView;
  onEventClick: (day: number, timeSlot: string) => void;
  onEventDetailsClick: (event: ITransformedEvent) => void;
}

const CalendarGridComponent = ({
  daysOfWeek,
  calendarView,
  onEventClick,
  onEventDetailsClick,
}: IProps) => {
  const events = useAtomValue(weekEventsAtom);

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

  const eventLookup = useMemo(() => {
    const map = new Map<string, ITransformedEvent[]>();
    events.forEach((event: ITransformedEvent) => {
      const key = `${event.day}-${event.start_time}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    });
    return map;
  }, [events]);

  const getEventsForTimeSlot = (day: number, time: string) => {
    return eventLookup.get(`${day}-${transformTo24HourFormat(time)}`) ?? [];
  };

  const eventClickHandlers = useMemo(() => {
    const handlers = new Map<string, () => void>();
    events.forEach((event: ITransformedEvent) => {
      const key = `${event.id}-${event.date}`;
      handlers.set(key, () => onEventDetailsClick(event));
    });
    return handlers;
  }, [events, onEventDetailsClick]);

  return (
    <div
      className={`${getColSpan()} w-full h-full row-span-48 grid-rows-subgrid grid-cols-subgrid grid`}
    >
      {daysOfWeek.map((day: number, dayIndex: number) => (
        <div
          key={day}
          className={`w-full h-full min-w-0 col-span-1 row-span-48 grid grid-rows-subgrid grid-cols-subgrid box-border divide-gray-200 divide-y relative ${dayIndex > 0 ? "border-l border-gray-200" : "border-l-0"}`}
        >
          {calendarHours.map((hour: number, index: number) => {
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
                {getEventsForTimeSlot(day, timeSlotForTop).map(event => {
                  const compositeId = `${event.id}-${event.date}`;
                  const clickHandler = eventClickHandlers.get(compositeId);

                  return (
                    <Event
                      key={compositeId}
                      id={compositeId}
                      title={event.title}
                      colour={event.colour}
                      startTime={event.start_time}
                      endTime={event.end_time}
                      {...(clickHandler && { onClick: clickHandler })}
                    />
                  );
                })}
                {getEventsForTimeSlot(day, timeSlotForBottom).map(event => {
                  const compositeId = `${event.id}-${event.date}`;
                  const clickHandler = eventClickHandlers.get(compositeId);

                  return (
                    <Event
                      key={compositeId}
                      id={compositeId}
                      title={event.title}
                      colour={event.colour}
                      startTime={event.start_time}
                      endTime={event.end_time}
                      {...(clickHandler && { onClick: clickHandler })}
                    />
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const CalendarGrid = React.memo(CalendarGridComponent);
