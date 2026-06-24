import '../css/leaderboard.css';
import { useState } from 'react';
import { Tabs } from '../components/Tabs';
import ThemeToggle from '../components/ThemeToggle';
import HomeButton from '../components/HomeButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAllLeaderboards } from '../hooks/useLeaderboardData';

type Range = 'today' | 'week' | 'month' | 'allTime';
import { LeaderboardEntry } from '../types/leaderboard';

function Leaderboard() {
    const [activeTab, setActiveTab] = useState<Range>('today');
    const { data: allLeaderboards, loading } = useAllLeaderboards();
    const leaderboard: LeaderboardEntry[] = allLeaderboards[activeTab] || [];

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={`leaderboard-page`}>
            <div className="page-header-row">
                <HomeButton />
                <ThemeToggle />
            </div>
            <div className="leaderboard-container">
                <h1 className="page-title">Leaderboard</h1>

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

                <div className="leaderboard-table-container">
                    {leaderboard.length > 0 ? (
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nickname</th>
                                    <th>Balance</th>
                                    <th>Time Used</th>
                                    <th>Spins Used</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry, i) => {
                                    let rowClass = '';
                                    if (i === 0) {
                                        rowClass = `rank-1`;
                                    } else if (i === 1) {
                                        rowClass = `rank-2`;
                                    } else if (i === 2) {
                                        rowClass = `rank-3`;
                                    } else {
                                        rowClass = `${i % 2 === 0 ? 'even' : 'odd'}`;
                                    }

                                    return (
                                        <tr key={i} className={rowClass}>
                                            <td>{i + 1}</td>
                                            <td>{entry.nickname ?? 'Unknown'}</td>
                                            <td>
                                                {typeof entry.final_balance === 'number'
                                                    ? `$${entry.final_balance.toLocaleString(undefined, {
                                                          minimumFractionDigits: 2,
                                                          maximumFractionDigits: 2,
                                                      })}`
                                                    : '—'}
                                            </td>
                                            <td>
                                                {typeof entry.rem_time === 'number' ? `${60 - entry.rem_time}s` : '—'}
                                            </td>
                                            <td>
                                                {typeof entry.rem_spins === 'number' ? `${10 - entry.rem_spins}` : '—'}
                                            </td>
                                            <td>
                                                {entry.played_at ? new Date(entry.played_at).toLocaleDateString() : '—'}
                                            </td>
                                            <td>
                                                {entry.played_at
                                                    ? new Date(entry.played_at).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-entries">No entries yet.</p>
                    )}
                </div>
            </div>
            <div className="leaderboard-footer"></div>
        </div>
    );
}

export default Leaderboard;
