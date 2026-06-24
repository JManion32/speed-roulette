import '../css/stats.css';
import { useState } from 'react';
import { StatsBarChart } from '../components/StatsBarChart';
import { Tabs } from '../components/Tabs';
import { LoadingSpinner } from '../components/LoadingSpinner';
import DarkModeToggle from '../components/ThemeToggle';
import HomeButton from '../components/HomeButton';
import { useStatData } from '../hooks/useStatData';
import { getColorClass } from '../utils/recentNumColor';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function Stats() {
    const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month' | 'allTime'>('today');
    const { data: allStats, loading } = useStatData();

    const stats = allStats[activeTab];

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={`stats-page`}>
            <div className="page-header-row">
                <HomeButton />
                <DarkModeToggle />
            </div>
            <div className="stats-container">
                <h1 className="page-title">
                    Site Statistics
                </h1>

                <Tabs
                    tabs={[
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'This Week' },
                        { value: 'month', label: 'This Month' },
                        { value: 'allTime', label: 'All Time' },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
                />

                <div className="stats-main">
                    <div className="stats-section">
                        <div className="stats-section-inner">
                            <div className="stats-metric-row">
                                <div className="stats-metric-item">
                                    <button
                                        className={`stats-metric-button`}
                                    >
                                        Spins: {stats.numSpins.toLocaleString()}
                                    </button>
                                </div>

                                <div className="stats-metric-item">
                                    <button
                                        className={`stats-metric-button`}
                                    >
                                        Games Completed: {stats.completedGames.toLocaleString()}
                                    </button>
                                </div>

                                <div className="stats-metric-item">
                                    <button
                                        className={`stats-metric-button`}
                                    >
                                        Total Won: $
                                        {stats.totalWon.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </button>
                                </div>
                            </div>

                            <div className="stats-number-section">
                                <h2 className="glow-hot-header">
                                    🔥 Hottest Numbers:
                                </h2>
                                <div className="stats-number-list">
                                    {stats.hottestNumbers.map((n, i) => (
                                        <div
                                            key={i}
                                            className={`stats-number-card ${getColorClass(n.number === 37 ? '00' : n.number.toString())}`}
                                        >
                                            <div className="stats-number-badge">
                                                ×{n.count ?? 0}
                                            </div>
                                            {n.number === 37 ? '00' : n.number}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="stats-number-section">
                                <h2 className="glow-cold-header">
                                    ❄️ Coldest Numbers:
                                </h2>
                                <div className="stats-number-list">
                                    {stats.coldestNumbers.map((n, i) => (
                                        <div
                                            key={i}
                                            className={`stats-number-card ${getColorClass(n.number === 37 ? '00' : n.number.toString())}`}
                                        >
                                            <div className="stats-number-badge">
                                                ×{n.count ?? 0}
                                            </div>
                                            {n.number === 37 ? '00' : n.number}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <StatsBarChart
                        counts={stats.colorCounts}
                        labels={['red', 'green', 'black', 'neither']}
                    />

                    <StatsBarChart
                        counts={stats.parityCounts}
                        labels={['even', 'neither', 'odd']}
                    />

                    <StatsBarChart
                        counts={stats.halfCounts}
                        labels={['low', 'neither', 'high']}
                    />

                    <StatsBarChart
                        counts={stats.dozenCounts}
                        labels={['first', 'second', 'third', 'neither']}
                    />

                    <StatsBarChart
                        counts={stats.rowCounts}
                        labels={['top', 'middle', 'bottom', 'neither']}
                    />
                </div>
                <div className="stats-footer-gap"></div>
            </div>
        </div>
    );
}

export default Stats;
