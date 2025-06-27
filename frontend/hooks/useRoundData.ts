import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface RoundEntry {
  number: number;
  color: string;
  parity: string;
  half: string;
  dozen: string;
  row: string;
  played_at: string;
}

type Range = 'today' | 'week' | 'month' | 'allTime';

export function useRoundData(): {
  data: Record<Range, RoundEntry[]>;
  loading: boolean;
} {
  const [allData, setAllData] = useState<Record<Range, RoundEntry[]>>({
    today: [],
    week: [],
    month: [],
    allTime: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const res = await fetch('/api/stats');

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
        console.error("Failed to fetch round data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, []);

  return { data: allData, loading };
}
