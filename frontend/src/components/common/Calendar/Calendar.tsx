import { useEffect, useState } from "react";

import { atom, useAtom } from "jotai";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { Button } from "../Button";

import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
  getDay,
} from "date-fns";

import { useAuth } from "@/AuthProvider";
import { eventService } from "@/services/EventService";
import { IEvent, ITransformedEvent } from "@/models/IEvent";

import Event from "./Event";

const currentWeekAtom = atom(new Date());

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

  const [events, setEvents] = useState<ITransformedEvent[]>([]);

  const { getAccessToken } = useAuth();
  const accessToken = getAccessToken();

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  const calendarHours: number[] = Array.from({ length: 24 }, (_, i) => i);
  const daysOfWeek: number[] = Array.from({ length: 7 }, (_, i) => i);
  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) =>
    addDays(weekStart, i)
  );

  const moveWeek = (direction: number): void => {
    setCurrentWeek((prevWeek: Date) => addDays(prevWeek, direction * 7));
  };

  const formatHour = (hour: number): string => {
    const period = hour < 12 ? "am" : "pm";

    return `${hour.toString().padStart(2, "0")}:00${period}`;
  };

  const transformEvents = (eventsData: {
    events: IEvent[];
  }): ITransformedEvent[] => {
    console.log(events);
    return eventsData.events.map((event: IEvent) => {
      const startTimeParts = event.start_time.split(":");
      const endTimeParts = event.end_time.split(":");

      const eventDate = parseISO(event.date);
      const startTime = startTimeParts[0];
      const endTime = endTimeParts[0];

      return {
        ...event,
        title: event.title,
        day: getDay(eventDate),
        start_time: +startTime,
        end_time: +endTime,
      };
    });
  };

  const eventData = async () => {
    try {
      if (accessToken) {
        const events = await eventService.getEvents(accessToken);
        setEvents(transformEvents(events));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEventsForTimeSlot = (day: number, hour: number) => {
    return events.filter(
      (event: ITransformedEvent) =>
        event.day === day && event.start_time == hour
    );
  };

  useEffect(() => {
    eventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-[87.5%] flex flex-col items-start border-[1px] bg-[#F8F8F8] rounded-xl border-gray-300 m-12">
      <div className="grid grid-cols-8 grid-rows-1 w-full">
        <div className="col-span-8 border-b border-gray-300 flex justify-center items-center space-x-8 p-4">
          <ArrowLeftIcon
            className="w-6 h-6 cursor-pointer hover:scale-125 transform transition duration-300"
            onClick={() => moveWeek(-1)}
          />
          <h2 className="text-lg font-semibold">
            {format(weekStart, "d MMMM")} — {format(weekEnd, "d MMMM yyyy")}
          </h2>
          <ArrowRightIcon
            className="w-6 h-6 cursor-pointer hover:scale-125 transform transition duration-300"
            onClick={() => moveWeek(1)}
          />
          <Button
            className="bg-violet-100 border border-violet-400 text-violet-700 h-2/3 rounded-xl hover:bg-violet-200"
            onClick={() => setCurrentWeek(new Date())}
          >
            Today
          </Button>
        </div>
        <div className="border-r border-b border-gray-300 flex flex-col justify-center items-center p-4 ">
          <h3 className="font-light text-lg">Time</h3>
        </div>
        {weekDays.map((day: Date) => (
          <div
            key={day.toISOString()}
            className={`
            border-r border-b
            ${
              isSameDay(day, new Date())
                ? "border-b-violet-400"
                : "border-gray-300"
            } 
            flex flex-col justify-center items-center p-4 last:border-r-0
          `}
          >
            <h3 className="font-bold text-lg">{format(day, "EEEE")}</h3>
            <p className="text-sm">{format(day, "d MMMM")}</p>
          </div>
        ))}
      </div>
      <div className="h-full w-full overflow-y-scroll no-scrollbar">
        {calendarHours.map((hour: number) => (
          <div
            className={`grid grid-cols-8 grid-rows-1 w-full ${
              hour === calendarHours.length - 1 ? "" : "border-b"
            } `}
          >
            <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-start p-4">
              <h2 className="text-sm">{formatHour(hour)}</h2>
            </div>
            {daysOfWeek.map((day: number) => (
              <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-1 last:border-r-0">
                {getEventsForTimeSlot(day, hour).map((event) => (
                  <Event
                    title={event.title}
                    startTime={event.start_time}
                    endTime={event.end_time}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
