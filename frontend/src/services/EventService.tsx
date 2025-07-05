import axios from "axios";

import type { IEvent, IEventCreate } from "@/models/IEvent";
import { API_BASE_URL } from "@/utils/Constants";

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

  getEvents: async (startDate: string, endDate: string, accessToken: string): Promise<IEvent[]> => {
    return await axios
      .get(`${API_BASE_URL}/events`, {
        params: { start_date: startDate, end_date: endDate },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => response.data.events)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while retrieving events.");
        }
      });
  },

  deleteEvent: async (event_id: number, accessToken: string) => {
    return await axios
      .delete(`${API_BASE_URL}/events/${event_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          event_id: event_id,
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

  editEvent: async (eventDetails: IEvent, accessToken: string): Promise<IEvent> => {
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
