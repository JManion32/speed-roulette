import '../css/index.css';
import { useState } from 'react';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";

// Hooks
import { useAllLeaderboards } from '../hooks/useLeaderboardData';

// Types
type Range = 'today' | 'week' | 'month' | 'allTime';
import { LeaderboardEntry } from '../types/leaderboard';

function Leaderboard() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<Range>('today');

  const { data: allLeaderboards, loading } = useAllLeaderboards();
  const leaderboard: LeaderboardEntry[] = allLeaderboards[activeTab] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 flex flex-col items-center justify-start min-h-screen transition duration-200 select-none ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'
      }`}
      style={{ scrollbarGutter: 'stable' }}
    >
      <div className="w-full flex justify-between px-4 mb-4">
        <HomeButton />
        <DarkModeToggle />
      </div>
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-[4rem] font-bold mt-8 mb-8 transition duration-200">Leaderboard</h1>

        <div className="flex border-b border-gray-700 mb-6 space-x-6">
          {(['today', 'week', 'month', 'allTime'] as Range[]).map((tab) => (
            <button
              key={tab}
              className={`py-2 px-6 text-xl transition duration-200 font-bold ${
                activeTab === tab
                  ? isDarkMode
                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                    : 'text-yellow-700 border-b-2 border-yellow-700'
                  : isDarkMode
                    ? 'hover:text-white text-gray-400'
                    : 'hover:text-black text-gray-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'today' && 'Today'}
              {tab === 'week' && 'This Week'}
              {tab === 'month' && 'This Month'}
              {tab === 'allTime' && 'All Time'}
            </button>
          ))}
        </div>

        <div className="w-full max-w-6xl overflow-x-auto">
          {leaderboard.length > 0 ? (
            <table className="w-full text-left border-collapse mt-4 transition duration-200">
              <thead>
                <tr className="text-xl transition duration-200">
                  <th className="pl-6 pr-20 py-2">#</th>
                  <th className="pr-10 py-2">Nickname</th>
                  <th className="pr-16 py-2">Balance</th>
                  <th className="pr-10 py-2">Time Used</th>
                  <th className="pr-10 py-2">Spins Used</th>
                  <th className="pr-16 py-2">Date</th>
                  <th className="pr-24 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr
                    key={i}
                    className={`text-lg border-t transition duration-200 ${
                      i === 0
                        ? isDarkMode
                          ? 'bg-yellow-800'
                          : 'bg-yellow-200'
                        : i === 1
                        ? isDarkMode
                          ? 'bg-gray-700'
                          : 'bg-gray-300'
                        : i === 2
                        ? isDarkMode
                          ? 'bg-orange-900'
                          : 'bg-orange-200'
                        : isDarkMode
                        ? i % 2 === 0
                          ? 'bg-gray-900'
                          : 'bg-gray-800'
                        : i % 2 === 0
                        ? 'bg-light-mode'
                        : 'bg-gray-100'
                    }`}
                  >
                    <td className="pl-6 pr-20 font-bold">{i + 1}</td>
                    <td className="pr-10 py-2">{entry.nickname ?? 'Unknown'}</td>
                    <td className="pr-16 py-2">
                      {typeof entry.final_balance === 'number'
                        ? `$${entry.final_balance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        : '—'}
                    </td>
                    <td className="pr-10 py-2">
                      {typeof entry.rem_time === 'number'
                        ? `${60 - entry.rem_time}s`
                        : '—'}
                    </td>
                    <td className="pr-10 py-2">
                      {typeof entry.rem_spins === 'number'
                        ? `${10 - entry.rem_spins}`
                        : '—'}
                    </td>
                    <td className="pr-16 py-2">
                      {entry.played_at
                        ? new Date(entry.played_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="pr-24 py-2">
                      {entry.played_at
                        ? new Date(entry.played_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xl mt-4 text-center transition duration-200">No entries yet.</p>
          )}
        </div>
      </div>

      <div className="h-16"></div>
    </div>
  );
}

export default Leaderboard;
