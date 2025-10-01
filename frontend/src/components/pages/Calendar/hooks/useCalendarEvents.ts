import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";

import { eventService } from "@/services/EventService";
import { eventsAtom } from "@/atoms/eventsAtom";

import type { ITransformedEvent, IEventCreate, IEvent, IEventUpdate } from "@/models/IEvent";
import type { Nullable } from "@/models/IUtility";

interface IProps {
  accessToken: Nullable<string>;
  transformEvents: (events: IEvent[]) => ITransformedEvent[];
  setIsEventDetailPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCalendarEvents = ({
  accessToken,
  transformEvents,
  setIsEventDetailPopupOpen,
  setIsEventPopupOpen,
}: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const events = useAtomValue(eventsAtom);
  const setEvents = useSetAtom(eventsAtom);

  const createEvent = async (event: IEventCreate): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsLoading(true);

    try {
      const newEvent = await eventService.createEvent(event, accessToken);

      const transformedEvents = transformEvents([newEvent]);
      const transformedNewEvent = transformedEvents[0];

      if (!transformedNewEvent) {
        throw new Error("Failed to transform new event");
      }

      setEvents([...events, transformedNewEvent]);

      if (event.rrule && event.rrule !== "DNR") {
        const updatedEvents = await eventService.getEvents(accessToken);
        setEvents(transformEvents(updatedEvents));
      }

      toast.success("Event was created");
      setIsEventPopupOpen(false);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Event was not created";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const editEvent = async (event: IEventUpdate): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsLoading(true);
    try {
      if (event.repeated) {
        const updatedEvent = await eventService.editEvent(event, accessToken);
        const transformedUpdateEvent = transformEvents([updatedEvent]);
        const transformedEvent = transformedUpdateEvent[0];

        if (!transformedEvent) {
          throw new Error("Failed to transform new event");
        }

        const occurrenceDate = event.previous_date ?? event.date;
        const occurrenceStartTime = event.previous_start_time ?? event.start_time;

        setEvents(prev =>
          prev.map(e =>
            e.id === event.id && e.date === occurrenceDate && e.start_time === occurrenceStartTime
              ? transformedEvent
              : e
          )
        );
      } else {
        const updatedEvent = await eventService.editEvent(event, accessToken);
        const transformedUpdateEvent = transformEvents([updatedEvent]);
        const transformedEvent = transformedUpdateEvent[0];

        if (!transformedEvent) {
          throw new Error("Failed to transform new event");
        }

        setEvents(events.map(e => (e.id === event.id ? transformedEvent : e)));
      }

      toast.success("Event was edited");
      setIsEventDetailPopupOpen(false);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Event was not edited";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (event: ITransformedEvent): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsLoading(true);
    try {
      if (event.repeated) {
        await eventService.deleteEvent(event.id, accessToken, event.date);
      } else {
        await eventService.deleteEvent(event.id, accessToken);
      }

      if (event.repeated) {
        setEvents(events.filter(e => !(e.id === event.id && e.date === event.date)));
      } else {
        setEvents(events.filter(e => e.id !== event.id));
      }

      toast.success("Event was deleted");
      setIsEventDetailPopupOpen(false);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Event was not deleted";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEvent,
    editEvent,
    deleteEvent,
    isLoading,
  };
};
