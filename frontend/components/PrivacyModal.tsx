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
      className="modal-overlay fixed inset-0 z-50 bg-gray-900/80 flex justify-center items-center"
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`
          relative rounded-3xl w-[50rem] max-w-[90%] max-h-[90vh] p-8 overflow-y-auto
          ${isDarkMode
            ? "bg-gray-800 text-white"
            : "bg-light-mode text-black"
          } 
          ${isClosing ? "slide-down" : "slide-up"}
        `}
      >
        <button
          className="absolute right-4 top-4 bg-red-600 hover:bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
          onClick={closeModal}
          aria-label="Close Privacy Policy"
        >
          X
        </button>

        <h1 className="text-[2rem] font-bold mb-6 text-center">PRIVACY POLICY</h1>

        <div className="mx-auto w-[90%] max-w-[40rem] text-[1.125rem] space-y-6 leading-relaxed">
          <div>
            <h2 className="font-bold mb-1">1. No Personal Information Collected</h2>
            <p>
              Speed Roulette does not collect any personally identifiable information (PII) such as your name, email address, IP address, or payment details.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-1">2. Nicknames and Leaderboard</h2>
            <p>
              For leaderboard purposes, a nickname you enter is temporarily stored and associated with your in-game performance. This nickname is not connected to any external identity.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-1">3. Cookies & Session Data</h2>
            <p>
              Temporary cookies or session data may be stored strictly for gameplay functionality (e.g., authentication, token validation, and game state tracking). This data is never used for analytics or marketing.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-1">4. No Third-Party Sharing</h2>
            <p>
              Speed Roulette does not share, sell, or transfer any user data to third parties. The game is intended solely for entertainment, learning, and portfolio demonstration.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-1">5. Acceptance of Policy</h2>
            <p>
              By playing Speed Roulette, you agree to the terms of this privacy policy. If you have any concerns, please email <a href="mailto:jman32@speedroulette.io" className="text-blue-500 hover:underline">jman32@speedroulette.io</a>.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Last updated: 2025-07-02
        </div>
      </div>
    </div>
  );
}
