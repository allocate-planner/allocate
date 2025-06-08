import { useEffect, useState } from "react";

import Sidebar from "@/components/common/Calendar/Sidebar";
import Calendar from "@/components/common/Calendar/Calendar";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/AuthProvider";
import { eventService } from "@/services/EventService";

import type { IEvent, ITransformedEvent } from "@/models/IEvent";

import { startOfWeek, parseISO, getDay, format, endOfWeek, subWeeks, addWeeks } from "date-fns";

const CalendarPage = () => {
  const navigate = useNavigate();

  const { getAccessToken, isAuthenticated } = useAuth();
  const accessToken = getAccessToken();

  const [events, setEvents] = useState<ITransformedEvent[]>([]);

  const calculatePaginationDates = (currentWeek: Date) => {
    const startDate = endOfWeek(subWeeks(currentWeek, 1), { weekStartsOn: 0 });
    const endDate = endOfWeek(addWeeks(currentWeek, 1), { weekStartsOn: 0 });

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  };

  const eventData = async (startDate: string, endDate: string) => {
    if (accessToken) {
      const events = await eventService.getEvents(startDate, endDate, accessToken);
      setEvents(transformEvents(events));
    }
  };

  const transformEvents = (eventsData: { events: IEvent[] }): ITransformedEvent[] => {
    return eventsData.events.map((event: IEvent) => {
      const eventWeekStart = startOfWeek(parseISO(event.date));

      const startTimeParts = event.start_time.split(":");
      const endTimeParts = event.end_time.split(":");

      const eventDate = parseISO(event.date);
      const startTime = `${startTimeParts[0]}:${startTimeParts[1]}`;
      const endTime = `${endTimeParts[0]}:${endTimeParts[1]}`;

      return {
        ...event,
        event_week_start: eventWeekStart,
        day: getDay(eventDate),
        start_time: startTime,
        end_time: endTime,
      };
    });
  };

  useEffect(() => {
    document.title = "allocate — Calendar";

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar eventData={eventData} dateData={calculatePaginationDates} />
      <Calendar events={events} eventData={eventData} dateData={calculatePaginationDates} />
    </div>
  );
};

export default CalendarPage;
