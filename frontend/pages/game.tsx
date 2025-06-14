// frontend/pages/game.tsx
import '../css/index.css'
import '../css/game.css'
import { useState, useEffect } from 'react';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import ActionButtons from '../components/ActionButtons';
import BettingChips from '../components/BettingChips';
import GameStatsBar from "../components/GameStatsBar";
import ResultHeader from "../components/ResultHeader";
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
      <ResultHeader
        nickname={nickname}
        resultNums={resultNums}
        isDarkMode={isDarkMode}
        getColorClass={getColorClass}
      />

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

        <ActionButtons
            bets={bets}
            remSpins={remSpins}
            isPaused={isPaused}
            isSubmitting={isSubmitting}
            gridBlock={gridBlock}
            timeLeft={timeLeft}
            userBalance={userBalance}
            betActions={betActions}
            setIsPaused={setIsPaused}
            setRemSpins={setRemSpins}
            setGridBlock={setGridBlock}
            setShowModal={setShowModal}
            setWinningNumber={setWinningNumber}
            setUserBalance={setUserBalance}
            resetTable={resetTable}
            addResultNum={addResultNum}
            handleClearBets={handleClearBets}
            handleUndoBet={handleUndoBet}
        />

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