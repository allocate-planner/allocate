import axios from "axios";

import { IEventCreate } from "../models/IEvent";
import { API_BASE_URL } from "@/utils/Constants";

export const eventService = {
  createEvent: async (eventDetails: IEventCreate) => {
    return await axios
      .post(`${API_BASE_URL}/events`, {
        title: eventDetails.title,
        date: eventDetails.date,
        start_time: eventDetails.start_time,
        end_time: eventDetails.end_time,
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          console.error("Error: ", error.response.data.detail);
          throw new Error(error.response.data.detail);
        } else {
          console.error(
            "Error: There has been an issue when creating the event.",
            error
          );
          throw new Error(
            "An unknown error occurred while creating the event."
          );
        }
      });
  },

  getEvents: async (accessToken: string) => {
    return await axios
      .get(`${API_BASE_URL}/events`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          console.error("Error: ", error.response.data.detail);
          throw new Error(error.response.data.detail);
        } else {
          console.error(
            "Error: There has been an issue when retrieving events.",
            error
          );
          throw new Error("An unknown error occurred while retrieving events.");
        }
      });
  },
};
