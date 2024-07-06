import { useEffect, useState } from "react";

import Sidebar from "@/components/common/Calendar/Sidebar";
import Calendar from "@/components/common/Calendar/Calendar";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/AuthProvider";
import { eventService } from "@/services/EventService";

import { IEvent, ITransformedEvent } from "@/models/IEvent";

import { startOfWeek, parseISO, getDay } from "date-fns";

const CalendarPage = () => {
  const navigate = useNavigate();

  const { getAccessToken, isAuthenticated } = useAuth();
  const accessToken = getAccessToken();

  const [events, setEvents] = useState<ITransformedEvent[]>([]);

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

  const transformEvents = (eventsData: {
    events: IEvent[];
  }): ITransformedEvent[] => {
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
      <Sidebar eventData={eventData} />
      <Calendar events={events} eventData={eventData} />
    </div>
  );
};

export default CalendarPage;
