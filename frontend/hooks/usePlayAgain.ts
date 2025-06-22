import { secureFetch } from "../utils/secureFetch";

export async function usePlayAgain(nickname: string): Promise<string | null> {
  try {
    const res = await secureFetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });

    const { token } = await res.json();
    localStorage.setItem("token", token);
    return token;
  } catch (err) {
    console.error("Error during re-registration:", err);
    return null;
  }
}
