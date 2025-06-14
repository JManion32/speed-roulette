// frontend/pages/game.tsx
import '../css/index.css'
import '../css/game.css'
import { useState, useEffect } from 'react';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import BettingChips from '../components/BettingChips';
import DarkModeToggle from "../components/DarkModeToggle";
import GameStatsBar from "../components/GameStatsBar";
import HomeButton from "../components/HomeButton";
import ResultModal from "../components/ResultModal";
import RouletteBoard from '../components/RouletteBoard';

// Hooks
import { useAnimatedBalance } from '../hooks/useAnimatedBalance';
import { useTimer, useRemSpins } from '../hooks/useGameFlow';
import { useResultModal } from '../hooks/useResultModal';
import { useResultNums } from '../hooks/useResultNums';
import { useBetting } from '../hooks/useBetting';

// Types
import type { Chip, Bet, BetAction } from '../types/chips';

// Utils
import { getColorClass } from '../utils/recentNumColor';
import { updateChipColor, formatBetValue } from '../utils/chipFormatting';

function Game() {
  const { isDarkMode } = useDarkMode();

  // Nickname state
  const [nickname, setNickname] = useState<string>("");
  useEffect(() => {
      setNickname(localStorage.getItem("nickname") ?? "");
  }, []);

  const { timeLeft, isPaused, setTimeLeft, setIsPaused } = useTimer(
      () => {
          handleClearBets();
          setShowModal(true);
      }
  );

  const { remSpins, setRemSpins } = useRemSpins();

  const { showModal, setShowModal, isClosing, closeModal } = useResultModal();

  const { winningNumber, setWinningNumber, isWinning,
        resultNums, setResultNums, addResultNum } = useResultNums();

  //Grid Stuff
  const [showGrid, setShowGrid] = useState(false);   // grid visibility
  const [gridBlock, setGridBlock] = useState(false);   // grid interactability

  const [isSelected, setIsSelected] = useState(false);

  const {
      selectedChip, setSelectedChip,
      bets, betActions,
      userBalance, totalBet,
      handleChipSelect, handleGridCellClick, handleUndoBet,
      hasBet, getBet,
      setUserBalance, setTotalBet, setBets, setBetActions,
  } = useBetting({ setIsPaused });

  const { animatedBalance, balanceChangeDirection } = useAnimatedBalance(userBalance);

  const [isSubmitting, setIsSubmitting] = useState(false);

    // Clear all bets
  const handleClearBets = () => {
      setBets([]);
      setBetActions([]);
      setUserBalance(prev => prev + totalBet);
      setTotalBet(0);
  };

  // In between rounds of a match
  const resetTable = () => {
      setTotalBet(0);
      setBetActions([]);
      setIsSubmitting(true);
      setTimeout(() => {
          setBets([]);
          setIsSubmitting(false);
      }, 50);
  };

  // When the user selects "Play Again"
  const newGame = () => {
      setBets([]);
      setBetActions([]);
      setUserBalance(20);
      setTotalBet(0);
      setRemSpins(10);
      setTimeLeft(60);
      setResultNums([]);
      setWinningNumber(null);
      setGridBlock(false);
      setIsSelected(false);
      setSelectedChip(null);
  };

  // Render a chip component for the grid
  const renderChip = (bet: Bet) => (
    <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center
        justify-center text-white text-[20px] font-bold z-20"
        style={{ width: '40px', height: '40px', backgroundColor: bet.chipColor}}>
        {formatBetValue(bet.chipValue)}
    </div>
  );

  return (
    <div className={`h-screen transition duration-200 select-none ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/*Header: Light/Dark Mode Toggle*/}
      <div className="p-4 flex top-0">
        <p className={`absolute top-7 left-8 font-bold text-[24px] ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {nickname}
        </p>
        <span className="absolute top-7 right-44 flex flex-row">
          {[...Array(9)].map((_, i) => {
            const result = resultNums[i];
            return (
              <button
                key={i}
                className={`h-10 w-10 ml-2 rounded-md font-bold border-white border-2 transition duration-200 ${
                  result !== undefined 
                    ? getColorClass(result) 
                    : (isDarkMode ? 'bg-gray-700' : 'bg-gray-300')
                }`}
              >
                {result ?? ''}
              </button>
            );
          })}
        </span>
        <DarkModeToggle />
        <HomeButton />
      </div>
      {/*Body: Everything*/}
      <div className="absolute top-2/17 w-full">
        {/* Main container with flex-col to stack elements vertically */}
        <div className="flex flex-col items-center gap-4">

        <GameStatsBar
          totalBet={totalBet}
          timeLeft={timeLeft}
          remSpins={remSpins}
          animatedBalance={animatedBalance}
          balanceChangeDirection={balanceChangeDirection}
        />

        <BettingChips
            selectedChip={selectedChip}
            userBalance={userBalance}
            isSelected={isSelected}
            handleChipSelect={handleChipSelect}
            setIsSelected={setIsSelected}
        />

            {/* Action buttons section */}
            <div className="flex gap-2 justify-center w-full mb-5">
              <button 
                className={`h-12 w-45 rounded-md font-bold text-[20px] mr-25 transition-transform transform hover:scale-105
                  ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={gridBlock ? undefined : handleClearBets}
              >
                Clear
              </button>
              <button 
                className={`h-12 w-45 rounded-md font-bold text-[20px] mr-25 transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={gridBlock ? undefined : handleUndoBet}
                disabled={betActions.length === 0}
              >
                Undo
              </button>
              <button 
                className={`h-12 w-45 rounded-md font-bold text-[20px] transition duration-200 ${
                  // Listener so user can only submit if they have a placed bet
                  bets.length === 0 || remSpins === 0 || isPaused || isSubmitting
                    ? isDarkMode ? 'bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : isDarkMode ? 'bg-green-500 hover:bg-green-400 transition-transform transform hover:scale-105' : 'bg-green-200 hover:bg-green-300 transition-transform transform hover:scale-105'
                }`}
                onClick={async () => {
                  if (bets.length === 0 || remSpins === 0 || isPaused) return;
                  
                  setIsPaused(true);
                  setRemSpins(prev => prev - 1);
                  setGridBlock(true);

                  let result: number = -1; // initialized to prevent use issues

                  // http request for the random number
                  try {
                    const res = await fetch('http://localhost:8080/api/spin');
                    const data = await res.json();

                    result = data.number;

                    const displayResult = result === 37 ? "00" : result.toString();
                    setWinningNumber(displayResult);
                  } catch (error) {
                    console.error("Spin error:", error);
                  }
                  
                  // http request for the payout
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
                    
                    // Delay next actions for 2.5 seconds
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
            <RouletteBoard
                isWinning={isWinning}
                remSpins={remSpins}
                gridBlock={gridBlock}
                showGrid={showGrid}
                handleGridCellClick={handleGridCellClick}
                hasBet={hasBet}
                getBet={getBet}
                renderChip={renderChip}
            />
          </div>
        </div>
      <ResultModal
          showModal={showModal}
          isClosing={isClosing}
          timeLeft={timeLeft}
          remSpins={remSpins}
          userBalance={userBalance}
          closeModal={closeModal}
          newGame={newGame}
      />
    </div>
  );
}
    
export default Game;