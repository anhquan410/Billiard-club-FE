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
