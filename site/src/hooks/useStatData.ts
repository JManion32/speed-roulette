import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats } from '../api/api';

import type { AllStats } from '../types/AllStats';

type Range = 'today' | 'week' | 'month' | 'allTime';

export function useStatData(): {
    data: Record<Range, AllStats>;
    loading: boolean;
} {
    const [allStats, setAllStats] = useState<Record<Range, AllStats>>({
        today: {
            colorCounts: {},
            parityCounts: {},
            halfCounts: {},
            dozenCounts: {},
            rowCounts: {},
            hottestNumbers: [],
            coldestNumbers: [],
            numSpins: 0,
            completedGames: 0,
            totalWon: 0,
        },
        week: {
            colorCounts: {},
            parityCounts: {},
            halfCounts: {},
            dozenCounts: {},
            rowCounts: {},
            hottestNumbers: [],
            coldestNumbers: [],
            numSpins: 0,
            completedGames: 0,
            totalWon: 0,
        },
        month: {
            colorCounts: {},
            parityCounts: {},
            halfCounts: {},
            dozenCounts: {},
            rowCounts: {},
            hottestNumbers: [],
            coldestNumbers: [],
            numSpins: 0,
            completedGames: 0,
            totalWon: 0,
        },
        allTime: {
            colorCounts: {},
            parityCounts: {},
            halfCounts: {},
            dozenCounts: {},
            rowCounts: {},
            hottestNumbers: [],
            coldestNumbers: [],
            numSpins: 0,
            completedGames: 0,
            totalWon: 0,
        },
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getStats();

                if (typeof result === 'object' && result !== null) {
                    setAllStats({
                        today: result.today ?? allStats.today,
                        week: result.week ?? allStats.week,
                        month: result.month ?? allStats.month,
                        allTime: result.allTime ?? allStats.allTime,
                    });
                }
            } catch (err) {
                if (err instanceof Error && err.message === 'Rate limited') {
                    alert("You're making requests too quickly. Please wait a moment.");
                    navigate('/');
                    return;
                }
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data: allStats, loading };
}
