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
            <p className="transition duration-200 text-[1.5rem] font-bold mr-2">Balance:</p>
            <button
              className={`h-10 px-3 rounded-md font-bold text-[1.25rem] pointer-events-none transition duration-200
                ${balanceChangeDirection === 'up'
                  ? 'bg-green-400'
                  : balanceChangeDirection === 'down'
                  ? 'bg-red-400'
                  : isDarkMode
                  ? '!bg-gray-600'
                  : '!bg-white'}`}
              data-cy="balance-display"
            >
              ${animatedBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </button>
          </div>

          {/* Bet */}
          <div className="flex items-center min-w-[10rem] whitespace-nowrap">
            <p className="transition duration-200 text-[1.5rem] font-bold mr-2">Bet:</p>
            <button
              className={`transition duration-200 h-10 px-3 rounded-md font-bold text-[1.25rem] pointer-events-none ${
                isDarkMode ? 'bg-gray-600' : 'bg-white'}`}
              data-cy="bet-display"
            >
              ${totalBet.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center min-w-[9rem] whitespace-nowrap">
            <p className="transition duration-200 text-[1.5rem] font-bold mr-2">Time:</p>
            <button
              className={`transition duration-200 h-10 px-3 rounded-md font-bold text-[1.25rem] pointer-events-none ${
                isDarkMode ? 'bg-gray-600' : 'bg-white'}`}
              data-cy="timer-display">
              {timeLeft}
            </button>
          </div>

          {/* Spins */}
          <div className="flex items-center min-w-[8rem] whitespace-nowrap">
            <p className="transition duration-200 text-[1.5rem] font-bold mr-2">Spins:</p>
            <button
              className={`transition duration-200 h-10 px-3 rounded-md font-bold text-[1.25rem] pointer-events-none ${
                isDarkMode ? 'bg-gray-600' : 'bg-white'}`}
              data-cy="spins-display">
              {remSpins}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
