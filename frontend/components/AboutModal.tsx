// src/components/AboutModal.tsx
import { useDarkMode } from "../contexts/DarkModeContext";
import { useState, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AboutModal({ isOpen, onClose }: ModalProps) {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState("about");
  const [isClosing, setIsClosing] = useState(false);

  // Handle modal close with animation
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match slide-down duration
  };

  // Close on outside click
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("about");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80" onClick={handleOutsideClick}>
      <div className={`
        ${isDarkMode ? 'bg-gray-800' : 'bg-light-mode'} 
        rounded-3xl p-8 w-[50rem] h-[36.2rem] max-w-[90%] relative 
        ${isClosing ? 'slide-down' : 'slide-up'}`}
      >
        <button 
          className="absolute right-4 top-4 bg-red-600 hover:bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
          onClick={closeModal}>
          X
        </button>

        <div className="border-b border-gray-700 mb-8">
          {['about', 'rules', 'contact'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-6 text-[1.75rem] ${
                activeTab === tab
                  ? isDarkMode
                    ? 'text-yellow-500 font-bold border-b-2 border-yellow-500'
                    : 'text-yellow-700 font-bold border-b-2 border-yellow-700'
                  : isDarkMode
                    ? 'hover:text-yellow-500'
                    : 'hover:text-yellow-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="max-h-[31.25rem] overflow-y-auto text-[1.125rem]">
          {activeTab === 'about' && (
            <>
              <p className="mb-6">
                  Inspired by the intensity of speed chess, Speed Roulette puts an interesting twist on the beloved high-stakes casino game. Players start with 
                  20 dollars, 10 possible spins, and just 60 seconds on the clock. When bets are submitted, the winning number is revealed, earnings are paid out, and 
                  the clock starts ticking again 2.5 seconds later. Compete for a spot on the daily leaderboard by making quick decisions, taking bold risks, and hitting 
                  big payouts.
              </p>
              <p className="font-bold mb-4">Note from the developer:</p>
              <p>
                I hope you enjoy this website! It has been a dream come true to create this. Remember: anything is possible if you put your mind to it. Best of luck!
              </p>
            </>
          )}

          {activeTab === 'rules' && (
            <>
              <p className="mb-4">
                <span className="font-bold">Standard Roulette Rules:</span><br />
                Bet on what the winning number will be by placing chips on the betting table.
              </p>
              <div className="mb-4 space-y-1 pl-12">
                <div className="flex justify-between w-5/8"><span>Single numbers:</span><span className="font-bold">35:1</span></div>
                <div className="flex justify-between w-5/8"><span>Red/Black | Even/Odd | Low/High:</span><span className="font-bold">1:1</span></div>
                <div className="flex justify-between w-5/8"><span>Rows | Dozens:</span><span className="font-bold">2:1</span></div>
              </div>
              <p className="mb-4">
                You can also bet on multiple buttons at a time with one chip (e.g., half on 7, half on 10). For more details, see the{" "}
                <a href="https://en.wikipedia.org/wiki/Roulette#Types_of_bets" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Wikipedia Roulette Types of Bets page
                </a>.
              </p>
              <p>
                <span className="font-bold">Speed Roulette Twist:</span><br />
                <ul className="list-disc pl-8 mb-6">
                  <li>Start with $20, 10 spins, and 60 seconds on the clock.</li>
                  <li>The timer begins when you place your first bet.</li>
                  <li>When bets are submitted, there is a 2.5s pause before the next round where the number is revealed, and winnings are paid out.</li>
                </ul>
                <i>Make as much as you can before you run out of <b>time</b>, <b>spins</b>, or <b>money</b>!</i>
              </p>
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <p className="text-[2rem] mb-10">
                <span className="font-bold">Inquiries:</span> jman32@speedroulette.io
              </p>
              <button 
                className="h-25 w-150 bg-red-500 hover:bg-red-400 font-bold text-[4rem] text-white rounded-md mb-10"
                onClick={() => window.open('https://youtube.com/@jmancodes?si=ZgYwDV3Fj49Z4-uH', '_blank')}
              >
                YouTube
              </button><br />
              <button 
                className="h-25 w-150 bg-blue-500 hover:bg-blue-400 font-bold text-[4rem] text-white rounded-md"
                onClick={() => window.open('https://linkedin.com/in/jmanion32', '_blank')}
              >
                LinkedIn
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
