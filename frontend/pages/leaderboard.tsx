// frontend/pages/leaderboard.tsx
import '../css/index.css'
import sun from "../assets/sun.png";
import home from "../assets/home.png";
import moon_white from "../assets/moon_white.png";
import home_white from "../assets/home_white.png";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Leaderboard() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const [activeTab, setActiveTab] = useState('today');

    return (
      // Header, includes home and mode toggle buttons
      <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-4 flex top-0">
          <Link to="/" className="inline-block">
            <button 
              className={`absolute right-24 rounded-full w-15 h-15 flex justify-center items-center transition-transform transform hover:scale-110 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
              <img src={isDarkMode ? home_white : home} alt="Home" className="w-12 h-12" />
            </button>
          </Link>
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
          <button 
            className={`absolute right-6 rounded-full w-15 h-15 transition-transform transform hover:scale-110 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setIsDarkMode(!isDarkMode)}>
            <img src={isDarkMode ? moon_white : sun} alt={isDarkMode ? "Sun" : "Moon"}/>
          </button>
        </div>
        {/*Body: Leaderboard and Table*/}
        <div  className="absolute top-40 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[64px] font-bold">Leaderboard</h1>
        </div>
      </div>
    );
  }
  
  export default Leaderboard;