import { useDarkMode } from "../contexts/DarkModeContext";
import { useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PrivacyModal({ isOpen, onClose }: ModalProps) {
  const { isDarkMode } = useDarkMode();
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80"
      onClick={handleOutsideClick}
    >
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-light-mode"
        } rounded-3xl p-8 w-[50rem] h-[34.375rem] max-w-[90%] relative ${
          isClosing ? "slide-down" : "slide-up"
        }`}
      >
        <button
          className="absolute right-4 top-4 bg-red-600 hover:bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
          onClick={closeModal}
        >
          X
        </button>

        <h1 className="text-[2rem] font-bold mb-6 text-center">Privacy Policy</h1>

        <div className="max-h-[28rem] overflow-y-auto text-[1.125rem] space-y-4">
          <p>
            Speed Roulette does not collect any personally identifiable information (PII) such as your name, email address, or payment details.
          </p>
          <p>
            For leaderboard purposes, a nickname is temporarily stored and associated with your in-game performance. This data is not linked to any external account or identity.
          </p>
          <p>
            This site may store temporary cookies or session data strictly for gameplay functionality (e.g., token validation, game state tracking). None of this data is used for tracking, marketing, or analytics.
          </p>
          <p>
            We do not share, sell, or transfer any user data to third parties. This game is built for entertainment, learning, and portfolio demonstration purposes only.
          </p>
          <p>
            By playing Speed Roulette, you agree to this policy. If you have concerns, please feel free to reach out to <a href="mailto:jman32@speedroulette.io" className="text-blue-500 hover:underline">jman32@speedroulette.io</a>.
          </p>

            {/* Modal Footer */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 text-center">
                Last updated: June 29, 2025
            </div>
        </div>
      </div>
    </div>
  );
}
