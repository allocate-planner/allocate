import { z } from "zod";

export const UserLoginSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(1),
});

export const UserRegisterSchema = z
  .object({
    firstName: z.string().min(1).max(64),
    lastName: z.string().min(1).max(64),
    emailAddress: z.string().email().max(256),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UserDetailsSchema = z.object({
  id: z.number(),
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  emailAddress: z.string().email().max(256),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const ProfileEditSchema = z.object({
  firstName: z.string().min(1).max(64).optional(),
  lastName: z.string().min(1).max(64).optional(),
});

export const PasswordEditSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UserEditResponseSchema = z.object({
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  emailAddress: z.string().email().max(256),
});

export const UserDetailsBackendSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1).max(64),
  last_name: z.string().min(1).max(64),
  email_address: z.string().email().max(256),
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

export const UserEditResponseBackendSchema = z.object({
  first_name: z.string().min(1).max(64),
  last_name: z.string().min(1).max(64),
  email_address: z.string().email().max(256),
});

export type IUserLogin = z.infer<typeof UserLoginSchema>;
export type IUserRegister = z.infer<typeof UserRegisterSchema>;
export type IProfileEdit = z.infer<typeof ProfileEditSchema>;
export type IPasswordEdit = z.infer<typeof PasswordEditSchema>;
export type IStoredUser = z.infer<typeof UserDetailsSchema>;
export type IUserEditResponse = z.infer<typeof UserEditResponseSchema>;
export type IUserEdit = Pick<IProfileEdit, "firstName" | "lastName"> &
  Partial<Pick<IPasswordEdit, "password">>;

export type IUserDetailsBackend = z.infer<typeof UserDetailsBackendSchema>;
export type IUserEditResponseBackend = z.infer<typeof UserEditResponseBackendSchema>;

export class UserDTO {
  static userDetailsFromBackend(user: unknown): IStoredUser {
    const validatedBackend = UserDetailsBackendSchema.parse(user);

    return {
      id: validatedBackend.id,
      firstName: validatedBackend.first_name,
      lastName: validatedBackend.last_name,
      emailAddress: validatedBackend.email_address,
      accessToken: validatedBackend.access_token,
      refreshToken: validatedBackend.refresh_token,
    };
  }

  static userEditResponseFromBackend(user: unknown): IUserEditResponse {
    const validatedBackend = UserEditResponseBackendSchema.parse(user);

    return {
      firstName: validatedBackend.first_name,
      lastName: validatedBackend.last_name,
      emailAddress: validatedBackend.email_address,
    };
  }
}
