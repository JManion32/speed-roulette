import '../css/index.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";

interface LeaderboardEntry {
  nickname?: string;
  final_balance?: number;
  time_used?: number;
  spins_used?: number;
  played_at?: string;
}

function Leaderboard() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('today');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/leaderboard?range=${activeTab}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          setLeaderboard([]);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setLeaderboard([]);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'}`}>
      <div className="p-4 flex top-0">
        <HomeButton />
        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-700 absolute left-50 top-10 mb-8">
          {['today', 'week', 'month', 'allTime'].map((tabKey) => (
            <button
              key={tabKey}
              className={`py-2 px-6 text-xl ${
                activeTab === tabKey
                  ? isDarkMode
                    ? 'text-yellow-500 font-bold border-b-2 border-yellow-500'
                    : 'text-yellow-700 font-bold border-b-2 border-yellow-700'
                  : isDarkMode
                    ? 'hover:text-yellow-500'
                    : 'hover:text-yellow-700'
              }`}
              onClick={() => setActiveTab(tabKey)}
            >
              {tabKey === 'today' && 'Today'}
              {tabKey === 'week' && 'This Week'}
              {tabKey === 'month' && 'This Month'}
              {tabKey === 'allTime' && 'All Time'}
            </button>
          ))}
        </div>
        <DarkModeToggle />
      </div>

      <div className="absolute top-1/6 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[4rem] font-bold">Leaderboard</h1>
      </div>

      {/* Body: Leaderboard */}
      <div className="absolute top-50 left-50 transform">
        <div className="max-h-[30rem]">
          {leaderboard.length > 0 ? (
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="text-xl">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Nickname</th>
                  <th className="px-4 py-2">Balance</th>
                  <th className="px-4 py-2">Time Remaining</th>
                  <th className="px-4 py-2">Spins Remaining</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, i) => (
                  <tr key={i} className="text-lg border-t">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{entry.nickname ?? 'Unknown'}</td>
                    <td className="px-4 py-2">
                      {typeof entry.final_balance === 'number'
                        ? `$${entry.final_balance.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="px-4 py-2">
                      {typeof entry.time_used === 'number'
                        ? `${60 - entry.time_used}s`
                        : '—'}
                    </td>
                    <td className="px-4 py-2">
                      {typeof entry.spins_used === 'number'
                        ? `${20 - entry.spins_used}`
                        : '—'}
                    </td>
                    <td className="px-4 py-2">
                      {entry.played_at
                        ? new Date(entry.played_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-2">
                      {entry.played_at
                        ? new Date(entry.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xl">No entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
