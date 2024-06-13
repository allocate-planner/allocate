import axios from "axios";
import qs from "qs";

import { IUserDetails, IUserRegister } from "../models/IUser";
import { API_BASE_URL } from "@/utils/Constants";

export const userService = {
  authenticateUser: async (userDetails: IUserDetails) => {
    const stringifiedData = qs.stringify({
      username: userDetails.username,
      password: userDetails.password,
    });

    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    return await axios
      .post(`${API_BASE_URL}/users/login`, stringifiedData, headers)
      .then((response) => {
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail &&
          typeof error.response.data.detail === "string"
        ) {
          console.error("Error: ", error.response.data.detail);
          throw new Error(error.response.data.detail);
        } else {
          console.error(
            "Error: There has been an issue when authenticating.",
            error
          );
          throw new Error("An unknown error occurred while authenticating.");
        }
      });
  },

  registerUser: async (userDetails: IUserRegister) => {
    return await axios
      .post(`${API_BASE_URL}/users`, {
        email_address: userDetails.username,
        password: userDetails.password,
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
            "Error: There has been an issue when creating an account.",
            error
          );
          throw new Error(
            "An unknown error occurred while creating an account."
          );
        }
      });
  },

  logout: async () => {
    localStorage.removeItem("user");
  },
};
