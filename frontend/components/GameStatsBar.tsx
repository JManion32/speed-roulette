import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface GameStatsBarProps {
  totalBet: number;
  timeLeft: number;
  remSpins: number;
  animatedBalance: number;
  balanceChangeDirection: 'up' | 'down' | null;
}

export default function GameStatsBar({
  totalBet,
  timeLeft,
  remSpins,
  animatedBalance,
  balanceChangeDirection,
}: GameStatsBarProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Timer and spins section */}
      <div className="flex justify-center mb-5 w-full space-x-16">
        <div className="flex justify-center mb-5 w-full space-x-12">
          {/* Balance */}
          <div className="flex items-center min-w-[200px] whitespace-nowrap">
            <p className="text-[24px] font-bold mr-2">Balance:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none transition-colors duration-300
                ${balanceChangeDirection === 'up'
                  ? 'bg-green-400'
                  : balanceChangeDirection === 'down'
                  ? 'bg-red-400'
                  : isDarkMode
                  ? '!bg-gray-600'
                  : '!bg-gray-200'}`}
            >
              ${animatedBalance.toFixed(2)}
            </button>
          </div>

          {/* Bet */}
          <div className="flex items-center min-w-[150px] whitespace-nowrap">
            <p className="text-[24px] font-bold mr-2">Bet:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              ${totalBet.toFixed(2)}
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center min-w-[150px] whitespace-nowrap">
            <p className="text-[24px] font-bold mr-2">Time:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              {timeLeft}
            </button>
          </div>

          {/* Spins */}
          <div className="flex items-center min-w-[100px] whitespace-nowrap">
            <p className="text-[24px] font-bold mr-2">Spins:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}
            >
              {remSpins}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
