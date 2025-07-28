import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useLogGame } from '../hooks/useLogGame';
import { useLogout } from '../hooks/useLogout';
import { usePlayAgain } from '../hooks/usePlayAgain';

interface ResultModalProps {
  showModal: boolean;
  isClosing: boolean;
  timeLeft: number;
  remSpins: number;
  userBalance: number;
  closeModal: () => void;
  newGame: () => void;
}

export default function ResultModal({
  showModal,
  isClosing,
  timeLeft,
  remSpins,
  userBalance,
  closeModal,
  newGame,
}: ResultModalProps) {
  const { isDarkMode } = useDarkMode();
  const { rank, logGame } = useLogGame();
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname");
  const playAgain = usePlayAgain();
  const logout = useLogout();

  useEffect(() => {
    if (showModal && nickname) {
      (async () => {
        if (userBalance > 0) {
          await logGame(nickname, userBalance, remSpins, timeLeft);
        }
        await logout();
      })();
    }
  }, [showModal]);

  if (!showModal) return null;

  // Instantly restart with an outside click
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      if (!nickname) {
        alert("Nickname missing. Please reload the page.");
        return;
      }

      const token = playAgain(nickname);
      if (!token) {
        alert("Could not start new game. Try refreshing the page.");
        return;
      }

      closeModal();
      newGame();
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80" onClick={handleOutsideClick}>
      <div className={`
        ${isDarkMode ? 'bg-gray-800' : 'bg-light-mode'} 
        rounded-3xl p-8 w-[43.75rem] h-[37.5rem] max-w-[90%] relative flex flex-col items-center overflow-y-auto
        ${isClosing ? 'slide-down' : 'slide-up'}
      `}>
        <div className="flex flex-col items-center">
          <h1 className={`text-[4.25rem] font-bold flex justify-center mb-8 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>
            ROUND FINISHED!
          </h1>

          <div className="grid grid-cols-[12.5rem_1fr] gap-x-24 gap-y-6 mb-10">
            <p className="text-[1.5rem] font-bold">Final Balance:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}
            data-cy="result-balance">
              ${userBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </button>

            <p className="text-[1.5rem] font-bold">Time Remaining:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}
            data-cy="result-time">
              {timeLeft}s
            </button>

            <p className="text-[1.5rem] font-bold">Spins Remaining:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}
            data-cy="result-spins">
              {remSpins}
            </button>
          </div>

          <hr className={`w-[32rem] mb-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}/>
          <div className="grid grid-cols-[12.5rem_1fr] gap-x-24 gap-y-6">
            <p className="text-[1.875rem] font-bold">Daily Rank:</p>
            <button className={`h-12 w-45 rounded-md font-bold text-[1.75rem] pointer-events-none border-[0.125rem] ${isDarkMode ? 'bg-gray-600 text-yellow-500 border-yellow-500' : 'bg-white text-yellow-700 border-yellow-700'}`}
            data-cy="user-rank">
              {userBalance > 0 && rank !== null ? `#${rank}` : "Unranked"}
            </button>
          </div>
          <hr className={`w-[32rem] mt-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}/>

          <div className="flex flex-row items-center mt-12">
            <button
              className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 transition-transform transform hover:scale-105
                ${isDarkMode ? 'bg-green-500 hover:bg-green-400' : 'bg-green-250 hover:bg-green-350'}
              }`}
              data-cy="result-play-again"
              onClick={async () => {
                if (!nickname) {
                  alert("Nickname missing. Please reload the page.");
                  return;
                }

                const token = await playAgain(nickname);
                if (!token) {
                  alert("Could not start new game. Try refreshing the page.");
                  return;
                }
                closeModal();
                newGame();
              }}
            >
              Play Again
            </button>
            <button
              className={`h-12 w-45 rounded-md font-bold text-[1.25rem] transition-transform transform hover:scale-105 ${isDarkMode ? 'text-white bg-gray-600 hover:bg-gray-500' : 'text-black bg-gray-300 hover:bg-gray-350'}`}
              onClick={() => {
                localStorage.removeItem("nickname");
                navigate("/");
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
      <p className={`transition absolute bottom-5 right-5 font-bold text-[1rem] animate-pulse duration-200 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>Click anywhere to play again!</p>
    </div>
  );
}
