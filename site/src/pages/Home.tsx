import '../css/index.css';
import '../css/home.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useDarkMode } from '../contexts/DarkModeContext';

import DarkModeToggle from '../components/DarkModeToggle';
import HomeActionButtons from '../components/HomeActionButtons';
import HomeFooter from '../components/HomeFooter';

import { useStartGame } from '../hooks/useStartGame';

import { generateSplashText } from '../utils/generateSplashText';

function Home() {
    const { isDarkMode } = useDarkMode();
    const [nickname, setNickname] = useState('');
    const startGame = useStartGame(nickname, setNickname);
    const [splashText] = useState(() => generateSplashText());

    return (
        <div
            className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-light-mode text-black'}`}
            data-cy="main-app-div"
        >
            {/* Header */}
            <div className="p-4 flex top-0">
                <DarkModeToggle />
            </div>

            {/* Center content - using absolute positioning */}
            <div className="absolute top-5/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mb-4">
                <h1
                    className={`text-[6.5rem] whitespace-nowrap font-bold fade-in transition duration-200 ${isDarkMode ? 'constant-glow' : 'light-glow'}`}
                >
                    Speed Roulette
                </h1>
                <p
                    className={`text-[1rem] mb-2 whitespace-nowrap font-bold fade-in transition duration-200 ${isDarkMode ? 'constant-glow' : 'light-glow'}`}
                >
                    {splashText}
                </p>
                <div className="flex flex-col items-center">
                    <p className="text-red-500 font-bold font-size: 4rem mb-1" id="profanity-error">
                        Please choose a clean nickname!
                    </p>
                    <input
                        type="text"
                        id="nickname-enter-form"
                        data-cy="nickname-enter-form"
                        value={nickname}
                        name="nickname"
                        autoComplete="nickname"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        onChange={(e) => setNickname(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && nickname) {
                                e.preventDefault();
                                startGame();
                            }
                        }}
                        maxLength={20}
                        className={`transition duration-200 pl-4 font-bold shadow-md border-[0.125rem] ${isDarkMode ? 'bg-indigo-950 text-white border-gray-600' : 'bg-white text-black border-gray-400'} mb-6 rounded-md w-100 h-10`}
                        placeholder="Enter Nickname"
                        title="Enter your nickname"
                    />
                    <Link to="">
                        <button
                            data-cy="play-button"
                            onClick={() => {
                                startGame();
                            }}
                            className={`transition duration-200 px-8 py-2 rounded-md h-10 w-30 font-bold mb-14 shadow-md ${
                                nickname === ''
                                    ? isDarkMode
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                    : isDarkMode
                                      ? 'bg-green-500 hover:bg-green-400 transform hover:scale-105'
                                      : 'bg-green-250 hover:bg-green-350 transform hover:scale-105'
                            }`}
                            disabled={nickname === ''}
                        >
                            Play
                        </button>
                    </Link>
                </div>
                <HomeActionButtons />
            </div>
            <HomeFooter />
        </div>
    );
}

export default Home;
