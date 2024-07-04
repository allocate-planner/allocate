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
  formatISO,
  getDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";

import { useAuth } from "@/AuthProvider";
import { eventService } from "@/services/EventService";
import { IEvent, ITransformedEvent, IEventCreate } from "@/models/IEvent";

import EventPopup from "./EventPopup";
import EventDetailPopup from "./EventDetailPopup";

import Event from "./Event";
import { toast } from "sonner";

const currentWeekAtom = atom(new Date());

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

  const [events, setEvents] = useState<ITransformedEvent[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<IEventCreate | null>();
  const [isEventPopupOpen, setIsEventPopupOpen] = useState<boolean>(false);

  const [selectedEvent, setSelectedEvent] =
    useState<ITransformedEvent | null>();
  const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] =
    useState<boolean>(false);

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

  const formatTimeFromHour = (hour: number): string => {
    const date = new Date();

    const timeWithHour = setHours(date, hour);
    const timeWithMinutes = setMinutes(timeWithHour, 0);
    const timeWithSeconds = setSeconds(timeWithMinutes, 0);
    const timeWithMilliseconds = setMilliseconds(timeWithSeconds, 0);

    return formatISO(timeWithMilliseconds, { representation: "time" });
  };

  const transformEvents = (eventsData: {
    events: IEvent[];
  }): ITransformedEvent[] => {
    return eventsData.events.map((event: IEvent) => {
      const eventWeekStart = startOfWeek(parseISO(event.date));

      const startTimeParts = event.start_time.split(":");
      const endTimeParts = event.end_time.split(":");

      const eventDate = parseISO(event.date);
      const startTime = startTimeParts[0];
      const endTime = endTimeParts[0];

      return {
        ...event,
        event_week_start: eventWeekStart,
        day: getDay(eventDate),
        start_time: startTime,
        end_time: endTime,
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

  const createEvent = async (event: IEventCreate) => {
    try {
      if (accessToken) {
        await eventService.createEvent(event, accessToken);
        toast.success("Event was created");

        eventData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Event was not created");
    }

    setIsEventPopupOpen(false);
  };

  const editEvent = async (event: ITransformedEvent, title: string) => {
    if (title.length === 0) {
      setIsEventDetailPopupOpen(false);
      return;
    }

    const updatedEvent = {
      ...event,
      title: title,
      start_time: formatTimeFromHour(+event.start_time),
      end_time: formatTimeFromHour(+event.start_time + 1),
    };

    try {
      if (accessToken) {
        await eventService.editEvent(updatedEvent, accessToken);
        toast.success("Event was edited");

        eventData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Event was not edited");
    }

    setIsEventDetailPopupOpen(false);
  };

  const deleteEvent = async (event: ITransformedEvent) => {
    try {
      if (accessToken) {
        await eventService.deleteEvent(event.id, accessToken);
        toast.success("Event was deleted");

        eventData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Event was not deleted");
    }

    setIsEventDetailPopupOpen(false);
  };

  const getEventsForTimeSlot = (day: number, hour: number) => {
    return events.filter(
      (event: ITransformedEvent) =>
        isSameDay(event.event_week_start, weekStart) &&
        event.day === day &&
        +event.start_time == hour
    );
  };

  const handleEventClick = (day: number, hour: number) => {
    const dateFromWeekAndDay = addDays(weekStart, day);

    const newEvent: IEventCreate = {
      date: format(dateFromWeekAndDay, "yyyy-MM-dd"),
      start_time: formatTimeFromHour(hour),
      end_time: formatTimeFromHour(hour + 1),
    };

    setSelectedSlot(newEvent);
    setIsEventPopupOpen(true);
  };

  const handleEventDetailsClick = (event: ITransformedEvent) => {
    setSelectedEvent(event);
    setIsEventDetailPopupOpen(true);
  };

  const closeEventPopup = () => {
    setSelectedSlot(null);
    setIsEventPopupOpen(false);
  };

  const closeEventDetailPopup = () => {
    setSelectedEvent(null);
    setIsEventDetailPopupOpen(false);
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

      <div className="grid grid-cols-8 grid-rows-[repeat(24,1fr))] h-full w-full overflow-y-scroll no-scrollbar">
        <div className="col-span-1 row-span-24 w-full h-full">
          {calendarHours.map((hour: number) => (
            <div
              key={hour}
              className={`w-full min-w-0 ${
                hour === calendarHours.length - 1 ? "" : "border-b"
              } `}
            >
              <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-start h-[56px] p-4">
                <h2 className="text-sm">{formatHour(hour)}</h2>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-full col-span-7 row-span-24 grid-rows-subgrid grid-cols-subgrid grid">
          {daysOfWeek.map((day: number) => (
            <div
              key={day}
              className="w-full h-full min-w-0 col-span-1 row-span-24 grid grid-rows-subgrid grid-cols-subgrid box-border"
            >
              {calendarHours.map((hour: number) => {
                const events = getEventsForTimeSlot(day, hour);

                if (events.length > 0) {
                  return events.map((event) => (
                    <Event
                      title={event.title}
                      startTime={+event.start_time}
                      endTime={+event.end_time}
                      onClick={() => handleEventDetailsClick(event)}
                      key={`${day}-${hour}`}
                    />
                  ));
                } else {
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="border-r-[1px] border-b-[1px] border-gray-300 flex flex-col text-sm items-start w-full h-[56px] box-border px-4 py-1 row-span-1"
                      onClick={() => handleEventClick(day, hour)}
                    />
                  );
                }
              })}
            </div>
          ))}
          {selectedSlot && (
            <EventPopup
              isOpen={isEventPopupOpen}
              event={selectedSlot}
              onClose={closeEventPopup}
              onCreate={createEvent}
            />
          )}

          {selectedEvent && (
            <EventDetailPopup
              isOpen={isEventDetailPopupOpen}
              event={selectedEvent}
              onClose={closeEventDetailPopup}
              onEdit={editEvent}
              onDelete={deleteEvent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
