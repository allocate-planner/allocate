import { z } from "zod";

export const UserLoginSchema = z.object({
  email_address: z.string().email(),
  password: z.string().min(1),
});

export const UserRegisterSchema = z
  .object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email_address: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string().min(1),
  })
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const UserDetailsSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email_address: z.string().email(),
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

export type IUserLogin = z.infer<typeof UserLoginSchema>;
export type IUserRegister = z.infer<typeof UserRegisterSchema>;
export type IStoredUser = z.infer<typeof UserDetailsSchema>;
