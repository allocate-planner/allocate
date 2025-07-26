import { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";

import { startOfWeek, parseISO, getDay } from "date-fns";

import Sidebar from "@/components/pages/Calendar/components/sidebar/Sidebar";
import Calendar from "@/components/pages/Calendar/components/core/Calendar";

import { useAuth } from "@/AuthProvider";
import { eventService } from "@/services/EventService";
import { eventsAtom } from "@/atoms/eventsAtom";

import type { IEvent } from "@/models/IEvent";

const CalendarPage = () => {
  const navigate = useNavigate();

  const { accessToken, isAuthenticated } = useAuth();

  const setEvents = useSetAtom(eventsAtom);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const transformEvents = useCallback((events: IEvent[]) => {
    return events.map((event: IEvent) => {
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
  }, []);

  const retrieveEventData = useCallback(async () => {
    if (accessToken) {
      const events = await eventService.getEvents(accessToken);
      setEvents(transformEvents(events));
    }
  }, [accessToken, transformEvents, setEvents]);

  useEffect(() => {
    document.title = "allocate — Calendar";

    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    if (accessToken) {
      retrieveEventData();
    }
  }, [accessToken, retrieveEventData]);

  return (
    <div className="flex flex-row h-screen">
      <Sidebar sidebarOpen={sidebarOpen} onEventsUpdate={retrieveEventData} />
      <Calendar
        transformEvents={transformEvents}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </div>
  );
};

export default CalendarPage;
