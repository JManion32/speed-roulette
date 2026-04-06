import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { AllStats } from "../types/AllStats";

type Range = "today" | "week" | "month" | "allTime";

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
                const res = await fetch("/api/stats");

                if (res.status === 429) {
                    alert(
                        "You're making requests too quickly. Please wait a moment.",
                    );
                    navigate("/");
                    return;
                }

                if (!res.ok)
                    throw new Error(`HTTP error! Status: ${res.status}`);

                const result = await res.json();

                if (typeof result === "object" && result !== null) {
                    setAllStats({
                        today: result.today ?? allStats.today,
                        week: result.week ?? allStats.week,
                        month: result.month ?? allStats.month,
                        allTime: result.allTime ?? allStats.allTime,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data: allStats, loading };
}
