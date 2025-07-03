import '../css/index.css';
import { useState } from 'react';
import { useDarkMode } from "../contexts/DarkModeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";
import { useStatData } from '../hooks/useStatData';
import { getColorClass } from '../utils/recentNumColor';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  createStackedBarData,
  stackedBarOptions,
} from '../utils/chartUtils';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);


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
      className={`p-4 flex flex-col items-center transition duration-200 select-none h-screen ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'
      }`}
    >
      <div className="w-full flex justify-between px-4 mb-4">
        <HomeButton />
        <DarkModeToggle />
      </div>
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-[4rem] font-bold mt-10 mb-8">Site Statistics</h1>

        <div className="flex border-b border-gray-700 mb-8 space-x-6">
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

        <div className="w-full max-w-5xl space-y-10">
          <div className="space-y-8">
            <div className="space-y-8">
              
        <div className="flex items-center gap-6">
          <h2 className="w-48 text-2xl font-semibold whitespace-nowrap glow-hot-header">
            🔥 Hottest Numbers:
          </h2>
          <div className="flex flex-wrap gap-4 ml-12">
            {stats.hottestNumbers.map((n, i) => (
              <div
                key={i}
                className={`relative w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                  getColorClass(n.number === 37 ? '00' : n.number.toString())
                }`}
              >
                <div className="absolute top-0 right-0 text-[12px] text-yellow-300 font-extrabold px-1 translate-x-[-2px] translate-y-[-2px]">
                  ×{n.count ?? 0}
                </div>
                {n.number === 37 ? '00' : n.number}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <h2 className="w-48 text-2xl font-semibold whitespace-nowrap glow-cold-header">
            ❄️ Coldest Numbers:
          </h2>
          <div className="flex flex-wrap gap-4 ml-12">
            {stats.coldestNumbers.map((n, i) => (
              <div
                key={i}
                className={`relative w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                  getColorClass(n.number === 37 ? '00' : n.number.toString())
                }`}
              >
                <div className="absolute top-0 right-0 text-[12px] text-yellow-300 font-extrabold px-1 translate-x-[-2px] translate-y-[-2px]">
                  ×{n.count ?? 0}
                </div>
                {n.number === 37 ? '00' : n.number}
              </div>
            ))}
          </div>
        </div>
        </div>
          </div>
          <div>
            <div className="h-12">
              <Bar data={createStackedBarData(stats.colorCounts, ['red', 'green', 'black'])} options={stackedBarOptions} />
            </div>
          </div>

          <div>
            <div className="h-12">
              <Bar data={createStackedBarData(stats.parityCounts, ['even', 'neither', 'odd'])} options={stackedBarOptions} />
            </div>
          </div>

          <div>
            <div className="h-12">
              <Bar data={createStackedBarData(stats.halfCounts, ['low', 'neither', 'high'])} options={stackedBarOptions} />
            </div>
          </div>

          <div>
            <div className="h-12">
              <Bar data={createStackedBarData(stats.dozenCounts, ['first', 'second', 'third', 'neither'])} options={stackedBarOptions} />
            </div>
          </div>

          <div>
            <div className="h-12">
              <Bar data={createStackedBarData(stats.rowCounts, ['top', 'middle', 'bottom', 'neither'])} options={stackedBarOptions} />
            </div>
          </div>
        </div>
        <div className="h-16"></div>
      </div>
    </div>
  );
}

export default StatDisplay;
