import { useEffect } from "react";
import { toast } from "sonner";

import { useAuth } from "@/AuthProvider";
import { integrationService } from "@/services/IntegrationService";
import type { SupportedProviders } from "@/models/IProvider";

export const useOAuthCallback = () => {
  const { accessToken } = useAuth();

  const handleRedirect = async (provider: SupportedProviders, code: string, state: string) => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      await integrationService.handleRedirect(provider, code, state, accessToken);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const error = urlParams.get("error");
    const code = urlParams.get("code");

    const provider = sessionStorage.getItem("oauth-provider");
    const expectedState = sessionStorage.getItem("oauth-state");
    const returnedState = urlParams.get("state");

    if (error || code) {
      if (error) {
        toast.error(`Integration failed with ${provider}.`);
      } else if (code && returnedState && expectedState && returnedState === expectedState) {
        handleRedirect(provider as SupportedProviders, code, returnedState);
        toast.success(`Successfully integrated ${provider}.`);
        sessionStorage.removeItem("oauth-provider");
        sessionStorage.removeItem("oauth-state");
      }
    }

    window.history.replaceState({}, "", "/calendar");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
