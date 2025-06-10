// frontend/pages/game.tsx
import '../css/index.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Components
import DarkModeToggle from "../components/DarkModeToggle";
import HomeButton from "../components/HomeButton";

// Define chip types
interface Chip {
  value: number;
  color: string;
}

// Define Bet
interface Bet {
  gridIndex: number;
  gridId: string;
  chipValue: number;
  chipColor: string;
}

// Track each individual bet action for better undo functionality
interface BetAction {
  gridIndex: number;
  gridId: string;
  chipValue: number;
}

function Game() {
  const { isDarkMode } = useDarkMode();

  // Nickname state, uses local storage
  const [nickname, setNickname] = useState<string>("");
  useEffect(() => {
    setNickname(localStorage.getItem("nickname") ?? "");
  }, []);
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState<number>(60); // Start timer at 60 seconds
  const [isPaused, setIsPaused] = useState<boolean>(true);
  useEffect(() => {
    if (timeLeft <= 0) {
      handleClearBets();
      setShowModal(true);
      return;
    }
    if (isPaused) {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);
  

  // states
  const [showModal, setShowModal] = useState(false); // State of the modal (start off closed, toggled by utility button)
  const [isClosing, setIsClosing] = useState(false);
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300); // match slide-down duration
  };
  const [showGrid, setShowGrid] = useState(false);   // grid visibility
  const [gridBlock, setGridBlock] = useState(false);   // grid interactability

  // States for
  const [isSelected, setIsSelected] = useState(false);   // grid interactability
  
  // Chip selection and bet tracking state
  const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betActions, setBetActions] = useState<BetAction[]>([]);
  const [userBalance, setUserBalance] = useState<number>(20);
  
  const [animatedBalance, setAnimatedBalance] = useState<number>(20);
  const [balanceChangeDirection, setBalanceChangeDirection] = useState<'up' | 'down' | null>(null);
  useEffect(() => {
    const duration = 750;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;

    let frame = 0;
    const start = animatedBalance;
    const end = userBalance;
    const diff = end - start;

    // Set direction right away before animation starts
    if (diff > 0) {
      setBalanceChangeDirection('up');
    } else if (diff < 0) {
      setBalanceChangeDirection('down');
    } else {
      setBalanceChangeDirection(null);
    }

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = progress < 1 ? progress : 1;

      setAnimatedBalance(start + diff * easedProgress);

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedBalance(end);
        setBalanceChangeDirection(null); // Reset highlight after animation ends
      }
    };

    requestAnimationFrame(animate);
  }, [userBalance]);

  const [totalBet, setTotalBet] = useState<number>(0);

  const [remSpins, setRemSpins] = useState<number>(10); // make sure modal comes up after rem spins = 0
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  const isWinning = (num: string) => winningNumber === num;

  type ResultNum = string;

  const [resultNums, setResultNums] = useState<ResultNum[]>([]);

  const addResultNum = (num: ResultNum) => {
    setResultNums(prev => {
      const updated = [num, ...prev]; // newest result on the left
      return updated.slice(0, 9); // keep only the 9 most recent
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handling chip selection
  const handleChipSelect = (value: number, color: string) => {
    if(userBalance >= value) {
      setSelectedChip({ value, color });
    }
  };

  // Decides what color the betting chip should be based on amount
  const updateColor = (bet: number) => {
    if(bet >= 500) {
      return '#F97316'; // orange-500
    }
    else if(bet >= 100) {
      return '#EAB308'; // yellow-500
    }
    else if(bet >= 50) {
      return '#10B981'; // emerald-500
    }
    else if(bet >= 20) {
      return '#06B6D4'; // cyan-500
    }
    else if(bet >= 10) {
      return '#EC4899'; // pink-500
    }
    else if(bet >= 5) {
      return '#A855F7'; // purple-500
    }
    else if(bet >= 2) {
      return '#3B82F6'; // blue-500
    }
    else if(bet >= 1) {
      return '#6366F1'; // indigo-500
    }
    else {
      return '#6B7280'; // gray-500
    }
  };

const formatBetValue = (value: number): string => {
  if (value >= 100000) return `${Math.floor(value / 1000)}k`;

  if (value >= 1000) {
    const valueInK = value / 1000;
    return valueInK % 1 < 0.1 ? `${Math.floor(valueInK)}k` : `${valueInK.toFixed(1)}k`;
  }

  return value % 1 === 0 ? value.toString() : value.toFixed(1).replace(/^0+/, '');
};

  // Handling grid cell clicks
  const handleGridCellClick = (index: number, gridId: string) => {
    if (!selectedChip || userBalance < selectedChip.value) return; // No chip selected, no action taken
    
    setIsPaused(false); // only for first round

    // Record this bet action for undo functionality
    setBetActions(prev => [...prev, {
      gridIndex: index,
      gridId,
      chipValue: selectedChip.value
    }]);

    setTotalBet(prev => prev + selectedChip.value);
    setUserBalance(prev => prev - selectedChip.value);
    
    // Check if there's already a bet at this position
    const existingBetIndex = bets.findIndex(bet => 
      bet.gridIndex === index && bet.gridId === gridId
    );
    
    if (existingBetIndex === -1) {
      // No existing bet, add a new one
      setBets(prevBets => [
        ...prevBets,
        {
          gridIndex: index,
          gridId,
          chipValue: selectedChip.value,
          chipColor: selectedChip.color
        }
      ]);
    } else {
      // Update existing bet
      setBets(prevBets => {
        const newBets = [...prevBets];
        const updatedBet = { ...newBets[existingBetIndex] }; // Create a copy to avoid direct mutation
        
        // Add to existing bet value
        updatedBet.chipValue += selectedChip.value;
        
        // Update color based on new total
        updatedBet.chipColor = updateColor(updatedBet.chipValue);
        
        // Replace the old bet with the updated one
        newBets[existingBetIndex] = updatedBet;
        
        return newBets;
      });
    }
  };

  // Clear all bets
  const handleClearBets = () => {
    setBets([]);
    setBetActions([]);
    setUserBalance(prev => prev + totalBet);
    setTotalBet(0);
  };

  // Undo last bet action
  const handleUndoBet = () => {
    if (betActions.length === 0) {
      return;
    }
    
    // Get the last bet action
    const lastAction = betActions[betActions.length - 1];
    
    // Remove that action from the history
    setBetActions(prev => {
      const newActions = prev.slice(0, -1);
      return newActions;
    });
    
    // Update total bet amount
    setUserBalance(prev => {
      const newBalance = prev + lastAction.chipValue;
      return newBalance;
    });

    // Update total bet amount
    setTotalBet(prev => {
      const newTotal = prev - lastAction.chipValue;
      return newTotal;
    });
    
    // Find the bet to update
    const betIndex = bets.findIndex(bet => 
      bet.gridIndex === lastAction.gridIndex && bet.gridId === lastAction.gridId
    );
    
    if (betIndex !== -1) {
      setBets(prevBets => {
        // Create a copy of the bets array
        const newBets = [...prevBets];
        
        // Get the specific bet to update (but don't mutate it yet)
        const bet = {...newBets[betIndex]};
        const oldValue = bet.chipValue;
        
        // Subtract the chip value
        bet.chipValue -= lastAction.chipValue;
        console.log(`Bet value updated: ${oldValue} -> ${bet.chipValue}`);
        
        // If the bet value is now zero or less, remove it
        if (bet.chipValue <= 0) {
          console.log("Removing bet entirely");
          return newBets.filter((_, i) => i !== betIndex);
        }
        
        // Otherwise update the color and replace the bet
        bet.chipColor = updateColor(bet.chipValue);
        newBets[betIndex] = bet;
        
        return newBets;
      });
    }
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

  // Helper function to check if a cell has a bet
  const hasBet = (index: number, gridId: string) => {
    return bets.some(bet => bet.gridIndex === index && bet.gridId === gridId);
  };

  // Helper to get bet for a cell
  const getBet = (index: number, gridId: string) => {
    return bets.find(bet => bet.gridIndex === index && bet.gridId === gridId);
  };

  async function makeFinalCall() {
    const res = await fetch("/api/finish_game", {
      method: "POST",
      body: JSON.stringify({
        nickname: "jmancodes",
        finalBalance: userBalance,
        turnsUsed: 10,
        timeUsed: 60,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Your rank:", data.rank);
  }


// END OF LOGIC, START OF DISPLAY =============================================================

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
                className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                ${totalBet.toFixed(2)}
              </button>
            </div>

            {/* Timer */}
            <div className="flex items-center min-w-[150px] whitespace-nowrap">
              <p className="text-[24px] font-bold mr-2">Time:</p>
              <button 
                className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                {timeLeft}
              </button>
            </div>

            {/* Spins */}
            <div className="flex items-center min-w-[100px] whitespace-nowrap">
              <p className="text-[24px] font-bold mr-2">Spins:</p>
              <button 
                className={`h-10 px-3 rounded-md font-bold text-[20px] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
              >
                {remSpins}
              </button>
            </div>
          </div>
        </div>

            {/* Controls section */}
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {/* Chip buttons */}
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === .50 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 0.5 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < .5 ?  'bg-gray-900 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-400 border-gray-400'}`}
                onClick={() => {
                  handleChipSelect(.50, '#6B7280');
                  setIsSelected(true);
                }}
              >
                .50
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 1 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 1 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 1 ?  'bg-gray-900 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-400 border-indigo-400'}`}
                onClick={() => {
                  handleChipSelect(1, '#6366F1');
                  setIsSelected(true);
                }}
              >
                1
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 2 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 2 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 2 ?  'bg-gray-900 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-400 border-blue-400'}`}
                onClick={() => {
                  handleChipSelect(2, '#3B82F6');
                  setIsSelected(true);
              ``}}
              >
                2
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 5 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 5 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 5 ?  'bg-gray-900 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-400 border-purple-400'}`}
                onClick={() => {
                  handleChipSelect(5, '#A855F7')
                  setIsSelected(true);
                }}
              >
                5
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 10 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 10 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 10 ?  'bg-gray-900 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-400 border-pink-400'}`}
                onClick={() => {
                  handleChipSelect(10, '#EC4899')
                  setIsSelected(true);
                }}
              >
                10
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 20 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 20 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 20 ?  'bg-gray-900 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 border-cyan-400'}`}
                onClick={() => {
                  handleChipSelect(20, '#06B6D4')
                  setIsSelected(true);
                }}
              >
                20
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 50 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 50 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 50 ?  'bg-gray-900 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400'}`}
                onClick={() => {
                  handleChipSelect(50, '#10B981')
                  setIsSelected(true);
                }}
              >
                50
              </button>
              <button 
                className={`chip-button mr-2
                  ${selectedChip?.value === 100 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 100 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 100 ?  'bg-gray-900 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 border-yellow-400'}`}
                onClick={() => {
                  handleChipSelect(100, '#EAB308')
                  setIsSelected(true);
                }}
              >
                100
              </button>
              <button 
                className={`chip-button
                  ${selectedChip?.value === 500 ?  isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500' : ''}
                  ${!isSelected && userBalance >= 500 ? isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light' : ''}
                  ${userBalance < 500 ?  'bg-gray-900 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-400 border-orange-400'}`}
                onClick={() => {
                  handleChipSelect(500, '#F97316')
                  setIsSelected(true);
                }}
              >
                500
              </button>
            </div>

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

                    console.log("The result here is: ", result)

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
                    console.log("Payout:", payoutData.payout);
                    const newBalance = userBalance + payoutData.payout;

                    console.log("Remaining Spins:", remSpins);
                    console.log("Time left:", timeLeft);
                    console.log("User balance:", userBalance);
                    
                    // Delay next actions for 2.5 seconds
                    setTimeout(() => {
                      if (remSpins === 1 || timeLeft === 0 || newBalance === 0) {
                        //makeFinalCall();
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
                          <button className={`green-num bg-green w-full h-1/2 transition duration-500 text-white ${isWinning("0") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>0</button>
                          <button className={`green-num bg-green w-full h-1/2 transition duration-500 text-white ${isWinning("00") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>00</button>
                      </div>
                      </td>
                      <td><button className={`roulette-num bg-red  transition duration-500 text-white ${isWinning("3") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>3</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("6") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>6</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("9") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>9</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("12") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>12</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("15") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>15</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("18") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>18</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("21") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>21</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("24") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>24</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("27") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>27</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("30") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>30</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("33") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>33</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("36") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>36</button></td>
                      <td><button className="roulette-num bg-green text-white">Row</button></td>
                  </tr>
                  <tr>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("2") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>2</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("5") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>5</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("8") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>8</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("11") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>11</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("14") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>14</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("17") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>17</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("20") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>20</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("23") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>23</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("26") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>26</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("29") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>29</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("32") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>32</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("35") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>35</button></td>
                      <td><button className="roulette-num bg-green text-white">Row</button></td>
                  </tr>
                  <tr>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("1") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>1</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("4") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>4</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("7") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>7</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("10") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>10</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("13") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>13</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("16") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>16</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("19") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>19</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("22") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>22</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("25") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>25</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("28") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>28</button></td>
                      <td><button className={`roulette-num bg-black transition duration-500 text-white ${isWinning("31") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>31</button></td>
                      <td><button className={`roulette-num bg-red transition duration-500 text-white ${isWinning("34") ? 'bg-winning transition duration-500 glow-effect' : ''}`}>34</button></td>
                      <td><button className="roulette-num bg-green text-white">Row</button></td>
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



      {/* ======================= Result Modal =============================*/}
      {showModal && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80">
          <div className={` 
            ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
            rounded-3xl p-8 w-[700px] h-[600px] max-w-[90%] relative flex flex-col items-center 
            ${isClosing ? 'slide-down' : 'slide-up'}
          `}>
            <div className="flex flex-col items-center">
              <h1 className="text-[68px] text-yellow-500 font-bold flex justify-center mb-8">ROUND FINISHED!</h1>
              <div className="grid grid-cols-[200px_1fr] gap-x-24 gap-y-6 mb-5">
                <p className="text-[24px] font-bold">Time Remaining:</p>
                <button className={`h-10 w-45 rounded-md font-bold text-[20px] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  {timeLeft}
                </button>

                <p className="text-[24px] font-bold">Spins Remaining:</p>
                <button className={`h-10 w-45 rounded-md font-bold text-[20px] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  {remSpins}
                </button>

                <p className="text-[24px] font-bold">Final Balance:</p>
                <button className={`h-10 w-45 rounded-md font-bold text-[20px] pointer-events-none ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  ${userBalance.toFixed(2)}
                </button>

                <p className="text-[30px] font-bold mt-6">Rank (Today):</p>
                <button className={`h-12 w-45 rounded-md font-bold text-[28px] mt-6 pointer-events-none text-yellow-500 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  N/A
                </button>
              </div>


              <div className="flex flex-row items-center mt-12">
                <button
                  className={`h-12 w-45 rounded-md font-bold text-[20px] mr-25 ${
                    isDarkMode ? 'bg-green-500 hover:bg-green-400 transition-transform transform hover:scale-105' : 'bg-green-200 hover:bg-green-300 transition-transform transform hover:scale-105'
                  }`}
                  onClick={() => {
                    closeModal();
                    newGame();
                  }}
                >
                  Play Again
                </button>

                <Link to="/" className="inline-block">
                  <button className={`h-12 w-45 rounded-md font-bold text-[20px] transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
    
export default Game;

const isRed = new Set([
  "1", "3", "5", "7", "9", "12", "14", "16", "18", 
  "19", "21", "23", "25", "27", "30", "32", "34", "36"
]);

const isBlack = new Set([
  "2", "4", "6", "8", "10", "11", "13", "15", "17", 
  "20", "22", "24", "26", "28", "29", "31", "33", "35"
]);

const getColorClass = (num: string) => {
  if (num === "0" || num === "00") return "bg-green text-white";
  if (isRed.has(num)) return "bg-red text-white";
  if (isBlack.has(num)) return "bg-black text-white";
  return "bg-gray-400"; // fallback for unexpected inputs
};
