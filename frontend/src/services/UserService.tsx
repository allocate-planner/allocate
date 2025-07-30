import axios from "axios";
import qs from "qs";

import {
  type IStoredUser,
  type IUserLogin,
  type IUserRegister,
  type IUserEditResponse,
  type IUserEdit,
  UserDTO,
} from "@/models/IUser";
import { API_BASE_URL } from "@/utils/Constants";

export const userService = {
  authenticateUser: async (userDetails: IUserLogin): Promise<IStoredUser> => {
    const stringifiedData = qs.stringify({
      username: userDetails.emailAddress,
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
          return UserDTO.userDetailsFromBackend(response.data);
        } else {
          throw new Error("No data received from authentication endpoint.");
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

  registerUser: async (userDetails: IUserRegister): Promise<void> => {
    await axios
      .post(`${API_BASE_URL}/users`, {
        first_name: userDetails.firstName,
        last_name: userDetails.lastName,
        email_address: userDetails.emailAddress,
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

  editUser: async (userDetails: IUserEdit, accessToken: string): Promise<IUserEditResponse> => {
    return await axios
      .put(
        `${API_BASE_URL}/users/edit`,
        {
          ...(userDetails.firstName && { first_name: userDetails.firstName }),
          ...(userDetails.lastName && { last_name: userDetails.lastName }),
          ...(userDetails.password && { password: userDetails.password }),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(response => {
        if (response.data) {
          return UserDTO.userEditResponseFromBackend(response.data);
        } else {
          throw new Error("No data received from edit endpoint.");
        }
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while updating the profile.");
        }
      });
  },
};
