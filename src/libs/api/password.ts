import type { PasswordChangeRequest } from "../types";
import agent from "./agent";

export async function changePassword(
  id: string,
  passwordChangeRequest: PasswordChangeRequest,
) {
  try {
    const response = await agent.patch<PasswordChangeRequest>(
      `/users/${id}/change-password`,
      passwordChangeRequest,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
