export type IUser = {
  id: number;
};

export type IUserDetails = {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
};

export type IUserLogin = {
  email_address: string;
  password: string;
};

export type IUserRegister = IUserDetails & {
  confirm_password: string;
};

export type IUserDTO = {
  email_address: string;
  access_token: string;
  refresh_token: string;
};
