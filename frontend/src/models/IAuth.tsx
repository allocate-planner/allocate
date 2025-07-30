import type { ReactNode } from "react";
import { z } from "zod";

import type { IStoredUser } from "./IUser";

export const AuthContextSchema = z.object({
  id: z.number(),
  isAuthenticated: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string(),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  login: z.function().args(z.custom<IStoredUser>()).returns(z.void()),
  logout: z.function().args().returns(z.void()),
});

export type IAuthContext = z.infer<typeof AuthContextSchema>;

export interface IAuthProvider {
  children: ReactNode;
}
