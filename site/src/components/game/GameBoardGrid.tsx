import type { Bet } from '../../types/chips';

interface BoardGridProps {
    count: number;
    gridId: string;
    dataCyPrefix: string;

    remSpins: number;
    gridBlock: boolean;
    showGrid: boolean;

    borderColor: string;
    backgroundColor: string;

    containerStyle: React.CSSProperties;

    handleGridCellClick: (index: number, gridId: string) => void;
    hasBet: (index: number, gridId: string) => boolean;
    getBet: (index: number, gridId: string) => Bet | undefined;
    renderChip: (bet: Bet) => React.ReactNode;
}

export default function BoardGrid({
    count,
    gridId,
    dataCyPrefix,
    remSpins,
    gridBlock,
    showGrid,
    borderColor,
    backgroundColor,
    containerStyle,
    handleGridCellClick,
    hasBet,
    getBet,
    renderChip,
}: BoardGridProps) {
    return (
        <div className="board-grid-container" style={containerStyle}>
            {Array(count)
                .fill(null)
                .map((_, index) => (
                    <div
                        key={index}
                        className="board-grid"
                        data-cy={`${dataCyPrefix}-${index}`}
                        onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, gridId)}
                        style={{
                            border: showGrid ? `1px solid ${borderColor}` : 'none',
                            backgroundColor: showGrid ? backgroundColor : 'transparent',
                        }}
                    >
                        {showGrid && index}
                        {hasBet(index, gridId) && renderChip(getBet(index, gridId)!)}
                    </div>
                ))}
        </div>
    );
}
