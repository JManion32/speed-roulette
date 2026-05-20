import { GameBoardNumber, GameBoardRow, GameBoardDozen, GameBoardBottom } from './GameBoardButton.tsx';

type GameBoardNumberProps = {
    isWinning: (num: string) => boolean;
};

export default function GameBoardTable({ isWinning }: GameBoardNumberProps) {
    return (
        <>
            <table className="border-collapse">
                <tbody>
                    {/* Zero row that spans 3 rows */}
                    <tr>
                        <td rowSpan={3} className="p-0 border-0">
                            <div className="flex flex-col h-full">
                                <button className={`green-num ${isWinning('0') ? 'winning-glow-effect' : ''}`}>
                                    0
                                </button>
                                <button className={`green-num ${isWinning('00') ? 'winning-glow-effect' : ''}`}>
                                    00
                                </button>
                            </div>
                        </td>
                        <GameBoardNumber number="3" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="6" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="9" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="12" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="15" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="18" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="21" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="24" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="27" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="30" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="33" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="36" color="red" isWinning={isWinning} />
                        <GameBoardRow />
                    </tr>
                    <tr>
                        <GameBoardNumber number="2" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="5" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="8" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="11" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="14" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="17" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="20" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="23" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="26" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="29" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="32" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="35" color="black" isWinning={isWinning} />
                        <GameBoardRow />
                    </tr>
                    <tr>
                        <GameBoardNumber number="1" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="4" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="7" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="10" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="13" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="16" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="19" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="22" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="25" color="red" isWinning={isWinning} />
                        <GameBoardNumber number="28" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="31" color="black" isWinning={isWinning} />
                        <GameBoardNumber number="34" color="red" isWinning={isWinning} />
                        <GameBoardRow />
                    </tr>

                    {/* Dozen bets */}
                    <tr>
                        <td className="p-0 border-0"></td>
                        <GameBoardDozen range="1-12" />
                        <GameBoardDozen range="13-24" />
                        <GameBoardDozen range="25-36" />
                        <td className="p-0 border-0"></td>
                    </tr>

                    {/* Outside bets */}
                    <tr>
                        <td className="p-0 border-0"></td>
                        <GameBoardBottom value="1-18" color="green" />
                        <GameBoardBottom value="EVEN" color="green" />
                        <GameBoardBottom value="RED" color="red" />
                        <GameBoardBottom value="BLACK" color="black" />
                        <GameBoardBottom value="ODD" color="green" />
                        <GameBoardBottom value="19-36" color="green" />
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
