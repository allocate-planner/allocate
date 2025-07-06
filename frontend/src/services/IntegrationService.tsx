import axios from "axios";

import { API_BASE_URL } from "@/utils/Constants";
import type { SupportedProviders, IntegrationDetails } from "@/models/IProvider";

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
          throw new Error("An unknown error occurred while creating the event.");
        }
      });
  },
};
