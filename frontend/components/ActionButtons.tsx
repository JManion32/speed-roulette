import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { secureFetch } from "../utils/secureFetch";
import type { Bet, BetAction } from "../types/chips";

interface ActionButtonsProps {
  bets: Bet[];
  remSpins: number;
  isPaused: boolean;
  isSubmitting: boolean;
  gridBlock: boolean;
  timeLeft: number;
  userBalance: number;
  betActions: BetAction[];
  setIsPaused: (v: boolean) => void;
  setRemSpins: React.Dispatch<React.SetStateAction<number>>;
  setGridBlock: (v: boolean) => void;
  setShowModal: (v: boolean) => void;
  setWinningNumber: (v: string | null) => void;
  setUserBalance: (v: number) => void;
  resetTable: (v: number) => void;
  addResultNum: (v: string) => void;
  handleClearBets: () => void;
  handleUndoBet: () => void;
}

export default function ActionButtons({
  bets,
  remSpins,
  isPaused,
  isSubmitting,
  gridBlock,
  timeLeft,
  userBalance,
  betActions,
  setIsPaused,
  setRemSpins,
  setGridBlock,
  setShowModal,
  setWinningNumber,
  setUserBalance,
  resetTable,
  addResultNum,
  handleClearBets,
  handleUndoBet
}: ActionButtonsProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <>
      {/* Action buttons section */}
      <div className="flex gap-2 justify-center w-full mb-5">
        <button 
          className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 duration-200 hover:scale-105 shadow-md ${isDarkMode ? 'text-white bg-gray-600 hover:bg-gray-500' : 'text-black bg-gray-300 hover:bg-gray-350'}`}
          onClick={gridBlock ? undefined : handleClearBets}
          data-cy="clear-button"
        >
          Clear
        </button>

        <button 
          className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 duration-200 hover:scale-105 shadow-md ${isDarkMode ? 'text-white bg-gray-600 hover:bg-gray-500' : 'text-black bg-gray-300 hover:bg-gray-350'}`}
          onClick={gridBlock ? undefined : handleUndoBet}
          disabled={betActions.length === 0}
          data-cy="undo-button"
        >
          Undo
        </button>

        <button 
          className={`h-12 w-45 rounded-md font-bold text-[1.25rem] duration-200 shadow-md ${
            bets.length === 0 || remSpins === 0 || isPaused || isSubmitting
              ? `cursor-not-allowed ${isDarkMode ? 'bg-gray-600 text-gray-500' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`
              : `hover:scale-105 ${isDarkMode ? 'bg-green-500 hover:bg-green-400' : 'bg-green-250 hover:bg-green-350'}`
          }`}
          data-cy="submit-button"
          onClick={async () => {
            if (bets.length === 0 || remSpins === 0 || isPaused) return;

            setIsPaused(true);
            setRemSpins(prev => prev - 1);
            setGridBlock(true);

            try {
              const res = await secureFetch('/api/round', {
                method: "POST",
                body: JSON.stringify({ bets }),
              });

              const data = await res.json();
              const result = data.number;
              const payout = data.payout;

              const newBalance: number = userBalance + payout;
              const displayResult = result === 37 ? "00" : result.toString();
              setWinningNumber(displayResult);

              setTimeout(() => {
                if (remSpins === 1 || timeLeft === 0 || newBalance === 0) {
                  setShowModal(true);
                  setWinningNumber(null);
                  setUserBalance(newBalance);
                  return;
                }
                resetTable(newBalance);
                addResultNum(displayResult);
                setWinningNumber("");
                setIsPaused(false);
                setGridBlock(false);
                setUserBalance(newBalance);
              }, 2500);
            } catch (error) {
              console.error("Round error:", error);
            }
          }}
        >
          Submit Bets
        </button>
      </div>
    </>
  );
}
