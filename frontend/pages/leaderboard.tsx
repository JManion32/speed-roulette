// frontend/pages/leaderboard.tsx
import '../css/index.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";

function Leaderboard() {
  const { isDarkMode } = useDarkMode();

  const [activeTab, setActiveTab] = useState('today');

    return (
      // Header, includes home and mode toggle buttons
      <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-4 flex top-0">
          <HomeButton />
          {/* Tabs */}
            <div className="flex justify-center border-b border-gray-700 absolute left-50 top-10 mb-8">
              <button 
                className={`py-2 px-6 text-xl ${activeTab === 'today' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('today')}
              >
                Today
              </button>
              <button 
                className={`py-2 px-6 text-xl ${activeTab === 'week' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('week')}
              >
                This Week
              </button>
              <button 
                className={`py-2 px-6 text-xl ${activeTab === 'month' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('month')}
              >
                This Month
              </button>
              <button 
                className={`py-2 px-6 text-xl ${activeTab === 'allTime' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('allTime')}
              >
                All Time
              </button>
            </div>
          <DarkModeToggle />
        </div>
        {/*Body: Leaderboard and Table*/}
        <div  className="absolute top-40 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[64px] font-bold">Leaderboard</h1>
        </div>
      </div>
    );
  }
  
  export default Leaderboard;