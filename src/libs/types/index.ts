export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export type User = {
  email: string;
  role: UserRole;
  id: string;
};

export type Profile = User & {
  password: string;
  phone: string;
  fullName: string;
  username: string;
};

export type PasswordChangeRequest = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
