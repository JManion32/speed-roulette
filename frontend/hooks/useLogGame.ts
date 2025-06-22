import { useState } from "react";
import { secureFetch } from "../utils/secureFetch";

export function useLogGame() {
  const [rank, setRank] = useState<number | null>(null);

  const logGame = async (nickname: string, userBalance: number, remSpins: number, timeLeft: number) => {
    try {
      await secureFetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, final_balance: userBalance, spins_used: remSpins, time_used: timeLeft }),
      });

      const rankRes = await secureFetch(`/api/rank?balance=${userBalance}`, { method: "GET" });
      const rankData = await rankRes.json();
      setRank(rankData.rank);
    } catch (err) {
      console.error("Failed to log game:", err);
    }
  };

  return { rank, logGame };
}
