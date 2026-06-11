import agent from "./agent";

export async function getAllUser() {
  try {
    const response = await agent.get(`/users/all`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserPagination(page: number, limit: number) {
  try {
    const response = await agent.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUserById(id: string) {
  try {
    const response = await agent.delete<{ message: string; softDeleted?: boolean }>(
      `/users/${id}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export type CustomerSummary = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  bonusPoints: number;
  membershipTier: string;
};

export type StaffSummary = {
  id: string;
  fullName: string;
  role: "ADMIN" | "CASHIER" | "STAFF";
};

export async function getStaffForAssignment() {
  const response = await agent.get<StaffSummary[]>("/users/staff/list");
  return response.data;
}

export async function searchCustomers(q?: string) {
  const params = q ? `?q=${encodeURIComponent(q)}` : "";
  const response = await agent.get<CustomerSummary[]>(
    `/users/customers/search${params}`,
  );
  return response.data;
}

export async function createUser(data: {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  password: string;
}) {
  try {
    const response = await agent.post(`/users/register`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
