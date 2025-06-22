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
      // 1. Log game result
      await secureFetch("/api/game", {
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

      // 2. Get player's rank
      const rankRes = await secureFetch(`/api/rank?balance=${userBalance}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const rankData = await rankRes.json();
      setRank(rankData.rank);
      
    } catch (err) {
      console.error("Failed to log game, fetch rank, or logout:", err);
    }
  };

  return { rank, logGame };
}
