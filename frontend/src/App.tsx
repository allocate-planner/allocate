import React, { useEffect } from "react";
import { Toaster } from "sonner";

import Routes from "@/Routes";
import { AuthProvider, useAuth } from "@/AuthProvider";
import axios from "axios";
import { API_BASE_URL } from "@/utils/Constants";

const AxiosInterceptor = () => {
  const { logout, isAuthenticated, updateAccessToken } = useAuth();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        const url: string = originalRequest?.url ?? "";

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          isAuthenticated &&
          !url.endsWith("/users/refresh") &&
          !url.endsWith("/users/login")
        ) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/users/refresh`,
              {},
              { withCredentials: true }
            );

            const newAccessToken = refreshResponse.data?.access_token as string | undefined;

            if (newAccessToken) {
              updateAccessToken(newAccessToken);
              originalRequest.headers = {
                ...(originalRequest.headers || {}),
                Authorization: `Bearer ${newAccessToken}`,
              };
              return axios(originalRequest);
            }
          } catch {}
          logout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, isAuthenticated, updateAccessToken]);

  return null;
};

const App = () => {
  return (
    <React.Fragment>
      <Toaster richColors />
      <AuthProvider>
        <AxiosInterceptor />
        <Routes />
      </AuthProvider>
    </React.Fragment>
  );
};

export default App;
