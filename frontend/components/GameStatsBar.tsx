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
          <div className="flex items-center min-w-[12.5rem] whitespace-nowrap">
            <p className="text-[1.5rem] font-bold mr-2">Balance:</p>
            <button
            className={`h-10 px-3 rounded-md font-bold text-[1.25rem] text-white pointer-events-none transition-colors duration-300
              ${balanceChangeDirection === 'up'
                ? 'bg-green-400'
                : balanceChangeDirection === 'down'
                ? 'bg-red-400'
                : '!bg-gray-600'}`}
            >
              ${animatedBalance.toFixed(2)}
            </button>
          </div>

          {/* Bet */}
          <div className="flex items-center min-w-[9.375rem] whitespace-nowrap">
            <p className="text-[1.5rem] font-bold mr-2">Bet:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[1.25rem] text-white bg-gray-600 pointer-events-none`}
            >
              ${totalBet.toFixed(2)}
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center min-w-[9.375rem] whitespace-nowrap">
            <p className="text-[1.5rem] font-bold mr-2">Time:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[1.25rem] text-white bg-gray-600 pointer-events-none`}
            >
              {timeLeft}
            </button>
          </div>

          {/* Spins */}
          <div className="flex items-center min-w-[6.25rem] whitespace-nowrap">
            <p className="text-[1.5rem] font-bold mr-2">Spins:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[1.25rem] text-white bg-gray-600 pointer-events-none `}
            >
              {remSpins}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
