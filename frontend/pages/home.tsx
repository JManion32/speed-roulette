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

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("https://speedroulette.io");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // revert after 2 seconds
  };
  
    return (
      <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'}`}
          data-cy="main-app-div">
        {/* Header */}
        <div className="p-4 flex top-0">
          <DarkModeToggle />
        </div>
  
        {/* Center content - using absolute positioning */}
        <div className="absolute top-5/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className={`text-[6.5rem] mb-4 whitespace-nowrap font-bold fade-in transition duration-200 ${isDarkMode ? 'constant-glow' : 'light-glow'}`}>Speed Roulette</h1>
          <div className="flex flex-col items-center">
            <p className="text-red-500 font-bold font-size: 4rem mb-1" id="profanity-error">Please choose a clean nickname!</p>
            <input 
              type="text" 
              id="nickname-enter-form"
              data-cy="nickname-enter-form"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nickname) {
                  e.preventDefault();
                  startGame();
                }
              }}
              maxLength={20}
              className={`transition duration-200 pl-4 font-bold ${isDarkMode ? 'bg-indigo-950 text-white border-1' : 'bg-white text-black border-2 border-black'} mb-6 rounded-md w-100 h-10`} 
              placeholder="Enter Nickname"
              title="Enter your nickname"
            />
            <Link to="">
              <button
                data-cy="play-button"
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
                      : 'bg-green-250 hover:bg-green-350 transform hover:scale-105 border-2'
                }`}
                disabled={nickname === ""}
              >
                Play
              </button>
            </Link>

            <div className="flex justify-center gap-4">
              <Link to="" className="inline-block"> {/*This link has no functiomality, however, the dark mode transition is different from the other buttons without it*/}
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300 border-black border-2'}
                w-30 h-30 rounded-full flex justify-center items-center mr-10 duration-200 hover:scale-110`}
                onClick={() => setShowModal(true)}
                data-cy="open-about-modal">
                    <img
                      src={about}
                      alt="About"
                      className="w-20 h-20"
                      draggable="false"/>
                </button>
              </Link>
              <Link to="/leaderboard" className="inline-block">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300 border-black border-2'}
                w-30 h-30 rounded-full flex justify-center items-center mr-10 duration-200 hover:scale-110`}
                data-cy="open-leaderboard-page">
                  <img
                    src={trophy}
                    alt="Trophy"
                    className="w-20 h-20"
                    draggable="false"/>
                </button>
              </Link>
              <Link to="/stats" className="inline-block">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300 border-black border-2'}
                w-30 h-30 rounded-full flex justify-center items-center duration-200 hover:scale-110`}
                data-cy="open-stats-page">
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
            <p className="inline font-bold text-purple-700 hover:text-purple-500 duration-200" onClick={() => setShowPrivacy(true)}>
              Privacy Policy
            </p>
            <span className="inline ml-3 mr-3"> | </span>
            <p
              className="inline cursor-pointer font-bold text-purple-700 hover:text-purple-500 transition duration-200"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Share"}
            </p>
            <span className="inline ml-3 mr-3"> | </span>
            <p className="inline font-bold text-purple-700 hover:text-purple-500 duration-200" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScB-K5IMt4Bx_MBvFxeSjfaMtgWF5M3HrxAREoMcictemvp0w/viewform?usp=dialog', '_blank')}>Have a feature suggestion?</p>
        </div>
        <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      </div>
    )
  }

export default Home