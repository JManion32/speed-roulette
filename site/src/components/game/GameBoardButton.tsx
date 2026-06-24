type GameBoardNumberProps = {
    number: string;
    color: string;
    isWinning: (num: string) => boolean;
};

export function GameBoardNumber({ number, color, isWinning }: GameBoardNumberProps) {
    return (
        <td>
            <button className={`${color}-num ${isWinning(number) ? 'winning-glow-effect' : ''}`}>{number}</button>
        </td>
    );
}

export function GameBoardRow() {
    return <button className="outside-row">Row</button>;
}

type GameBoardDozenProps = {
    range: string;
};

export function GameBoardDozen({ range }: GameBoardDozenProps) {
    return (
        <td colSpan={4}>
            <button className="button-third">{range}</button>
        </td>
    );
}

type GameBoardBottomProps = {
    value: string;
    color: string;
};

export function GameBoardBottom({ value, color }: GameBoardBottomProps) {
    return (
        <td colSpan={2} className="game-board-row">
            <button className={`button-bottom-${color}`}>{value}</button>
        </td>
    );
}
