import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeaderboardEntry } from '../types/leaderboard';
import api from '../api';

type Range = 'today' | 'week' | 'month' | 'allTime';

// No parameter since it loads all at once
export function useAllLeaderboards(): {
    data: Record<Range, LeaderboardEntry[]>;
    loading: boolean;
} {
    const [allData, setAllData] = useState<Record<Range, LeaderboardEntry[]>>({
        today: [],
        week: [],
        month: [],
        allTime: [],
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllLeaderboards = async () => {
            try {
                const result = await api.getLeaderboard();

                if (typeof result === 'object' && result !== null) {
                    setAllData({
                        today: result.today ?? [],
                        week: result.week ?? [],
                        month: result.month ?? [],
                        allTime: result.allTime ?? [],
                    });
                }
            } catch (err) {
                if (err instanceof Error && err.message === 'Rate limited') {
                    alert("You're making requests too quickly. Please wait a moment.");
                    navigate('/');
                    return;
                }
                console.error('Failed to fetch all leaderboards:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllLeaderboards();
    }, []);

    return { data: allData, loading };
}
