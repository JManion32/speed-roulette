import '../css/index.css';
import { useState } from 'react';
import { useDarkMode } from "../contexts/DarkModeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";
import { useRoundData } from '../hooks/useRoundData';

function RoundDisplay() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('today');

  const { data: allRounds, loading } = useRoundData();
  const rounds = allRounds[activeTab] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 flex top-0 h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'}`}>
      <HomeButton />
      <DarkModeToggle />
      <div className="absolute top-26 left-97 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-[4rem] font-bold">Cool Statistics</h1>
      </div>
      <div className="flex justify-center border-b border-gray-700 absolute left-50 top-48 mb-8">
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
      <div className="absolute top-64 left-50 transform">
        <div className="max-h-[30rem]">
          {rounds.length > 0 ? (
            <>
              <table className="w-full text-left border-collapse mt-4">
                <thead>
                  <tr className="text-xl">
                    <th className="pl-6 pr-10 py-2">#</th>
                    <th className="pr-10 py-2">Number</th>
                    <th className="pr-10 py-2">Color</th>
                    <th className="pr-10 py-2">Parity</th>
                    <th className="pr-10 py-2">Half</th>
                    <th className="pr-10 py-2">Dozen</th>
                    <th className="pr-10 py-2">Row</th>
                    <th className="pr-16 py-2">Date</th>
                    <th className="pr-24 py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rounds.map((entry, i) => (
                    <tr
                      key={i}
                      className={`text-lg border-t ${
                        isDarkMode
                          ? (i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800')
                          : (i % 2 === 0 ? 'bg-light-mode' : 'bg-gray-100')
                      }`}
                    >
                      <td className="pl-6 pr-10 font-bold">{i + 1}</td>
                      <td className="pr-10 py-2">{entry.number}</td>
                      <td className="pr-10 py-2 capitalize">{entry.color}</td>
                      <td className="pr-10 py-2 capitalize">{entry.parity}</td>
                      <td className="pr-10 py-2 capitalize">{entry.half}</td>
                      <td className="pr-10 py-2 capitalize">{entry.dozen}</td>
                      <td className="pr-10 py-2 capitalize">{entry.row}</td>
                      <td className="pr-16 py-2">
                        {entry.played_at
                          ? new Date(entry.played_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="pr-24 py-2">
                        {entry.played_at
                          ? new Date(entry.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="h-16"></div>
            </>
          ) : (
            <p className="text-xl">No rounds yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoundDisplay;
