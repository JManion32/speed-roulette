import '../css/index.css'
import stats from "../assets/stats.png";
import trophy from "../assets/trophy.png";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import DarkModeToggle from "../components/DarkModeToggle";

function Home() {
  const { isDarkMode } = useDarkMode();
  const [showModal, setShowModal] = useState(false);   // State of the modal (open or closed)
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // about / rules / contact
  const [nickname, setNickname] = useState<string>("");
  const navigate = useNavigate();

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300); // match slide-down duration
  };

  // Close modal when clicking outside - fixed with proper type
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      setShowModal(false);
    }
  };
  
    return (
      <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        {/* Header */}
        <div className="p-4 flex top-0">
          <p className={`${isDarkMode ? 'text-blue-500 hover:text-blue-400' : 'text-blue-700 hover:text-purple-500'} underline`}
           onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScB-K5IMt4Bx_MBvFxeSjfaMtgWF5M3HrxAREoMcictemvp0w/viewform?usp=dialog', '_blank')}>Have a feature suggestion?</p>
          <DarkModeToggle />
        </div>
  
        {/* Center content - using absolute positioning */}
        <div className="absolute top-5/11 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[96px] mb-8 whitespace-nowrap font-bold constant-glow">Speed Roulette</h1>
          <div className="flex flex-col items-center">
<input 
  type="text" 
  value={nickname}
  onChange={(e) => setNickname(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && nickname) {
      e.preventDefault();
      localStorage.setItem("nickname", nickname);
      navigate('/game');
    }
  }}
  maxLength={50}
  className={`pl-4 ${isDarkMode ? 'bg-indigo-950 text-white border-1 border-white-100' : 'bg-gray-200 text-black border-2 border-black'} mb-6 rounded-md w-100 h-10`} 
  placeholder="Enter Nickname"
/>

<Link to="/game" className="inline-block">
  <button
    onClick={() => {
      localStorage.setItem("nickname", nickname);
      navigate('/game');
    }}
    className={`transition duration-200 px-8 py-2 rounded-md h-10 w-30 font-bold mb-14 ${
      nickname === ""
        ? isDarkMode
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : isDarkMode
          ? 'bg-green-500 hover:bg-green-400 transform hover:scale-105'
          : 'bg-green-300 hover:bg-green-400 transform hover:scale-105'
    }`}
    disabled={nickname === ""}
  >
    Play
  </button>
</Link>

            <div className="flex justify-center gap-4">
              <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-500 ' : 'bg-gray-300 hover:bg-gray-350 text-purple-900'} text-[80px] font-bold w-30 h-30 rounded-full flex justify-center mr-10 transition-transform transform hover:scale-110`}
              onClick={() => setShowModal(true)}>
                  ?
              </button>
              <Link to="/leaderboard" className="inline-block">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-350'} w-30 h-30 rounded-full flex justify-center items-center mr-10 transition-transform transform hover:scale-110`}>
                  <img src={trophy} alt="Trophy" className="w-20 h-20"/>
                </button>
              </Link>
              <Link to="/stats" className="inline-block">
                <button className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-350'} w-30 h-30 rounded-full flex justify-center items-center transition-transform transform hover:scale-110`}>
                  <img src={stats} alt="Statistics" className="w-20 h-20"/>
                </button>
              </Link>
            </div>
          </div>
        </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80" onClick={handleOutsideClick}>
          <div className={`
            ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
            rounded-3xl p-8 w-[800px] h-[550px] max-w-[90%] relative 
            ${isClosing ? 'slide-down' : 'slide-up'}`}>
            
            {/* Close button */}
            <button 
              className="absolute right-4 top-4 bg-red-600 hover:bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
              onClick={closeModal}>
              X
            </button>
            
            {/* Tabs */}
            <div className="border-b border-gray-700 mb-8">
              <button 
                className={`py-2 px-6 text-[28px] ${activeTab === 'about' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              <button 
                className={`py-2 px-6 text-[28px] ${activeTab === 'rules' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('rules')}
              >
                Rules
              </button>
              <button 
                className={`py-2 px-6 text-[28px] ${activeTab === 'contact' ? 'text-yellow-500 font-bold border-b-2 border-yellow-500' : 'hover:text-yellow-500'}`}
                onClick={() => setActiveTab('contact')}
              >
                Contact
              </button>
            </div>
            
            {/* Tab content */}
            <div className="max-h-[500px] overflow-y-auto">
              {activeTab === 'about' && (
                <div>
                  <p className="text-[20px] mb-6">
                    Speed Roulette is a fast-paced browser game created by Justin Manion, a Junior computer science student at Rensselaer Polytechnic Institute.
                    Inspired by the rules of speed chess, Speed Roulette puts an interesting twist on the beloved high stakes casino game.
                  </p>
                  <p className="text-[20px] font-bold mb-4">Note from the developer:</p>
                  <p className='text-[20px]'>
                    I hope you enjoy this website! It has been a dream come true to create this. Remember: anything is possible if you put your mind to it. Best of luck!
                  </p>
                </div>
              )}
              
              {activeTab === 'rules' && (
                <div>
                  <p className="mb-4">
                    <span className="text-[18px] font-bold">Standard Roulette Rules:</span><br/>
                    Bet on what the winning number will be by placing chips on the betting table.
                  </p>
                  <div className="mb-4 space-y-1 pl-12">
                    <div className="flex">
                        <span className="font-medium w-72">Single numbers:</span>
                        <span className="font-bold text-right w-12">35:1</span>
                    </div>
                    <div className="flex">
                        <span className="font-medium w-72">Red/Black | Even/Odd | Low/High:</span>
                        <span className="font-bold text-right w-12">1:1</span>
                    </div>
                    <div className="flex">
                        <span className="font-medium w-72">Rows | Dozens:</span>
                        <span className="font-bold text-right w-12">2:1</span>
                    </div>
                  </div>
                  <p className="mb-4">You can also bet on multiple buttons at a time with one chip (ie: half on 7, half on 10).
                    <br />For more details, see the{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Roulette#Types_of_bets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Wikipedia Roulette Types of Bets page
                    </a>.
                  </p>
                  <p className="mb-4">
                    <span className="text-[18px] font-bold">Speed Roulette Twist:</span><br/>
                    <ul className="list-disc pl-8 mb-6">
                      <li>Start with $20, 10 possible spins, and 1 minute on the clock.</li>
                      <li>The timer begins when you place your first bet.</li>
                      <li>After each bet, a number is drawn instantly. Winnings are then paid out, and the next round begins 2.5 seconds later.</li>
                    </ul>
                    <i>Make as much as you can before you run out of <b>time</b>, <b>spins</b>, or <b>money</b>!</i>
                  </p>
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div>
                  <p className="text-[32px] mb-10">
                    <span className="font-bold">Inquiries:</span> jman32@speedroulette.io
                  </p>
                  <button 
                    className="h-25 w-150 bg-red-500 hover:bg-red-400 font-bold text-[64px] text-white rounded-md mb-10"
                    onClick={() => window.open('https://youtube.com/@jmancodes?si=ZgYwDV3Fj49Z4-uH', '_blank')}>
                    YouTube
                  </button><br></br>
                  <button className="h-25 w-150 bg-blue-500 hover:bg-blue-400 font-bold text-[64px] text-white rounded-md"
                  onClick={() => window.open('https://linkedin.com/in/jmanion32', '_blank')}>
                    LinkedIn
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
  
        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 text-center">
          <p className="text-purple-700 hover:text-purple-500">Privacy</p>
        </div>
      </div>
    )
  }

export default Home