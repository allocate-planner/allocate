import { useState } from "react";
import { toast } from "sonner";

import { eventService } from "@/services/EventService";

import type { ITransformedEvent, IEventCreate, IEvent } from "@/models/IEvent";
import type { Nullable } from "@/models/IUtility";

interface IProps {
  accessToken: Nullable<string>;
  transformEvents: (eventData: { events: IEvent[] }) => ITransformedEvent[];
  setEvents: React.Dispatch<React.SetStateAction<ITransformedEvent[]>>;
  setIsEventDetailPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEventPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCalendarEvents = ({
  accessToken,
  transformEvents,
  setEvents,
  setIsEventDetailPopupOpen,
  setIsEventPopupOpen,
}: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createEvent = async (event: IEventCreate): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsLoading(true);

    try {
      const newEvent = await eventService.createEvent(event, accessToken);

      const transformedEvents = transformEvents({ events: [newEvent] });
      const transformedNewEvent = transformedEvents[0];

      if (!transformedNewEvent) {
        throw new Error("Failed to transform new event");
      }

      setEvents(prevEvents => [...prevEvents, transformedNewEvent]);

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

  const editEvent = async (event: ITransformedEvent): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsLoading(true);
    try {
      const updatedEvent = await eventService.editEvent(event, accessToken);

      const transformedUpdateEvent = transformEvents({ events: [updatedEvent] });
      const transformedEvent = transformedUpdateEvent[0];

      if (!transformedEvent) {
        throw new Error("Failed to transform new event");
      }

      setEvents(prevEvents => prevEvents.map(e => (e.id === event.id ? transformedEvent : e)));

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

  const deleteEvent = async (eventId: number): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    setIsLoading(true);
    try {
      await eventService.deleteEvent(eventId, accessToken);

      setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));

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
