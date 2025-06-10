// frontend/pages/leaderboard.tsx
import '../css/index.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";

function Stats() {
  const { isDarkMode } = useDarkMode();

    return (
      // Header, includes home and mode toggle buttons
      <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="p-4 flex top-0">
          <HomeButton />
          <DarkModeToggle />
        </div>
        {/*Body: Statistics Table*/}
        <div  className="absolute top-1/6 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[64px] font-bold">Cool Statistics</h1>
        </div>
      </div>
    );
  }
  
  export default Stats;