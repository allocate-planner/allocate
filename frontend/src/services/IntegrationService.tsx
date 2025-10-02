import axios from "axios";

import { API_BASE_URL } from "@/utils/Constants";
import type {
  SupportedProviders,
  IntegrationDetails,
  IntegrationResponse,
} from "@/models/IProvider";

export const integrationService = {
  connectIntegration: async (
    provider: SupportedProviders,
    accessToken: string
  ): Promise<IntegrationDetails> => {
    return await axios
      .post(
        `${API_BASE_URL}/integrations/${String(provider)}/connect`,
        {},
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
          throw new Error("An unknown error occurred while connecting the integration.");
        }
      });
  },

  handleRedirect: async (
    provider: SupportedProviders,
    code: string,
    state: string,
    accessToken: string
  ): Promise<IntegrationResponse> => {
    return await axios
      .post(
        `${API_BASE_URL}/integrations/${String(provider)}/redirect`,
        {
          code: code,
          state: state,
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
          throw new Error("An unknown error occurred while handling the integration redirect.");
        }
      });
  },

  retrieveIntegrations: async (accessToken: string): Promise<any> => {
    return await axios
      .get(`${API_BASE_URL}/integrations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(response => response.data)
      .catch(error => {
        if (error.response && error.response.data && error.response.data.detail) {
          throw new Error(error.response.data.detail);
        } else {
          throw new Error("An unknown error occurred while retrieving integrations.");
        }
      });
  },
};
