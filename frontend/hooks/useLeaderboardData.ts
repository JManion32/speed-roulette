import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface LeaderboardEntry {
  nickname?: string;
  final_balance?: number;
  time_used?: number;
  spins_used?: number;
  played_at?: string;
}

export function useLeaderboardData(range: string) {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/leaderboard?range=${range}`);

        if (res.status === 429) {
          alert("You're making requests too quickly. Please wait a moment.");
          navigate("/");
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = await res.json();

        if (Array.isArray(result)) {
          setData(result);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setData([]);
      }
    };

    fetchLeaderboard();
  }, [range]);

  return data;
}
