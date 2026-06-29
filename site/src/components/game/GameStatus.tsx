interface GameStatusProps {
    totalBet: number;
    timeLeft: number;
    remSpins: number;
    animatedBalance: number;
    balanceChangeDirection: 'up' | 'down' | null;
}

export default function GameStatus({
    totalBet,
    timeLeft,
    remSpins,
    animatedBalance,
    balanceChangeDirection,
}: GameStatusProps) {
    return (
        <div className="game-status-container">
            {/* Balance */}
            <div className="game-stat-item game-stat-balance">
                <p className="game-stat-label">Balance:</p>

                <button
                    className={`game-stat-btn ${
                        balanceChangeDirection === 'up'
                            ? 'game-stat-positive'
                            : balanceChangeDirection === 'down'
                              ? 'game-stat-negative'
                              : ''
                    }`}
                    data-cy="balance-display"
                >
                    $
                    {animatedBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </button>
            </div>

            {/* Bet */}
            <div className="game-stat-item game-stat-bet">
                <p className="game-stat-label">Bet:</p>

                <button className="game-stat-btn" data-cy="bet-display">
                    $
                    {totalBet.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </button>
            </div>

            {/* Timer */}
            <div className="game-stat-item game-stat-basic">
                <p className="game-stat-label">Time:</p>

                <button className="game-stat-btn" data-cy="timer-display">
                    {timeLeft}
                </button>
            </div>

            {/* Spins */}
            <div className="game-stat-item game-stat-basic">
                <p className="game-stat-label">Spins:</p>

                <button className="game-stat-btn" data-cy="spins-display">
                    {remSpins}
                </button>
            </div>
        </div>
    );
}
