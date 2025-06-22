import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface LeaderboardEntry {
  nickname?: string;
  final_balance?: number;
  time_used?: number;
  spins_used?: number;
  played_at?: string;
}

type Range = 'today' | 'week' | 'month' | 'allTime';

// No parameter since it loads all at once
export function useAllLeaderboards() {
  const [allData, setAllData] = useState<Record<Range, LeaderboardEntry[]>>({
    today: [],
    week: [],
    month: [],
    allTime: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllLeaderboards = async () => {
      try {
        const res = await fetch('/api/leaderboards');

        if (res.status === 429) {
          alert("You're making requests too quickly. Please wait a moment.");
          navigate("/");
          return;
        }

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const result = await res.json();

        if (typeof result === 'object' && result !== null) {
          setAllData({
            today: result.today ?? [],
            week: result.week ?? [],
            month: result.month ?? [],
            allTime: result.allTime ?? [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch all leaderboards:", err);
      }
    };

    fetchAllLeaderboards();
  }, []);

  return allData;
}
