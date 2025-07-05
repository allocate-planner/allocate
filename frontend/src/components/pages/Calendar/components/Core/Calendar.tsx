import { useEffect, useState, useCallback } from "react";
import { DndContext } from "@dnd-kit/core";

import { addDays, startOfWeek, parseISO, isWithinInterval } from "date-fns";

import { useAuth } from "@/AuthProvider";
import type { ITransformedEvent, ISelectedEvent, IEvent } from "@/models/IEvent";

import EventPopup from "@/components/pages/Calendar/components/events/EventPopup";
import EventDetailPopup from "@/components/pages/Calendar/components/events/EventDetailPopup";

import { formatDate, formatISOFromTimeSlot, transformTo24HourFormat } from "@/utils/TimeUtils";

import { useCalendarEvents } from "@/components/pages/Calendar/hooks/useCalendarEvents";
import { useCalendarView } from "@/components/pages/Calendar/hooks/useCalendarView";
import { useWeekNavigation } from "@/components/pages/Calendar/hooks/useWeekNavigation";
import { useDrag } from "@/components/pages/Calendar/hooks/useDrag";

import { CalendarHeader } from "@/components/pages/Calendar/components/core/CalendarHeader";
import { CalendarTimeColumn } from "@/components/pages/Calendar/components/core/CalendarTimeColumn";
import { CalendarGrid } from "@/components/pages/Calendar/components/core/CalendarGrid";

const INITIAL_DATE = new Date();

interface IProps {
  events: ITransformedEvent[];
  retrieveEventData: (startDate: string, endDate: string) => void;
  transformEvents: (eventData: { events: IEvent[] }) => ITransformedEvent[];
  setEvents: React.Dispatch<React.SetStateAction<ITransformedEvent[]>>;
  dateData: (currentWeek: Date) => { startDate: string; endDate: string };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Calendar = ({
  events,
  retrieveEventData,
  transformEvents,
  setEvents,
  dateData,
  sidebarOpen,
  setSidebarOpen,
}: IProps) => {
  const [selectedSlot, setSelectedSlot] = useState<ISelectedEvent | null>();
  const [isEventPopupOpen, setIsEventPopupOpen] = useState<boolean>(false);

  const [selectedEvent, setSelectedEvent] = useState<ITransformedEvent | null>();
  const [isEventDetailPopupOpen, setIsEventDetailPopupOpen] = useState<boolean>(false);

  const { accessToken } = useAuth();

  const { createEvent, editEvent, deleteEvent } = useCalendarEvents({
    accessToken,
    transformEvents,
    setEvents,
    setIsEventDetailPopupOpen,
    setIsEventPopupOpen,
  });
  const { currentWeek, setCurrentWeek, moveWeek } = useWeekNavigation(INITIAL_DATE);
  const { sensors, onDragEnd } = useDrag({ events, editEvent });
  const calendarView = useCalendarView();

  const weekStart = startOfWeek(currentWeek);

  const handleEventClick = (day: number, time: string) => {
    const timeSlot = transformTo24HourFormat(time).split(":").map(Number);
    const dateFromWeekAndDay = addDays(weekStart, day);

    const newEvent: ISelectedEvent = {
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
    const { startDate, endDate } = dateData(currentWeek);

    if (isCurrentWeekWithinRange(startDate, endDate)) {
      retrieveEventData(startDate, endDate);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek]);

  const daysCount = calendarView === "single" ? 1 : calendarView === "triple" ? 3 : 7;

  const viewStartDate =
    calendarView === "single"
      ? new Date()
      : calendarView === "triple"
        ? addDays(new Date(), -1)
        : weekStart;

  const weekDays = Array.from({ length: daysCount }, (_, i) => addDays(viewStartDate, i));
  const daysOfWeek = Array.from({ length: daysCount }, (_, i) => i);

  const gridCols =
    calendarView === "single"
      ? "grid-cols-[100px_1fr]"
      : calendarView === "triple"
        ? "grid-cols-4"
        : "grid-cols-8";

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="w-full flex flex-col items-start bg-gray-50 rounded-xl">
        <CalendarHeader
          currentWeek={currentWeek}
          moveWeek={moveWeek}
          setCurrentWeek={setCurrentWeek}
          calendarView={calendarView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          weekDays={weekDays}
        />

        <div
          className={`${gridCols} grid row-span-48 h-full w-full overflow-y-scroll no-scrollbar divide-gray-200 divide-x`}
        >
          <CalendarTimeColumn />
          <CalendarGrid
            daysOfWeek={daysOfWeek}
            calendarView={calendarView}
            events={events}
            onEventClick={handleEventClick}
            onEventDetailsClick={handleEventDetailsClick}
            weekStart={weekStart}
          />
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
    </DndContext>
  );
};

export default Calendar;
