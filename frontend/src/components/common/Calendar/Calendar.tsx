import { useEffect, useState, useCallback, useMemo } from "react";
import { DndContext, useSensors, useSensor, MouseSensor, type DragEndEvent } from "@dnd-kit/core";

import { atom, useAtom } from "jotai";

import { ArrowLeftIcon, ArrowRightIcon, Bars3Icon } from "@heroicons/react/24/outline";

import { Button } from "../Button";

import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
  isWithinInterval,
} from "date-fns";

import { useAuth } from "@/AuthProvider";
import { eventService } from "@/services/EventService";
import type { ITransformedEvent, IEventCreate } from "@/models/IEvent";

import EventPopup from "./EventPopup";
import EventDetailPopup from "./EventDetailPopup";

import Event from "./Event";
import { toast } from "sonner";
import {
  calculateNewDateFromDaySlot,
  calculateNewEndSlot,
  calendarHours,
  convertTimeSlotIndexToISO,
  formatDate,
  formatHour,
  formatISOFromTimeSlot,
  times,
  transformTo24HourFormat,
} from "@/utils/TimeUtils";
import EmptyTimeSlot from "./EmptyTimeSlot";
import { SidebarOpen } from "lucide-react";

const currentWeekAtom = atom(new Date());

interface IProps {
  events: ITransformedEvent[];
  eventData: (startDate: string, endDate: string) => void;
  dateData: (currentWeek: Date) => { startDate: string; endDate: string };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Calendar = (props: IProps) => {
  const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

  const [selectedSlot, setSelectedSlot] = useState<IEventCreate | null>();
  const [isEventPopupOpen, setIsEventPopupOpen] = useState<boolean>(false);

  const [selectedEvent, setSelectedEvent] = useState<ITransformedEvent | null>();
  const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState<boolean>(false);

  const [calendarView, setCalendarView] = useState<"single" | "triple" | "full">("full");

  const { getAccessToken } = useAuth();
  const accessToken = getAccessToken();

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  const moveWeek = (direction: number): void => {
    setCurrentWeek((prevWeek: Date) => addDays(prevWeek, direction * 7));
  };

  const createEvent = async (event: IEventCreate) => {
    try {
      if (accessToken) {
        await eventService.createEvent(event, accessToken);
        toast.success("Event was created");

        const { startDate, endDate } = props.dateData(currentWeek);

        props.eventData(startDate, endDate);
      }
    } catch (error) {
      toast.error("Event was not created");
    }

    setIsEventPopupOpen(false);
  };

  const editEvent = async (event: ITransformedEvent) => {
    try {
      if (accessToken) {
        await eventService.editEvent(event, accessToken);
        toast.success("Event was edited");

        const { startDate, endDate } = props.dateData(currentWeek);

        props.eventData(startDate, endDate);
      }
    } catch (error) {
      toast.error("Event was not edited");
    }

    setSelectedEvent(null);
    setIsEventDetailPopupOpen(false);
  };

  const deleteEvent = async (event: ITransformedEvent) => {
    try {
      if (accessToken) {
        await eventService.deleteEvent(event.id, accessToken);
        toast.success("Event was deleted");

        const { startDate, endDate } = props.dateData(currentWeek);

        props.eventData(startDate, endDate);
      }
    } catch (error) {
      toast.error("Event was not deleted");
    }

    setSelectedEvent(null);
    setIsEventDetailPopupOpen(false);
  };

  const getEventsForTimeSlot = (day: number, time: string) => {
    return props.events.filter(
      (event: ITransformedEvent) =>
        isSameDay(event.event_week_start, weekStart) &&
        event.day === day &&
        event.start_time == transformTo24HourFormat(time)
    );
  };

  const handleEventClick = (day: number, time: string) => {
    const timeSlot = transformTo24HourFormat(time).split(":").map(Number);
    const dateFromWeekAndDay = addDays(weekStart, day);

    const newEvent: IEventCreate = {
      date: formatDate(dateFromWeekAndDay),
      start_time: formatISOFromTimeSlot(timeSlot[0]!, timeSlot[1]!),
      end_time: formatISOFromTimeSlot(timeSlot[0]! + 1, timeSlot[1]!),
    };

    setSelectedSlot(newEvent);
    setIsEventPopupOpen(true);
  };

  const handleEventDetailsClick = useCallback((event: ITransformedEvent) => {
    setSelectedEvent(event);
    setIsEventDetailPopupOpen(true);
  }, []);

  const eventClickHandlers = useMemo(() => {
    const handlers = new Map();

    props.events.forEach((event: ITransformedEvent) => {
      handlers.set(event.id, () => handleEventDetailsClick(event));
    });

    return handlers;
  }, [props.events, handleEventDetailsClick]);

  const closeEventPopup = () => {
    setSelectedSlot(null);
    setIsEventPopupOpen(false);
  };

  const closeEventDetailPopup = () => {
    setSelectedEvent(null);
    setIsEventDetailPopupOpen(false);
  };

  const isCurrentWeekWithinRange = (start_date: string, end_date: string) => {
    const startDate = parseISO(start_date);
    const endDate = parseISO(end_date);

    return isWithinInterval(currentWeek, { start: startDate, end: endDate });
  };

  useEffect(() => {
    const updateViewMode = () => {
      const width = window.innerWidth;

      if (width < 1024) {
        setCalendarView("single");
      } else if (width < 1280) {
        setCalendarView("triple");
      } else {
        setCalendarView("full");
      }
    };

    updateViewMode();
    window.addEventListener("resize", updateViewMode);
    return () => window.removeEventListener("resize", updateViewMode);
  }, []);

  useEffect(() => {
    const { startDate, endDate } = props.dateData(currentWeek);

    if (isCurrentWeekWithinRange(startDate, endDate)) {
      props.eventData(startDate, endDate);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    const eventId = active.id;
    const dropDateSlot = over?.id as string;

    const draggedEvent = props.events.find(e => e.id === eventId);
    if (!draggedEvent) return;

    const newEvent: ITransformedEvent = {
      ...draggedEvent,
      date: calculateNewDateFromDaySlot(draggedEvent.date, draggedEvent.day, dropDateSlot),
      start_time: convertTimeSlotIndexToISO(dropDateSlot),
      end_time: convertTimeSlotIndexToISO(
        calculateNewEndSlot(draggedEvent.start_time, draggedEvent.end_time, dropDateSlot)
      ),
    };

    editEvent(newEvent);
  };

  const daysCount = calendarView === "single" ? 1 : calendarView === "triple" ? 3 : 7;
  const daysOfWeek = Array.from({ length: daysCount }, (_, i) => i);

  const viewStartDate =
    calendarView === "single"
      ? new Date()
      : calendarView === "triple"
        ? addDays(new Date(), -1)
        : weekStart;

  const weekDays = Array.from({ length: daysCount }, (_, i) => addDays(viewStartDate, i));

  const gridCols =
    calendarView === "single"
      ? "grid-cols-[100px_1fr]"
      : calendarView === "triple"
        ? "grid-cols-4"
        : "grid-cols-8";

  const colSpan =
    calendarView === "single"
      ? "col-span-1"
      : calendarView === "triple"
        ? "col-span-3"
        : "col-span-7";

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="w-full flex flex-col items-start bg-gray-50 rounded-xl">
        <div className={`${gridCols} grid grid-rows-1 w-full`}>
          <div className="col-span-8 border-b flex justify-between">
            <div className="p-4 flex items-center">
              {calendarView === "single" ? (
                <Bars3Icon
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
                />
              ) : null}
            </div>
            <div className="flex justify-center items-center space-x-8 p-4">
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
          </div>
          <div className="border-r border-b flex flex-col justify-center items-center p-4 ">
            <h3 className="font-light text-lg">Time</h3>
          </div>
          {weekDays.map((day: Date) => (
            <div
              key={day.toISOString()}
              className={`
            border-r border-b
            ${isSameDay(day, new Date()) ? "border-b-violet-400" : "border-gray-200"} 
            flex flex-col justify-center items-center p-4
          `}
            >
              <h3 className="font-bold text-lg">{format(day, "EEEE")}</h3>
              <p className="text-sm">{format(day, "d MMMM")}</p>
            </div>
          ))}
        </div>

        <div
          className={`${gridCols} grid row-span-48 h-full w-full overflow-y-scroll no-scrollbar divide-gray-200 divide-x`}
        >
          <div className={"col-span-1 row-span-48 w-full h-full"}>
            {calendarHours.map((hour: number) => (
              <div
                key={hour}
                className={`w-full min-w-0 ${hour === calendarHours.length - 1 ? "" : "border-b"} `}
              >
                <div className="flex flex-col justify-center items-start h-[56px] p-4">
                  <h2 className="text-sm">{formatHour(hour)}</h2>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`${colSpan} w-full h-full row-span-48 grid-rows-subgrid grid-cols-subgrid grid divide-gray-200 divide-x`}
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
                      <EmptyTimeSlot
                        key={`${day}-${index}`}
                        id={`${day}-${index}`}
                        onClick={() => handleEventClick(day, timeSlot)}
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
    </DndContext>
  );
};

export default Calendar;
