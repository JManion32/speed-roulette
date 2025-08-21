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
        <h1 className="transition duration-200 text-[4rem] font-bold mt-8 mb-8">Site Statistics</h1>

        <div className="flex border-b border-gray-700 mb-8 space-x-6">
          {['today', 'week', 'month', 'allTime'].map((tab) => (
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
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab === 'today' && 'Today'}
              {tab === 'week' && 'This Week'}
              {tab === 'month' && 'This Month'}
              {tab === 'allTime' && 'All Time'}
            </button>
          ))}
        </div>

        <div className="w-full max-w-5xl space-y-10">
          <div className="space-y-8">
            <div className="space-y-8">
              
              <div className="flex flex-wrap items-center gap-6 sm:gap-x-16 mb-12">
                
                <div className="flex items-center gap-x-4 whitespace-nowrap">
                  <button
                    className={`transition duration-200 h-12 px-4 rounded-md font-bold text-[1.35rem] pointer-events-none shadow-md ${
                      isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}
                  >
                    Spins: {stats.numSpins.toLocaleString()}
                  </button>
                </div>
                
                <div className="flex items-center gap-x-4 whitespace-nowrap">
                  <button
                    className={`transition duration-200 h-12 px-4 rounded-md font-bold text-[1.35rem] pointer-events-none shadow-md ${
                      isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}
                  >
                    Games Completed: {stats.completedGames.toLocaleString()}
                  </button>
                </div>

                <div className="flex items-center gap-x-4 whitespace-nowrap">
                  <button
                    className={`transition duration-200 h-12 px-4 rounded-md font-bold text-[1.35rem] pointer-events-none shadow-md ${
                      isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}
                  >
                    Total Won: ${stats.totalWon.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </button>
                </div>
              </div>
            
            <div className="flex items-center gap-6">
              <h2 className="transition duration-200 w-48 text-2xl font-semibold whitespace-nowrap glow-hot-header">
                🔥 Hottest Numbers:
              </h2>
              <div className="flex flex-wrap gap-4 ml-12">
                {stats.hottestNumbers.map((n, i) => (
                  <div
                    key={i}
                    className={`relative w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shadow
                      ${getColorClass(n.number === 37 ? '00' : n.number.toString())}`}
                  >
                    <div className="absolute top-0 right-0 text-[0.75rem] text-yellow-300 font-extrabold translate-x-[-2px] px-1 translate-y-[-2px]">
                      ×{n.count ?? 0}
                    </div>
                    {n.number === 37 ? '00' : n.number}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <h2 className="transition duration-200 w-48 text-2xl font-semibold whitespace-nowrap glow-cold-header">
                ❄️ Coldest Numbers:
              </h2>
              <div className="flex flex-wrap gap-4 ml-12">
                {stats.coldestNumbers.map((n, i) => (
                  <div
                    key={i}
                    className={`relative w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shadow
                      ${getColorClass(n.number === 37 ? '00' : n.number.toString())}`}
                  >
                    <div className="absolute top-0 right-0 text-[0.75rem] text-yellow-300 font-extrabold translate-x-[-2px] px-1 translate-y-[-2px]">
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
                  <Bar data={createStackedBarData(stats.colorCounts, ['red', 'green', 'black', 'neither'])} options={stackedBarOptions} />
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
        <div className="h-14"></div>
      </div>
    </div>
  );
}

export default StatDisplay;
