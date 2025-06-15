import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';

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

  if (!showModal) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80">
      <div className={` 
        ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
        rounded-3xl p-8 w-[43.75rem] h-[37.5rem] max-w-[90%] relative flex flex-col items-center 
        ${isClosing ? 'slide-down' : 'slide-up'}
      `}>
        <div className="flex flex-col items-center">
          <h1 className="text-[4.25rem] text-yellow-500 font-bold flex justify-center mb-8">ROUND FINISHED!</h1>
          <div className="grid grid-cols-[12.5rem_1fr] gap-x-24 gap-y-6 mb-5">
            <p className="text-[1.5rem] font-bold">Time Remaining:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              {timeLeft}
            </button>

            <p className="text-[1.5rem] font-bold">Spins Remaining:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              {remSpins}
            </button>

            <p className="text-[1.5rem] font-bold">Final Balance:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              ${userBalance.toFixed(2)}
            </button>

            <p className="text-[1.875rem] font-bold mt-6">Rank (Today):</p>
            <button className={`h-12 w-45 rounded-md font-bold text-[1.75rem] mt-6 pointer-events-none text-yellow-500 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              N/A
            </button>
          </div>

          <div className="flex flex-row items-center mt-12">
            <button
              className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 ${
                isDarkMode ? 'bg-green-500 hover:bg-green-400' : 'bg-green-200 hover:bg-green-300'
              } transition-transform transform hover:scale-105`}
              onClick={() => {
                closeModal();
                newGame();
              }}
            >
              Play Again
            </button>

            <Link to="/" className="inline-block">
              <button className={`h-12 w-45 rounded-md font-bold text-[1.25rem] transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
