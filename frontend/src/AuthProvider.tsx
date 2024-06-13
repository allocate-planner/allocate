import { createContext, useContext, useState } from "react";

import { IAuthContext, IAuthProvider } from "./models/IAuth";

const defaultAuthContext: IAuthContext = {
  id: 0,
  isAuthenticated: false,
  updateAuthentication: () => {},
  getAccessToken: () => null,
};

export const AuthContext = createContext<IAuthContext>(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const retrieveLocalData = () => {
    const userDataString = localStorage.getItem("user");
    return userDataString ? JSON.parse(userDataString) : null;
  };

  const [localData, setLocalData] = useState(retrieveLocalData());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localData);

  const updateAuthentication = (status: boolean) => {
    setIsAuthenticated(status);

    const userData = localStorage.getItem("user");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setLocalData(parsedUserData);
    }
  };

  const retrieveId = () => {
    if (localData) {
      return localData.id;
    }

    return 0;
  };

  const [id] = useState(retrieveId());

  const getAccessToken = () => {
    try {
      if (localData && isAuthenticated) return localData.access_token;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        id,
        isAuthenticated,
        updateAuthentication,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
