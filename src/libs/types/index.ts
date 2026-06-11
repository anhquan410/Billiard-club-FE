export type UserRole = "ADMIN" | "CASHIER" | "STAFF" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

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

export type Hr = {
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
  password: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  updatedAt: string;
  username: string;
  bonusPoints?: number;
  membershipTier?: string;
};
