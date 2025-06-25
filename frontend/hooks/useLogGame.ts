import { useState } from "react";
import { secureFetch } from "../utils/secureFetch";

export function useLogGame() {
  const [rank, setRank] = useState<number | null>(null);

  const logGame = async (
    nickname: string,
    userBalance: number,
    remSpins: number,
    timeLeft: number
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found. User might be logged out.");
      return;
    }

    try {
      const res = await secureFetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname,
          final_balance: userBalance,
          spins_used: remSpins,
          time_used: timeLeft,
        }),
      });

      const data = await res.json();
      setRank(data.rank);
    } catch (err) {
      console.error("Failed to log game and get rank:", err);
    }
  };

  return { rank, logGame };
}
