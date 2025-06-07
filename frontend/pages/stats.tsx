// frontend/pages/leaderboard.tsx
import '../css/index.css'
import sun from "../assets/sun.png";
import home from "../assets/home.png";
import moon_white from "../assets/moon_white.png";
import home_white from "../assets/home_white.png";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Stats() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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
          <button 
            className={`absolute right-6 rounded-full w-15 h-15 transition-transform transform hover:scale-110 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => setIsDarkMode(!isDarkMode)}>
            <img src={isDarkMode ? moon_white : sun} alt={isDarkMode ? "Sun" : "Moon"}/>
          </button>
        </div>
        {/*Body: Statistics Table*/}
        <div  className="absolute top-1/6 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[64px] font-bold">Cool Statistics</h1>
        </div>
      </div>
    );
  }
  
  export default Stats;