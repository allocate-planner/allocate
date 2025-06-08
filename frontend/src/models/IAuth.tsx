import type { ReactNode } from "react";

export interface IAuthContext {
  id: number;
  isAuthenticated: boolean;
  firstName: string;
  lastName: string;
  emailAddress: string;
  updateAuthentication: (status: boolean) => void;
  getAccessToken: () => string | null;
}

export interface IAuthProvider {
  children: ReactNode;
}
