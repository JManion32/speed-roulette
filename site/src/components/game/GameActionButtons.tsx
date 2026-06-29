import React from 'react';
import type { Bet, BetAction } from '../../types/chips';
import api from '../../api';

interface GameActionButtonsProps {
    bets: Bet[];
    remSpins: number;
    isPaused: boolean;
    isSubmitting: boolean;
    gridBlock: boolean;
    timeLeft: number;
    userBalance: number;
    betActions: BetAction[];
    setIsPaused: (v: boolean) => void;
    setRemSpins: React.Dispatch<React.SetStateAction<number>>;
    setGridBlock: (v: boolean) => void;
    gameOver: (n: number) => void;
    gameContinue: (n: number, s: string) => void;
    setWinningNumber: (v: string | null) => void;
    handleClearBets: () => void;
    handleUndoBet: () => void;
}

export default function GameActionButtons({
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
    gameOver,
    gameContinue,
    setWinningNumber,
    handleClearBets,
    handleUndoBet,
}: GameActionButtonsProps) {
    return (
        <>
            {/* Action buttons section */}
            <div className="game-actions">
                <button
                    className={`game-action-btn game-button game-button-secondary ${betActions.length === 0 ? 'game-button-disabled' : ''}`}
                    onClick={gridBlock ? undefined : handleClearBets}
                    data-cy="clear-button"
                >
                    Clear
                </button>

                <button
                    className={`game-action-btn game-button game-button-secondary ${betActions.length === 0 ? 'game-button-disabled' : ''}`}
                    onClick={gridBlock ? undefined : handleUndoBet}
                    data-cy="undo-button"
                >
                    Undo
                </button>

                <button
                    className={`game-action-btn game-button ${
                        bets.length === 0 || remSpins === 0 || isPaused || isSubmitting
                            ? 'game-button-disabled'
                            : 'game-button-primary'
                    }`}
                    data-cy="submit-button"
                    onClick={async () => {
                        if (bets.length === 0 || remSpins === 0 || isPaused) return;

                        setIsPaused(true);
                        setRemSpins((prev) => prev - 1);
                        setGridBlock(true);

                        try {
                            const res = await api.logRound(JSON.stringify({ bets }));
                            const result = res.number;
                            const payout = res.payout;
                            const newBalance: number = userBalance + payout;
                            const displayResult = result === 37 ? '00' : result.toString();
                            setWinningNumber(displayResult);

                            setTimeout(() => {
                                if (remSpins === 1 || timeLeft === 0 || newBalance === 0) {
                                    gameOver(newBalance);
                                    return;
                                }
                                gameContinue(newBalance, displayResult);
                            }, 2500);
                        } catch (error) {
                            console.error('Round error:', error);
                        }
                    }}
                >
                    Submit Bets
                </button>
            </div>
        </>
    );
}
