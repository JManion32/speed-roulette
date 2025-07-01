import '../css/index.css';
import { useState } from 'react';
import { useDarkMode } from "../contexts/DarkModeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";
import { useStatData } from '../hooks/useStatData';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  createStackedBarData,
  stackedBarOptions,
} from '../utils/chartUtils'; // ✅ renamed import to match your message

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function StatDisplay() {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month' | 'allTime'>('today');
  const { data: allStats, loading } = useStatData();

  const stats = allStats[activeTab];

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 flex flex-col items-center transition duration-200 select-none ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'
      }`}
    >
      <div className="w-full flex justify-between px-4 mb-4">
        <HomeButton />
        <DarkModeToggle />
      </div>

      <h1 className="text-[3rem] font-bold text-center mt-4 mb-6">Cool Statistics</h1>

      <div className="flex justify-center border-b border-gray-700 mb-8 space-x-6">
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
            onClick={() => setActiveTab(tabKey as typeof activeTab)}
          >
            {tabKey === 'today' && 'Today'}
            {tabKey === 'week' && 'This Week'}
            {tabKey === 'month' && 'This Month'}
            {tabKey === 'allTime' && 'All Time'}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl space-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Top 5 Hottest Numbers</h2>
          <p className="text-lg">{stats.hottestNumbers.join(', ')}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Top 5 Coldest Numbers</h2>
          <p className="text-lg">{stats.coldestNumbers.join(', ')}</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Color Distribution</h2>
          <div className="h-8">
            <Bar data={createStackedBarData(stats.colorCounts)} options={stackedBarOptions} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Parity Distribution</h2>
          <div className="h-8">
            <Bar data={createStackedBarData(stats.parityCounts)} options={stackedBarOptions} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">High/Low Distribution</h2>
          <div className="h-8">
            <Bar data={createStackedBarData(stats.halfCounts)} options={stackedBarOptions} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Dozen Distribution</h2>
          <div className="h-8">
            <Bar data={createStackedBarData(stats.dozenCounts)} options={stackedBarOptions} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Row Distribution</h2>
          <div className="h-8">
            <Bar data={createStackedBarData(stats.rowCounts)} options={stackedBarOptions} />
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}

export default StatDisplay;
