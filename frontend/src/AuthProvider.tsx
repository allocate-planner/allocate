import { createContext, useContext, useState } from "react";

import type { IAuthContext, IAuthProvider } from "@/models/IAuth";
import { UserDetailsSchema, type IStoredUser } from "@/models/IUser";
import type { Nullable } from "@/models/IUtility";

const LOCAL_STORAGE_KEY = "user" as const;

const defaultAuthContext: IAuthContext = {
  id: 0,
  isAuthenticated: false,
  firstName: "",
  lastName: "",
  emailAddress: "",
  accessToken: null,
  login: () => {},
  logout: () => {},
  updateAccessToken: () => {},
};

const setStoredUserData = (userData: IStoredUser): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
};

const getStoredUserData = (): Nullable<IStoredUser> => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return null;

    const result = UserDetailsSchema.safeParse(JSON.parse(data));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

const removeStoredUserData = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const AuthContext = createContext<IAuthContext>(defaultAuthContext);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<Nullable<IStoredUser>>(() => getStoredUserData());

  const login = (userData: IStoredUser): void => {
    const validatedUser = UserDetailsSchema.parse(userData);
    setStoredUserData(validatedUser);
    setUser(validatedUser);
  };

  const logout = (): void => {
    removeStoredUserData();
    setUser(null);
  };

  const updateAccessToken = (accessToken: string): void => {
    if (!user) return;

    const updatedUserData = { ...user, accessToken } as IStoredUser;
    setStoredUserData(updatedUserData);
    setUser(updatedUserData);
  };

  const contextValue: IAuthContext = {
    id: user?.id || 0,
    isAuthenticated: !!user,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    emailAddress: user?.emailAddress || "",
    accessToken: user?.accessToken || null,
    login,
    logout,
    updateAccessToken,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
