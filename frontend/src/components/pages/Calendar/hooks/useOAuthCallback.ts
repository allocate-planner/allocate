import { useEffect } from "react";
import { toast } from "sonner";

import { useAuth } from "@/AuthProvider";
import { integrationService } from "@/services/IntegrationService";
import type { SupportedProviders } from "@/models/IProvider";

export const useOAuthCallback = () => {
  const { accessToken } = useAuth();

  const handleRedirect = async (provider: SupportedProviders, code: string) => {
    if (!accessToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      integrationService.handleRedirect(provider, code, accessToken);
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

    if (error || code) {
      if (error) {
        toast.error(`Integration failed with ${provider}.`);
      } else if (code) {
        handleRedirect(provider as SupportedProviders, code);
        toast.success(`Successfully integrated ${provider}.`);
      }
    }

    window.history.replaceState({}, "", "/calendar");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
