import { useState } from 'react';

/* CSS */
import '../css/game.css';

/* Components */
import GameActionButtons from '../components/game/GameActionButtons';
import GameBettingChips from '../components/game/GameBettingChips';
import GameStatsBar from '../components/game/GameStatus';
import PageHeader from '../components/PageHeader';
import GameBoard from '../components/game/GameBoard';
import ResultModal from '../components/modals/ResultModal';

/* Hooks */
import { useAnimatedBalance } from '../hooks/useAnimatedBalance';
import { useTimer, useRemSpins } from '../hooks/useGameFlow';
import { useResultModal } from '../hooks/useResultModal';
import { useResultNums } from '../hooks/useResultNums';
import { useBetting } from '../hooks/useBetting';

/* Types */
import type { Bet } from '../types/chips';

/* Utils */
import { formatBetValue } from '../utils/chipFormatting';

function Game() {
    // For debugging
    const [showGrid] = useState(import.meta.env.VITE_SHOW_GAME_GRID === 'true');

    const { remSpins, setRemSpins } = useRemSpins();
    const { showModal, setShowModal, isClosing, closeModal } = useResultModal();
    const { setWinningNumber, isWinning, resultNums, setResultNums, addResultNum } = useResultNums();
    const [gridBlock, setGridBlock] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Game timer
    const { timeLeft, isPaused, setTimeLeft, setIsPaused } = useTimer(() => {
        handleClearBets();
        setShowModal(true);
    });

    // Everything to do with betting
    const {
        selectedChip,
        bets,
        betActions,
        userBalance,
        totalBet,
        handleChipSelect,
        handleGridCellClick,
        handleUndoBet,
        resetSelectedChip,
        selectHighestAffordableChip,
        hasBet,
        getBet,
        setUserBalance,
        setTotalBet,
        setBets,
        setBetActions,
    } = useBetting({ setIsPaused });

    const { animatedBalance, balanceChangeDirection } = useAnimatedBalance(userBalance);

    // "Clear" seledted
    const handleClearBets = () => {
        setBets([]);
        setBetActions([]);
        setUserBalance((prev) => prev + totalBet);
        setTotalBet(0);
    };

    // The round is over, and the player has run out of one of: balance, time, or spins
    const gameOver = (newBalance: number) => {
        setShowModal(true);
        setWinningNumber(null);
        setUserBalance(newBalance);
    }

    // The round is over, but the match can be continued
    const gameContinue = (newBalance: number, displayResult: string) => {
        setTotalBet(0);
        setBetActions([]);
        setIsSubmitting(true);
        selectHighestAffordableChip(selectedChip!, newBalance);
        setTimeout(() => {
            setBets([]);
            setIsSubmitting(false);
        }, 50);
    
        addResultNum(displayResult);
        setWinningNumber('');
        setIsPaused(false);
        setGridBlock(false);
        setUserBalance(newBalance);
    }

    // When "Play Again" is selected
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
        resetSelectedChip(selectedChip!);
    };

    // Render a chip component to place on the grid
    const renderChip = (bet: Bet) => (
        <div
            className="game-chip"
            style={{
                backgroundColor: bet.chipColor,
            }}
        >
            {formatBetValue(bet.chipValue)}
        </div>
    );

    return (
        <div className={`game-page`}>
            <PageHeader prevNums={resultNums} />

            <div className="game-content">
                <div className="game-content-inner">
                    <GameStatsBar
                        totalBet={totalBet}
                        timeLeft={timeLeft}
                        remSpins={remSpins}
                        animatedBalance={animatedBalance}
                        balanceChangeDirection={balanceChangeDirection}
                    />

                    <GameBettingChips
                        selectedChip={selectedChip}
                        userBalance={userBalance}
                        handleChipSelect={handleChipSelect}
                    />

                    <GameActionButtons
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
                        gameOver={gameOver}
                        gameContinue={gameContinue}
                        setWinningNumber={setWinningNumber}
                        handleClearBets={handleClearBets}
                        handleUndoBet={handleUndoBet}
                    />

                    <GameBoard
                        isWinning={isWinning}
                        remSpins={remSpins}
                        gridBlock={gridBlock}
                        showGrid={!!showGrid}
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
