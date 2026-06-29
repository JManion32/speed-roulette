import { useState } from 'react';

/* CSS */
import '../css/game.css';

/* Components */
import ActionButtons from '../components/game/GameActions';
import BettingChips from '../components/game/GameChips';
import GameStatsBar from '../components/game/GameStatus';
import GamePageHeader from '../components/game/GamePageHeader';
import RouletteBoard from '../components/game/GameBoard';
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
    const { timeLeft, isPaused, setTimeLeft, setIsPaused } = useTimer(() => {
        handleClearBets();
        setShowModal(true);
    });

    const { remSpins, setRemSpins } = useRemSpins();
    const { showModal, setShowModal, isClosing, closeModal } = useResultModal();
    const { setWinningNumber, isWinning, resultNums, setResultNums, addResultNum } = useResultNums();
    const [showGrid] = useState(false);
    const [gridBlock, setGridBlock] = useState(false);
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleClearBets = () => {
        setBets([]);
        setBetActions([]);
        setUserBalance((prev) => prev + totalBet);
        setTotalBet(0);
    };
    // In between rounds of a match
    const resetTable = (newBalance: number) => {
        setTotalBet(0);
        setBetActions([]);
        setIsSubmitting(true);
        selectHighestAffordableChip(selectedChip!, newBalance);
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
        resetSelectedChip(selectedChip!);
    };

    // Render a chip component for the grid
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
            <GamePageHeader resultNums={resultNums} />

            <div className="game-content">
                <div className="game-content-inner">
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
                        handleChipSelect={handleChipSelect}
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
