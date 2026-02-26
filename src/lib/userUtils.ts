import { api } from "./api";

export async function isFirstTimeUser(): Promise<boolean> {
  try {
    const response = await api.get("/dashboard");
    const data = response.data;

    // User is first-time if they have no sessions and no memories
    const hasNoSessions = !data.sessions?.all || data.sessions.all.length === 0;
    const hasNoMemories =
      !data.memories?.recent || data.memories.recent.length === 0;

    return hasNoSessions && hasNoMemories;
  } catch (err) {
    console.error("Error checking first-time user status:", err);
    return false;
  }
}
