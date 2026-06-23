import '../css/stats.css';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from '../components/ThemeToggle';
import HomeButton from '../components/HomeButton';
import { useStatData } from '../hooks/useStatData';
import { getColorClass } from '../utils/recentNumColor';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';

import { createStackedBarData, stackedBarOptions } from '../utils/chartUtils';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function Stats() {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month' | 'allTime'>('today');
    const { data: allStats, loading } = useStatData();

    const stats = allStats[activeTab];

    if (loading || !stats) {
        return (
            <div className="stats-loading">
                <div className="stats-spinner" />
            </div>
        );
    }

    return (
        <div className={`stats-page ${theme === 'dark' ? 'stats-page-dark' : 'stats-page-light'}`}>
            <div className="stats-header-row">
                <HomeButton />
                <DarkModeToggle />
            </div>
            <div className="stats-container">
                <h1 className="stats-title">
                    Site Statistics
                </h1>

                <div className="stats-tab-list">
                    {['today', 'week', 'month', 'allTime'].map((tab) => (
                        <button
                            key={tab}
                            className={`stats-tab-button ${activeTab === tab ? (theme === 'dark' ? 'stats-tab-active-dark' : 'stats-tab-active-light') : (theme === 'dark' ? 'stats-tab-inactive-dark' : 'stats-tab-inactive-light')}`}
                            onClick={() => setActiveTab(tab as typeof activeTab)}
                        >
                            {tab === 'today' && 'Today'}
                            {tab === 'week' && 'This Week'}
                            {tab === 'month' && 'This Month'}
                            {tab === 'allTime' && 'All Time'}
                        </button>
                    ))}
                </div>

                <div className="stats-main">
                    <div className="stats-section">
                        <div className="stats-section-inner">
                            <div className="stats-metric-row">
                                <div className="stats-metric-item">
                                    <button
                                        className={`stats-metric-button ${theme === 'dark' ? 'stats-metric-button-dark' : 'stats-metric-button-light'}`}
                                    >
                                        Spins: {stats.numSpins.toLocaleString()}
                                    </button>
                                </div>

                                <div className="stats-metric-item">
                                    <button
                                        className={`stats-metric-button ${theme === 'dark' ? 'stats-metric-button-dark' : 'stats-metric-button-light'}`}
                                    >
                                        Games Completed: {stats.completedGames.toLocaleString()}
                                    </button>
                                </div>

                                <div className="stats-metric-item">
                                    <button
                                        className={`stats-metric-button ${theme === 'dark' ? 'stats-metric-button-dark' : 'stats-metric-button-light'}`}
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
                                <h2 className="stats-number-heading glow-hot-header">
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
                                <h2 className="stats-number-heading glow-cold-header">
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
                    <div className="stats-chart-row">
                        <div className="stats-chart-cell">
                            <Bar
                                data={createStackedBarData(stats.colorCounts, ['red', 'green', 'black', 'neither'])}
                                options={stackedBarOptions}
                            />
                        </div>
                    </div>

                    <div className="stats-chart-row">
                        <div className="stats-chart-cell">
                            <Bar
                                data={createStackedBarData(stats.parityCounts, ['even', 'neither', 'odd'])}
                                options={stackedBarOptions}
                            />
                        </div>
                    </div>

                    <div className="stats-chart-row">
                        <div className="stats-chart-cell">
                            <Bar
                                data={createStackedBarData(stats.halfCounts, ['low', 'neither', 'high'])}
                                options={stackedBarOptions}
                            />
                        </div>
                    </div>

                    <div className="stats-chart-row">
                        <div className="stats-chart-cell">
                            <Bar
                                data={createStackedBarData(stats.dozenCounts, ['first', 'second', 'third', 'neither'])}
                                options={stackedBarOptions}
                            />
                        </div>
                    </div>

                    <div className="stats-chart-row">
                        <div className="stats-chart-cell">
                            <Bar
                                data={createStackedBarData(stats.rowCounts, ['top', 'middle', 'bottom', 'neither'])}
                                options={stackedBarOptions}
                            />
                        </div>
                    </div>
                </div>
                <div className="stats-footer-gap"></div>
            </div>
        </div>
    );
}

export default Stats;
