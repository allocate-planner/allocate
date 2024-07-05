import { createContext, useContext, useState } from "react";

import { IAuthContext, IAuthProvider } from "./models/IAuth";

const defaultAuthContext: IAuthContext = {
  id: 0,
  isAuthenticated: false,
  firstName: "",
  lastName: "",
  emailAddress: "",
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
  const [firstName, setFirstName] = useState(
    localData ? localData.first_name : ""
  );
  const [lastName, setLastName] = useState(
    localData ? localData.last_name : ""
  );
  const [emailAddress, setEmailAddress] = useState(
    localData ? localData.email_address : ""
  );
  const [id, setId] = useState(localData ? localData.id : 0);

  const updateAuthentication = (status: boolean) => {
    setIsAuthenticated(status);

    const userData = localStorage.getItem("user");

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setLocalData(parsedUserData);

      setFirstName(parsedUserData.first_name || "");
      setLastName(parsedUserData.last_name || "");
      setEmailAddress(parsedUserData.email_address || "");
      setId(parsedUserData.id || 0);
    }
  };

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
        firstName,
        lastName,
        emailAddress,
        isAuthenticated,
        updateAuthentication,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
