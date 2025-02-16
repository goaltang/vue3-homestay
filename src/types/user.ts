export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: "USER" | "HOST" | "ADMIN";
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  username: string;
  confirmPassword: string;
}
