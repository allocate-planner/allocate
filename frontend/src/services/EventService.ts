import axios from "axios";

import type { IEvent, IEventCreate, IEventUpdate } from "@/models/IEvent";
import { API_BASE_URL } from "@/utils/constants";

export const eventService = {
  createEvent: async (eventDetails: IEventCreate, accessToken: string): Promise<IEvent> => {
    return await axios
      .post(
        `${API_BASE_URL}/events`,
        {
          title: eventDetails.title,
          date: eventDetails.date,
          start_time: eventDetails.start_time,
          end_time: eventDetails.end_time,
          ...(eventDetails.description &&
            eventDetails.description !== undefined && {
              description: eventDetails.description,
            }),
          ...(eventDetails.location &&
            eventDetails.location !== undefined && {
              location: eventDetails.location,
            }),
          ...(eventDetails.rrule && { rrule: eventDetails.rrule }),
          ...(eventDetails.colour && { colour: eventDetails.colour }),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => response.data)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while creating the event.");
        }
      });
  },

  getEvents: async (accessToken: string): Promise<IEvent[]> => {
    return await axios
      .get(`${API_BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => {
        return response.data.events;
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while retrieving events.");
        }
      });
  },

  deleteEvent: async (event_id: number, accessToken: string, date?: string) => {
    return await axios
      .delete(`${API_BASE_URL}/events/${event_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          event_id: event_id,
          ...(date && { date: date }),
        },
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while deleting the event.");
        }
      });
  },

  editEvent: async (eventDetails: IEventUpdate, accessToken: string): Promise<IEvent> => {
    return await axios
      .put(
        `${API_BASE_URL}/events/${eventDetails.id}`,
        {
          title: eventDetails.title,
          date: eventDetails.date,
          colour: eventDetails.colour,
          start_time: eventDetails.start_time,
          end_time: eventDetails.end_time,
          ...(eventDetails.description &&
            eventDetails.description !== undefined && {
              description: eventDetails.description,
            }),
          ...(eventDetails.location &&
            eventDetails.location !== undefined && {
              location: eventDetails.location,
            }),
          ...(eventDetails.previous_date && { previous_date: eventDetails.previous_date }),
          ...(eventDetails.previous_start_time && {
            previous_start_time: eventDetails.previous_start_time,
          }),
          ...(eventDetails.previous_end_time && {
            previous_end_time: eventDetails.previous_end_time,
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => response.data)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while deleting the event.");
        }
      });
  },
};
