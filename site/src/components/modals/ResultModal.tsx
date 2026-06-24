import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogGame } from '../../hooks/useLogGame';
import { useLogout } from '../../hooks/useLogout';
import { usePlayAgain } from '../../hooks/usePlayAgain';
import '../../css/components/modal.css';

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
    const { rank, logGame } = useLogGame();
    const navigate = useNavigate();
    const nickname = localStorage.getItem('nickname');
    const playAgain = usePlayAgain();
    const logout = useLogout();

    useEffect(() => {
        if (showModal && nickname) {
            (async () => {
                if (userBalance > 0) {
                    await logGame(nickname, userBalance, remSpins, timeLeft);
                }
                await logout();
            })();
        }
    }, [showModal]);

    if (!showModal) return null;

    // Instantly restart with an outside click
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
            if (!nickname) {
                alert('Nickname missing. Please reload the page.');
                return;
            }

            const token = playAgain(nickname);
            if (!token) {
                alert('Could not start new game. Try refreshing the page.');
                return;
            }

            closeModal();
            newGame();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOutsideClick}>
            <div className={`result-modal ${isClosing ? 'slide-down' : 'slide-up'}`}>
                <div className="result-modal-content">
                    <h1 className="result-modal-title">ROUND FINISHED!</h1>

                    <div className="result-modal-stats-container">
                        <p className="result-modal-label">Final Balance:</p>

                        <button className="result-modal-value" data-cy="result-balance">
                            $
                            {userBalance.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </button>

                        <p className="result-modal-label">Time Remaining:</p>

                        <button className="result-modal-value" data-cy="result-time">
                            {timeLeft}s
                        </button>

                        <p className="result-modal-label">Spins Remaining:</p>

                        <button className="result-modal-value" data-cy="result-spins">
                            {remSpins}
                        </button>
                    </div>

                    <hr className="result-modal-divider result-modal-divider-top" />

                    <div className="result-modal-rank-container">
                        <p className="result-modal-rank-label">Daily Rank:</p>

                        <button className="result-modal-rank-value" data-cy="user-rank">
                            {userBalance > 0 && rank !== null ? `#${rank}` : 'Unranked'}
                        </button>
                    </div>

                    <hr className="result-modal-divider result-modal-divider-bottom" />

                    <div className="result-modal-actions">
                        <button
                            className="game-primary-button result-modal-play-again"
                            data-cy="result-play-again"
                            onClick={async () => {
                                if (!nickname) {
                                    alert('Nickname missing. Please reload the page.');
                                    return;
                                }

                                const token = await playAgain(nickname);

                                if (!token) {
                                    alert('Could not start new game. Try refreshing the page.');
                                    return;
                                }

                                closeModal();
                                newGame();
                            }}
                        >
                            Play Again
                        </button>

                        <button
                            className="game-secondary-button"
                            onClick={() => {
                                localStorage.removeItem('nickname');
                                navigate('/');
                            }}
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>

            <p className="result-modal-hint">Click anywhere to play again!</p>
        </div>
    );
}
