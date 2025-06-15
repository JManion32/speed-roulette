import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

interface ActionButtonsProps {
  bets: any[];
  remSpins: number;
  isPaused: boolean;
  isSubmitting: boolean;
  gridBlock: boolean;
  timeLeft: number;
  userBalance: number;
  betActions: any[];
  setIsPaused: (v: boolean) => void;
  setRemSpins: React.Dispatch<React.SetStateAction<number>>;
  setGridBlock: (v: boolean) => void;
  setShowModal: (v: boolean) => void;
  setWinningNumber: (v: string | null) => void;
  setUserBalance: (v: number) => void;
  resetTable: () => void;
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
          className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 transition-transform transform hover:scale-105
            ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={gridBlock ? undefined : handleClearBets}
        >
          Clear
        </button>

        <button 
          className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={gridBlock ? undefined : handleUndoBet}
          disabled={betActions.length === 0}
        >
          Undo
        </button>

        <button 
          className={`h-12 w-45 rounded-md font-bold text-[1.25rem] transition duration-200 ${
            bets.length === 0 || remSpins === 0 || isPaused || isSubmitting
              ? isDarkMode ? 'bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : isDarkMode ? 'bg-green-500 hover:bg-green-400 transition-transform transform hover:scale-105' : 'bg-green-200 hover:bg-green-300 transition-transform transform hover:scale-105'
          }`}
          onClick={async () => {
            if (bets.length === 0 || remSpins === 0 || isPaused) return;
            
            setIsPaused(true);
            setRemSpins(prev => prev - 1);
            setGridBlock(true);

            let result: number = -1;

            try {
              const res = await fetch('http://localhost:8080/api/spin');
              const data = await res.json();
              result = data.number;
              const displayResult = result === 37 ? "00" : result.toString();
              setWinningNumber(displayResult);
            } catch (error) {
              console.error("Spin error:", error);
            }

            try {
              const payoutRes = await fetch("http://localhost:8080/api/payout", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  bets: bets,
                  result: result,
                }),
              });

              const payoutData = await payoutRes.json();
              const newBalance = userBalance + payoutData.payout;
              
              setTimeout(() => {
                if (remSpins === 1 || timeLeft === 0 || newBalance === 0) {
                  setShowModal(true);
                  setWinningNumber(null);
                  setUserBalance(newBalance);
                  return;
                }
                resetTable();
                const displayResult = result === 37 ? "00" : result.toString();
                addResultNum(displayResult);
                setWinningNumber("");
                setIsPaused(false);
                setGridBlock(false);
                setUserBalance(newBalance);
              }, 2500);
            } catch (error) {
              console.error("Payout error:", error);
            }
          }}
        >
          Submit Bets
        </button>
      </div>
    </>
  );
}
