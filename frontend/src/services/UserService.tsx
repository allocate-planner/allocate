import axios from "axios";
import qs from "qs";

import type { IUserLogin, IUserRegister } from "@/models/IUser";
import { API_BASE_URL } from "@/utils/Constants";

export const userService = {
  authenticateUser: async (userDetails: IUserLogin) => {
    const stringifiedData = qs.stringify({
      username: userDetails.email_address,
      password: userDetails.password,
    });

    const headers = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    return await axios
      .post(`${API_BASE_URL}/users/login`, stringifiedData, headers)
      .then(response => {
        if (response.data) {
          return response.data;
        }
      })
      .catch(error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail &&
          typeof error.response.data.detail === "string"
        ) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while authenticating.");
        }
      });
  },

  registerUser: async (userDetails: IUserRegister) => {
    return await axios
      .post(`${API_BASE_URL}/users`, {
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        email_address: userDetails.email_address,
        password: userDetails.password,
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while creating an account.");
        }
      });
  },
};
