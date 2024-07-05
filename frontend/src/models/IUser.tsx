export interface IUser {
  id: number;
}

export interface IUserDetails {
  first_name: string;
  last_name: string;
  email_address: string;
  password: string;
}

export interface IUserLogin {
  email_address: string;
  password: string;
}

export interface IUserRegister extends IUserDetails {
  confirm_password: string;
}

export interface IUserDTO {
  email_address: string;
  access_token: string;
  refresh_token: string;
}
