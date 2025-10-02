import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";
import { eventService } from "@/services/EventService";
import { eventsAtom } from "@/atoms/eventsAtom";
import type { ITransformedEvent, IEventCreate, IEvent, IEventUpdate } from "@/models/IEvent";
import type { Nullable } from "@/models/IUtility";

const toComparisonTime = (value?: string) => {
  if (!value) {
    return undefined;
  }
  return value.slice(0, 5);
};

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
  const events = useAtomValue(eventsAtom);
  const setEvents = useSetAtom(eventsAtom);

  const createEvent = async (event: IEventCreate): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    const previousEvents = [...events];
    const optimisticId = -Date.now();

    const optimisticSource: IEvent = {
      id: optimisticId,
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      colour: event.colour ?? "#8D85D2",
      start_time: event.start_time,
      end_time: event.end_time,
      rrule: event.rrule,
      repeated: event.rrule && event.rrule !== "DNR" ? true : undefined,
    };

    const optimisticEvent = transformEvents([optimisticSource])[0];

    if (!optimisticEvent) {
      toast.error("Failed to create optimistic event");
      return false;
    }

    setEvents(prev => [...prev, optimisticEvent]);
    setIsEventPopupOpen(false);

    try {
      const newEvent = await eventService.createEvent(event, accessToken);
      const transformedEvents = transformEvents([newEvent]);
      const transformedNewEvent = transformedEvents[0];

      if (!transformedNewEvent) {
        throw new Error("Failed to transform new event");
      }

      setEvents(prev => prev.map(e => (e.id === optimisticId ? transformedNewEvent : e)));

      if (event.rrule && event.rrule !== "DNR") {
        const updatedEvents = await eventService.getEvents(accessToken);
        setEvents(transformEvents(updatedEvents));
      }

      toast.success("Event was created");
      return true;
    } catch (error) {
      setEvents(previousEvents);
      const message = error instanceof Error ? error.message : "Event was not created";
      toast.error(message);
      return false;
    }
  };

  const editEvent = async (event: IEventUpdate): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    const previousState = [...events];
    const occurrenceDate = event.previous_date ?? event.date;
    const occurrenceStartTime = event.previous_start_time ?? event.start_time;

    try {
      const targetDate = occurrenceDate;
      const targetStartTime = toComparisonTime(occurrenceStartTime);

      const existingEvent = events.find(e => {
        if (e.id !== event.id) return false;
        if (e.repeated)
          return e.date === targetDate && toComparisonTime(e.start_time) === targetStartTime;
        return true;
      });

      if (!existingEvent) {
        throw new Error("Event not found");
      }

      const optimisticSource: IEvent = {
        id: existingEvent.id,
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date ?? existingEvent.date,
        colour: event.colour ?? existingEvent.colour,
        start_time: event.start_time,
        end_time: event.end_time,
        rrule: event.rrule ?? existingEvent.rrule,
        repeated: existingEvent.repeated,
      };

      const optimisticEvent = transformEvents([optimisticSource])[0];

      if (!optimisticEvent) {
        throw new Error("Failed to transform new event");
      }

      setEvents(prev =>
        prev.map(e => {
          if (e.id !== event.id) return e;
          if (event.repeated) {
            const isOccurrenceMatch =
              e.date === targetDate && toComparisonTime(e.start_time) === targetStartTime;
            return isOccurrenceMatch ? optimisticEvent : e;
          }
          return optimisticEvent;
        })
      );

      setIsEventDetailPopupOpen(false);

      const updatedEvent = await eventService.editEvent(event, accessToken);
      const transformedUpdateEvent = transformEvents([updatedEvent]);
      const transformedEvent = transformedUpdateEvent[0];

      if (!transformedEvent) {
        throw new Error("Failed to transform new event");
      }

      setEvents(prev =>
        prev.map(e => {
          if (e.id !== transformedEvent.id) return e;
          if (event.repeated) {
            const isOccurrenceMatch =
              e.date === transformedEvent.date &&
              toComparisonTime(e.start_time) === toComparisonTime(transformedEvent.start_time);
            return isOccurrenceMatch ? transformedEvent : e;
          }
          return transformedEvent;
        })
      );

      toast.success("Event was edited");
      return true;
    } catch (error) {
      setEvents(previousState);
      const message = error instanceof Error ? error.message : "Event was not edited";
      toast.error(message);
      return false;
    }
  };

  const deleteEvent = async (event: ITransformedEvent): Promise<boolean> => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    const previousState = [...events];

    if (event.repeated) {
      const targetStartTime = toComparisonTime(event.start_time);

      setEvents(prev =>
        prev.filter(e => {
          if (e.id !== event.id) return true;
          return !(e.date === event.date && toComparisonTime(e.start_time) === targetStartTime);
        })
      );
    } else {
      setEvents(prev => prev.filter(e => e.id !== event.id));
    }

    setIsEventDetailPopupOpen(false);

    try {
      if (event.repeated) {
        await eventService.deleteEvent(event.id, accessToken, event.date);
      } else {
        await eventService.deleteEvent(event.id, accessToken);
      }

      toast.success("Event was deleted");
      return true;
    } catch (error) {
      setEvents(previousState);
      const message = error instanceof Error ? error.message : "Event was not deleted";
      toast.error(message);
      return false;
    }
  };

  return {
    createEvent,
    editEvent,
    deleteEvent,
  };
};
