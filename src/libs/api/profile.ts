import type { Profile } from "../types";
import agent from "./agent";

export async function getProfile(id: string) {
  try {
    const response = await agent.get<Profile>(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function updateProfile(id: string, profile: Profile) {
  try {
    const response = await agent.patch<Profile>(`/users/${id}`, profile);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
