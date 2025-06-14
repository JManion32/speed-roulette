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

            {/* Main roulette table with grid overlay */}
            <div className="relative">
              <table className="border-collapse">
                  <tbody>
                  {/* Zero row that spans 3 rows */}
                  <tr>
                      <td rowSpan={3} className="p-0 border-0">
                      <div className="flex flex-col h-full">
                          <button className={`green-num ${isWinning("0") ? 'winning-glow-effect' : ''}`}>0</button>
                          <button className={`green-num ${isWinning("00") ? 'winning-glow-effect' : ''}`}>00</button>
                      </div>
                      </td>
                      <td><button className={`red-num ${isWinning("3") ? 'winning-glow-effect' : ''}`}>3</button></td>
                      <td><button className={`black-num ${isWinning("6") ? 'winning-glow-effect' : ''}`}>6</button></td>
                      <td><button className={`red-num ${isWinning("9") ? 'winning-glow-effect' : ''}`}>9</button></td>
                      <td><button className={`red-num ${isWinning("12") ? 'winning-glow-effect' : ''}`}>12</button></td>
                      <td><button className={`black-num ${isWinning("15") ? 'winning-glow-effect' : ''}`}>15</button></td>
                      <td><button className={`red-num ${isWinning("18") ? 'winning-glow-effect' : ''}`}>18</button></td>
                      <td><button className={`red-num ${isWinning("21") ? 'winning-glow-effect' : ''}`}>21</button></td>
                      <td><button className={`black-num ${isWinning("24") ? 'winning-glow-effect' : ''}`}>24</button></td>
                      <td><button className={`red-num ${isWinning("27") ? 'winning-glow-effect' : ''}`}>27</button></td>
                      <td><button className={`red-num ${isWinning("30") ? 'winning-glow-effect' : ''}`}>30</button></td>
                      <td><button className={`black-num ${isWinning("33") ? 'winning-glow-effect' : ''}`}>33</button></td>
                      <td><button className={`red-num ${isWinning("36") ? 'winning-glow-effect' : ''}`}>36</button></td>
                      <td><button className="outside-row">Row</button></td>
                  </tr>
                  <tr>
                      <td><button className={`black-num ${isWinning("2") ? 'winning-glow-effect' : ''}`}>2</button></td>
                      <td><button className={`red-num ${isWinning("5") ? 'winning-glow-effect' : ''}`}>5</button></td>
                      <td><button className={`black-num ${isWinning("8") ? 'winning-glow-effect' : ''}`}>8</button></td>
                      <td><button className={`black-num ${isWinning("11") ? 'winning-glow-effect' : ''}`}>11</button></td>
                      <td><button className={`red-num ${isWinning("14") ? 'winning-glow-effect' : ''}`}>14</button></td>
                      <td><button className={`black-num ${isWinning("17") ? 'winning-glow-effect' : ''}`}>17</button></td>
                      <td><button className={`black-num ${isWinning("20") ? 'winning-glow-effect' : ''}`}>20</button></td>
                      <td><button className={`red-num ${isWinning("23") ? 'winning-glow-effect' : ''}`}>23</button></td>
                      <td><button className={`black-num ${isWinning("26") ? 'winning-glow-effect' : ''}`}>26</button></td>
                      <td><button className={`black-num ${isWinning("29") ? 'winning-glow-effect' : ''}`}>29</button></td>
                      <td><button className={`red-num ${isWinning("32") ? 'winning-glow-effect' : ''}`}>32</button></td>
                      <td><button className={`black-num ${isWinning("35") ? 'winning-glow-effect' : ''}`}>35</button></td>
                      <td><button className="outside-row">Row</button></td>
                  </tr>
                  <tr>
                      <td><button className={`red-num ${isWinning("1") ? 'winning-glow-effect' : ''}`}>1</button></td>
                      <td><button className={`black-num ${isWinning("4") ? 'winning-glow-effect' : ''}`}>4</button></td>
                      <td><button className={`red-num ${isWinning("7") ? 'winning-glow-effect' : ''}`}>7</button></td>
                      <td><button className={`black-num ${isWinning("10") ? 'winning-glow-effect' : ''}`}>10</button></td>
                      <td><button className={`black-num ${isWinning("13") ? 'winning-glow-effect' : ''}`}>13</button></td>
                      <td><button className={`red-num ${isWinning("16") ? 'winning-glow-effect' : ''}`}>16</button></td>
                      <td><button className={`red-num ${isWinning("19") ? 'winning-glow-effect' : ''}`}>19</button></td>
                      <td><button className={`black-num ${isWinning("22") ? 'winning-glow-effect' : ''}`}>22</button></td>
                      <td><button className={`red-num ${isWinning("25") ? 'winning-glow-effect' : ''}`}>25</button></td>
                      <td><button className={`black-num ${isWinning("28") ? 'winning-glow-effect' : ''}`}>28</button></td>
                      <td><button className={`black-num ${isWinning("31") ? 'winning-glow-effect' : ''}`}>31</button></td>
                      <td><button className={`red-num ${isWinning("34") ? 'winning-glow-effect' : ''}`}>34</button></td>
                      <td><button className="outside-row">Row</button></td>
                  </tr>
                  
                  {/* Dozen bets */}
                  <tr>
                      <td className="p-0 border-0"></td>
                      <td colSpan={4}><button className="button-third">1-12</button></td>
                      <td colSpan={4}><button className="button-third">13-24</button></td>
                      <td colSpan={4}><button className="button-third">25-36</button></td>
                      <td className="p-0 border-0"></td>
                  </tr>
                  
                  {/* Outside bets */}
                  <tr>
                      <td className="p-0 border-0"></td>
                      <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">1-18</button></td>
                      <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">EVEN</button></td>
                      <td colSpan={2} className="p-0 border-0"><button className="button-bottom-red">RED</button></td>
                      <td colSpan={2} className="p-0 border-0"><button className="button-bottom-black">BLACK</button></td>
                      <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">ODD</button></td>
                      <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">19-36</button></td>
                      <td></td>
                  </tr>
                  </tbody>
              </table>
              
              {/* ALL GRIDS FOR BET PLACEMENT */}
              {/* All inner bets + Streets / Avenues / Basket */}
              <div 
                className="absolute top-0"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '66px repeat(10, 20px 66px) 20px 77px',
                  gridTemplateRows: '75px 20px 66px 20px 66px 20px',
                  gap: '0px',
                  zIndex: 1,
                  left: '95px'
                }}
              >
                {Array(23 * 6).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'inner')}
                    className="board-grid relative"
                    style={{ 
                      border: showGrid ? '1px solid red' : 'none',
                      backgroundColor: showGrid ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
                    }}
                  >
                    {showGrid && index}
                    {hasBet(index, 'inner') && renderChip(getBet(index, 'inner')!)}
                  </div>
                ))}
              </div>

              {/*Zeros (Number and Split)*/}
              <div 
                className="absolute top-0 left-0"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '20px',
                  gridTemplateRows: '75px 20px 24px 20px 24px 20px 65px 19px',
                  gap: '0px',
                  left: '75px',
                  zIndex: 2
                }}
              >
                {Array(1 * 8).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'zeros-split')}
                    className="board-grid relative"
                    style={{ 
                      border: showGrid ? '1px solid orange' : 'none',
                      backgroundColor: showGrid ? 'rgba(225, 232, 25, 0)' : 'transparent',
                    }}
                  >
                    {showGrid && index}
                    {hasBet(index, 'zeros-split') && renderChip(getBet(index, 'zeros-split')!)}
                  </div>
                ))}
              </div>

              {/*Zeros and Numbers Split Bet*/}
              <div 
                className="absolute top-0"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '75px',
                  gridTemplateRows: '119px 20px 119px',
                  gap: '0px',
                }}
              >
                {Array(1 * 3).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'zeros')}
                    className="board-grid relative"
                    style={{ 
                      border: showGrid ? '1px solid yellow' : 'none',
                      backgroundColor: showGrid ? 'rgba(25, 83, 232, 0)' : 'transparent',
                    }}
                  >
                    {showGrid && index}
                    {hasBet(index, 'zeros') && renderChip(getBet(index, 'zeros')!)}
                  </div>
                ))}
              </div>

              {/*Dozen Bets*/}
              <div 
                className="absolute"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '344px 344px 344px',
                  gridTemplateRows: '65px',
                  gap: '0px',
                  left: '86px',
                  top: '258px'
                }}
              >
                {Array(3 * 1).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'dozens')}
                    className="board-grid relative"
                    style={{ 
                      border: showGrid ? '1px solid green' : 'none',
                      backgroundColor: showGrid ? 'rgba(199, 128, 6, 0)' : 'transparent',
                    }}
                  >
                    {showGrid && index}
                    {hasBet(index, 'dozens') && renderChip(getBet(index, 'dozens')!)}
                  </div>
                ))}
              </div>

              {/*Rows*/}
              <div 
                className="absolute top-0"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '86px',
                  gridTemplateRows: '86px 86px 86px',
                  gap: '0px',
                  left: '1118px'
                }}
              >
                {Array(1 * 3).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'rows')}
                    className="board-grid relative"
                    style={{ 
                      border: showGrid ? '1px solid blue' : 'none',
                      backgroundColor: showGrid ? 'rgba(104, 36, 230, 0)' : 'transparent',
                    }}
                  >
                    {showGrid && index}
                    {hasBet(index, 'rows') && renderChip(getBet(index, 'rows')!)}
                  </div>
                ))}
              </div>

              {/*Bottom 6 Outer*/}
              <div 
                className="absolute"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: 'repeat(6, 172px)',
                  gridTemplateRows: '65px',
                  gap: '0px',
                  left: '86px',
                  top: '323px'
                }}
              >
                {Array(6 * 1).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={() => handleGridCellClick(index, 'outer')}
                    className="board-grid relative"
                    style={{ 
                      border: showGrid ? '1px solid purple' : 'none',
                      backgroundColor: showGrid ? 'rgba(61, 47, 6, 0)' : 'transparent',
                    }}
                  >
                    {showGrid && index}
                    {hasBet(index, 'outer') && renderChip(getBet(index, 'outer')!)}
                  </div>
                ))}
              </div>
            </div>
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