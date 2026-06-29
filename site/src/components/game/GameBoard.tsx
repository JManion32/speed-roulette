import type { Bet } from '../../types/chips';
import { JSX } from 'react';
import GameBoardTable from './GameBoardTable.tsx';
import GameBoardGrid from './GameBoardGrid.tsx';

interface GameBoardProps {
    isWinning: (num: string) => boolean;
    remSpins: number;
    gridBlock: boolean;
    showGrid: boolean;
    handleGridCellClick: (index: number, gridId: string) => void;
    hasBet: (index: number, gridId: string) => boolean;
    getBet: (index: number, gridId: string) => Bet | undefined;
    renderChip: (bet: Bet) => JSX.Element;
}

export default function GameBoard({
    isWinning,
    remSpins,
    gridBlock,
    showGrid,
    handleGridCellClick,
    hasBet,
    getBet,
    renderChip,
}: GameBoardProps) {
    // Main GameBoard component with GameBoardGrid overlayed on GameBoardTable.
    return (
        <>
            {/* Main roulette table with grid overlay */}
            <div className="roulette-board-container">
                <GameBoardTable isWinning={isWinning} />
                <GameBoardGrid
                    count={138}
                    gridId="inner"
                    dataCyPrefix="inner"
                    remSpins={remSpins}
                    gridBlock={gridBlock}
                    showGrid={showGrid}
                    borderColor="red"
                    backgroundColor="rgba(255,0,0,0.2)"
                    handleGridCellClick={handleGridCellClick}
                    hasBet={hasBet}
                    getBet={getBet}
                    renderChip={renderChip}
                    containerStyle={{
                        top: 0,
                        left: '5.9375rem',
                        zIndex: 1,
                        gridTemplateColumns: '4.125rem repeat(10, 1.25rem 4.125rem) 1.25rem 4.8125rem',
                        gridTemplateRows: '4.6875rem 1.25rem 4.125rem 1.25rem 4.125rem 1.25rem',
                    }}
                />

                <GameBoardGrid
                    count={8}
                    gridId="zeros-split"
                    dataCyPrefix="zero-split"
                    remSpins={remSpins}
                    gridBlock={gridBlock}
                    showGrid={showGrid}
                    borderColor="orange"
                    backgroundColor="rgba(225,232,25,0)"
                    handleGridCellClick={handleGridCellClick}
                    hasBet={hasBet}
                    getBet={getBet}
                    renderChip={renderChip}
                    containerStyle={{
                        top: 0,
                        left: '4.6875rem',
                        zIndex: 2,
                        gridTemplateColumns: '1.25rem',
                        gridTemplateRows: '4.6875rem 1.25rem 1.5rem 1.25rem 1.5rem 1.25rem 4.0625rem 1.1875rem',
                    }}
                />

                <GameBoardGrid
                    count={3}
                    gridId="zeros"
                    dataCyPrefix="zero"
                    remSpins={remSpins}
                    gridBlock={gridBlock}
                    showGrid={showGrid}
                    borderColor="yellow"
                    backgroundColor="rgba(25,83,232,0)"
                    handleGridCellClick={handleGridCellClick}
                    hasBet={hasBet}
                    getBet={getBet}
                    renderChip={renderChip}
                    containerStyle={{
                        top: 0,
                        left: 0,
                        gridTemplateColumns: '4.6875rem',
                        gridTemplateRows: '7.4375rem 1.25rem 7.4375rem',
                    }}
                />

                <GameBoardGrid
                    count={3}
                    gridId="dozens"
                    dataCyPrefix="dozen"
                    remSpins={remSpins}
                    gridBlock={gridBlock}
                    showGrid={showGrid}
                    borderColor="green"
                    backgroundColor="rgba(199,128,6,0)"
                    handleGridCellClick={handleGridCellClick}
                    hasBet={hasBet}
                    getBet={getBet}
                    renderChip={renderChip}
                    containerStyle={{
                        left: '5.375rem',
                        top: '16.125rem',
                        gridTemplateColumns: '21.5rem 21.5rem 21.5rem',
                        gridTemplateRows: '4.0625rem',
                    }}
                />

                <GameBoardGrid
                    count={3}
                    gridId="rows"
                    dataCyPrefix="row"
                    remSpins={remSpins}
                    gridBlock={gridBlock}
                    showGrid={showGrid}
                    borderColor="blue"
                    backgroundColor="rgba(104,36,230,0)"
                    handleGridCellClick={handleGridCellClick}
                    hasBet={hasBet}
                    getBet={getBet}
                    renderChip={renderChip}
                    containerStyle={{
                        top: 0,
                        left: '69.875rem',
                        gridTemplateColumns: '5.375rem',
                        gridTemplateRows: '5.375rem 5.375rem 5.375rem',
                    }}
                />

                <GameBoardGrid
                    count={6}
                    gridId="outer"
                    dataCyPrefix="outer"
                    remSpins={remSpins}
                    gridBlock={gridBlock}
                    showGrid={showGrid}
                    borderColor="purple"
                    backgroundColor="rgba(61,47,6,0)"
                    handleGridCellClick={handleGridCellClick}
                    hasBet={hasBet}
                    getBet={getBet}
                    renderChip={renderChip}
                    containerStyle={{
                        left: '5.375rem',
                        top: '20.1875rem',
                        gridTemplateColumns: 'repeat(6, 10.75rem)',
                        gridTemplateRows: '4.0625rem',
                    }}
                />
            </div>
        </>
    );
}
