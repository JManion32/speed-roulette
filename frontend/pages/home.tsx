import '../css/index.css'
import '../css/home.css'
import about from "../assets/about.png";
import stats from "../assets/stats.png";
import trophy from "../assets/trophy.png";
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import AboutModal from "../components/AboutModal";
import DarkModeToggle from "../components/DarkModeToggle";
import PrivacyModal from "../components/PrivacyModal";

// Hooks
import { useStartGame } from "../hooks/useStartGame"; // adjust path if needed

function Home() {
  const { isDarkMode } = useDarkMode();
  const [showModal, setShowModal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [nickname, setNickname] = useState("");
  const startGame = useStartGame(nickname, setNickname);
  
    return (
      <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'}`}>
        {/* Header */}
        <div className="p-4 flex top-0">
          <p className={`font-bold ${isDarkMode ? 'text-blue-500 hover:text-blue-400' : 'text-blue-700 hover:text-purple-500'} underline`}
           onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScB-K5IMt4Bx_MBvFxeSjfaMtgWF5M3HrxAREoMcictemvp0w/viewform?usp=dialog', '_blank')}>Have a feature suggestion?</p>
          <DarkModeToggle />
        </div>
  
        {/* Center content - using absolute positioning */}
        <div className="absolute top-5/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className={`text-[6.5rem] mb-4 whitespace-nowrap font-bold fade-in ${isDarkMode ? 'constant-glow' : 'light-glow'}`}>Speed Roulette</h1>
          <div className="flex flex-col items-center">
            <p className="text-red-500 font-bold font-size: 4rem mb-1" id="profanity-error">Please choose a clean nickname!</p>
            <input 
              type="text" 
              id="nickname-enter-form"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nickname) {
                  e.preventDefault();
                  startGame();
                }
              }}
              maxLength={20}
              className={`pl-4 font-bold ${isDarkMode ? 'bg-indigo-950 text-white border-1' : 'bg-white text-black border-2 border-black'} mb-6 rounded-md w-100 h-10`} 
              placeholder="Enter Nickname"
            />

            <button
              onClick={() => {
                startGame();
              }}
              className={`transition duration-200 px-8 py-2 rounded-md h-10 w-30 font-bold mb-14 ${
                nickname === ""
                  ? isDarkMode
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-green-500 hover:bg-green-400 transform hover:scale-105'
                    : 'bg-green-300 hover:bg-green-400 transform hover:scale-105 border-2'
              }`}
              disabled={nickname === ""}
            >
              Play
            </button>

            <div className="flex justify-center gap-4">
              <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'border-2 border-black bg-white hover:bg-gray-300'} w-30 h-30 rounded-full flex justify-center items-center mr-10 transition-transform transform hover:scale-110`}
              onClick={() => setShowModal(true)}>
                  <img
                    src={about}
                    alt="About"
                    className="w-20 h-20"
                    draggable="false"/>
              </button>
              <Link to="/leaderboard" className="inline-block">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'border-2 border-black bg-white hover:bg-gray-300'} w-30 h-30 rounded-full flex justify-center items-center mr-10 transition-transform transform hover:scale-110`}>
                  <img
                    src={trophy}
                    alt="Trophy"
                    className="w-20 h-20"
                    draggable="false"/>
                </button>
              </Link>
              <Link to="/stats" className="inline-block">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'border-2 border-black bg-white hover:bg-gray-300'} w-30 h-30 rounded-full flex justify-center items-center transition-transform transform hover:scale-110`}>
                  <img
                    src={stats}
                    alt="Statistics"
                    className="w-20 h-20"
                    draggable="false"/>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <AboutModal isOpen={showModal} onClose={() => setShowModal(false)} />
  
        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 text-center">
            <p
              className="font-bold text-purple-700 hover:text-purple-500"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy
            </p>
        </div>
        <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      </div>
    )
  }

export default Home