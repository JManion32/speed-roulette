import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useEffect, useState } from 'react';
import { secureFetch } from "../utils/secureFetch";

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

  const nickname = localStorage.getItem("nickname");

  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    if (!showModal) return;

    const nickname = localStorage.getItem("nickname");
    if (!nickname || userBalance <= 0) return;

    // prevent duplicate logging if re-renders happen
    let alreadyLogged = false;

    const logGame = async () => {
      if (alreadyLogged) return;
      alreadyLogged = true;

      try {
        const res = await secureFetch("/api/game", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nickname: nickname,
            final_balance: userBalance,
            spins_used: remSpins,
            time_used: timeLeft,
          }),
        });

        const rankRes = await secureFetch(`/api/rank?balance=${userBalance}`, {
          method: "GET",
        });

        const rankData = await rankRes.json();
        setRank(rankData.rank);
      } catch (err) {
        console.error("Failed to log game:", err);
      }
    };

    logGame();
  }, [showModal]);

   if (!showModal) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80">
      <div className={` 
        ${isDarkMode ? 'bg-gray-800' : 'bg-light-mode'} 
        rounded-3xl p-8 w-[43.75rem] h-[37.5rem] max-w-[90%] relative flex flex-col items-center 
        ${isClosing ? 'slide-down' : 'slide-up'}
      `}>
        <div className="flex flex-col items-center">
          <h1 className={`text-[4.25rem] font-bold flex justify-center mb-8 ${isDarkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>
            ROUND FINISHED!
          </h1>
          <div className="grid grid-cols-[12.5rem_1fr] gap-x-24 gap-y-6 mb-5">
            <p className="text-[1.5rem] font-bold">Time Remaining:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}>
              {timeLeft}
            </button>

            <p className="text-[1.5rem] font-bold">Spins Remaining:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}>
              {remSpins}
            </button>

            <p className="text-[1.5rem] font-bold">Final Balance:</p>
            <button className={`h-10 w-45 rounded-md font-bold text-[1.25rem] pointer-events-none ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black'}`}>
              ${userBalance.toFixed(2)}
            </button>

          <p className="text-[1.875rem] font-bold mt-6">Rank (Today):</p>
          <button className={`h-12 w-45 rounded-md font-bold text-[1.75rem] mt-6 pointer-events-none ${isDarkMode ? 'bg-gray-600 text-yellow-500' : 'bg-white text-yellow-700'}`}>
            {userBalance > 0 && rank !== null ? `#${rank}` : "N/A"}
          </button>
          </div>

          <div className="flex flex-row items-center mt-12">
            <button
              className={`h-12 w-45 rounded-md font-bold text-[1.25rem] mr-25 ${
                isDarkMode ? 'bg-green-500 hover:bg-green-400' : 'bg-green-300 hover:bg-green-400'} transition-transform transform hover:scale-105`}
              onClick={async () => {
                  const nickname = localStorage.getItem("nickname");

                  if (!nickname) {
                    alert("Nickname missing. Please reload the page.");
                    return;
                  }
                  try {
                    const res = await secureFetch("/api/register", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ nickname }),
                    });

                    const { token } = await res.json();
                    localStorage.setItem("token", token);
                  } catch (err) {
                    console.error("Error during re-registration:", err);
                    alert("Could not start new game. Try refreshing the page.");
                    return;
                  }
                  closeModal();
                  newGame();
                }}
            >
              Play Again
            </button>

            <Link to="/" className="inline-block">
              <button className={`h-12 w-45 rounded-md font-bold text-[1.25rem] transition-transform transform hover:scale-105 ${isDarkMode ? 'text-white bg-gray-600' : 'bg-white text-black hover:bg-gray-300'}`}>
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
