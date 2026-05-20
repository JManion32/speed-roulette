import type { Bet } from '../../types/chips';
import { JSX } from 'react';
import GameBoardTable from "./GameBoardTable.tsx"

interface RouletteBoardProps {
    isWinning: (num: string) => boolean;
    remSpins: number;
    gridBlock: boolean;
    showGrid: boolean;
    handleGridCellClick: (index: number, gridId: string) => void;
    hasBet: (index: number, gridId: string) => boolean;
    getBet: (index: number, gridId: string) => Bet | undefined;
    renderChip: (bet: Bet) => JSX.Element;
}

export default function RouletteBoard({
    isWinning,
    remSpins,
    gridBlock,
    showGrid,
    handleGridCellClick,
    hasBet,
    getBet,
    renderChip,
}: RouletteBoardProps) {
    // Main GameBoard component with grid and logic.
    return (
        <>
            {/* Main roulette table with grid overlay */}
            <div className="relative mr-10 ml-10 mb-10">
                <GameBoardTable isWinning={isWinning}/>

                {/* ALL GRIDS FOR BET PLACEMENT */}
                {/* All inner bets + Streets / Avenues / Basket */}
                <div
                    className="absolute top-0"
                    style={{
                        display: 'grid', // Always display the grid for bet placement
                        gridTemplateColumns: '4.125rem repeat(10, 1.25rem 4.125rem) 1.25rem 4.8125rem',
                        gridTemplateRows: '4.6875rem 1.25rem 4.125rem 1.25rem 4.125rem 1.25rem',
                        gap: '0px',
                        zIndex: 1,
                        left: '5.9375rem',
                    }}
                >
                    {Array(23 * 6)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={
                                    remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'inner')
                                }
                                className="board-grid relative"
                                data-cy={`inner-${index}`}
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

                {/* Zeros and Numbers Split Bet */}
                <div
                    className="absolute top-0 left-0"
                    style={{
                        display: 'grid', // Always display the grid for bet placement
                        gridTemplateColumns: '1.25rem',
                        gridTemplateRows: '4.6875rem 1.25rem 1.5rem 1.25rem 1.5rem 1.25rem 4.0625rem 1.1875rem',
                        gap: '0px',
                        left: '4.6875rem',
                        zIndex: 2,
                    }}
                >
                    {Array(1 * 8)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={
                                    remSpins === 0 || gridBlock
                                        ? undefined
                                        : () => handleGridCellClick(index, 'zeros-split')
                                }
                                className="board-grid relative"
                                data-cy={`zero-split-${index}`}
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

                {/* Zeros */}
                <div
                    className="absolute top-0"
                    style={{
                        display: 'grid', // Always display the grid for bet placement
                        gridTemplateColumns: '4.6875rem',
                        gridTemplateRows: '7.4375rem 1.25rem 7.4375rem',
                        gap: '0px',
                    }}
                >
                    {Array(1 * 3)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={
                                    remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'zeros')
                                }
                                className="board-grid relative"
                                data-cy={`zero-${index}`}
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
                        gridTemplateColumns: '21.5rem 21.5rem 21.5rem',
                        gridTemplateRows: '4.0625rem',
                        gap: '0px',
                        left: '5.375rem',
                        top: '16.125rem',
                    }}
                >
                    {Array(3 * 1)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={
                                    remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'dozens')
                                }
                                className="board-grid relative"
                                data-cy={`dozen-${index}`}
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
                        gridTemplateColumns: '5.375rem',
                        gridTemplateRows: '5.375rem 5.375rem 5.375rem',
                        gap: '0px',
                        left: '69.875rem',
                    }}
                >
                    {Array(1 * 3)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={
                                    remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'rows')
                                }
                                className="board-grid relative"
                                data-cy={`row-${index}`}
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
                        gridTemplateColumns: 'repeat(6, 10.75rem)',
                        gridTemplateRows: '4.0625rem',
                        gap: '0px',
                        left: '5.375rem',
                        top: '20.1875rem',
                    }}
                >
                    {Array(6 * 1)
                        .fill(null)
                        .map((_, index) => (
                            <div
                                key={index}
                                onClick={
                                    remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'outer')
                                }
                                className="board-grid relative"
                                data-cy={`outer-${index}`}
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
        </>
    );
}
