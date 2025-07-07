import type { Bet } from "../types/chips";
import { JSX } from 'react';

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
 return (
    <>
      {/* Main roulette table with grid overlay */}
      <div className="relative">
        <table className="border-collapse">
          <tbody>
            {/* Zero row that spans 3 rows */}
            <tr>
              <td rowSpan={3} className="p-0 border-0">
                <div className="flex flex-col h-full">
                  <button className={`green-num ${isWinning("0") ? 'winning-glow-effect' : ''}`}>0</button>
                  <button className={`green-num ${isWinning("00") ? 'winning-glow-effect' : ''}`}>00</button>
                </div>
              </td>
              <td><button className={`red-num ${isWinning("3") ? 'winning-glow-effect' : ''}`}>3</button></td>
              <td><button className={`black-num ${isWinning("6") ? 'winning-glow-effect' : ''}`}>6</button></td>
              <td><button className={`red-num ${isWinning("9") ? 'winning-glow-effect' : ''}`}>9</button></td>
              <td><button className={`red-num ${isWinning("12") ? 'winning-glow-effect' : ''}`}>12</button></td>
              <td><button className={`black-num ${isWinning("15") ? 'winning-glow-effect' : ''}`}>15</button></td>
              <td><button className={`red-num ${isWinning("18") ? 'winning-glow-effect' : ''}`}>18</button></td>
              <td><button className={`red-num ${isWinning("21") ? 'winning-glow-effect' : ''}`}>21</button></td>
              <td><button className={`black-num ${isWinning("24") ? 'winning-glow-effect' : ''}`}>24</button></td>
              <td><button className={`red-num ${isWinning("27") ? 'winning-glow-effect' : ''}`}>27</button></td>
              <td><button className={`red-num ${isWinning("30") ? 'winning-glow-effect' : ''}`}>30</button></td>
              <td><button className={`black-num ${isWinning("33") ? 'winning-glow-effect' : ''}`}>33</button></td>
              <td><button className={`red-num ${isWinning("36") ? 'winning-glow-effect' : ''}`}>36</button></td>
              <td><button className="outside-row">Row</button></td>
            </tr>
            <tr>
              <td><button className={`black-num ${isWinning("2") ? 'winning-glow-effect' : ''}`}>2</button></td>
              <td><button className={`red-num ${isWinning("5") ? 'winning-glow-effect' : ''}`}>5</button></td>
              <td><button className={`black-num ${isWinning("8") ? 'winning-glow-effect' : ''}`}>8</button></td>
              <td><button className={`black-num ${isWinning("11") ? 'winning-glow-effect' : ''}`}>11</button></td>
              <td><button className={`red-num ${isWinning("14") ? 'winning-glow-effect' : ''}`}>14</button></td>
              <td><button className={`black-num ${isWinning("17") ? 'winning-glow-effect' : ''}`}>17</button></td>
              <td><button className={`black-num ${isWinning("20") ? 'winning-glow-effect' : ''}`}>20</button></td>
              <td><button className={`red-num ${isWinning("23") ? 'winning-glow-effect' : ''}`}>23</button></td>
              <td><button className={`black-num ${isWinning("26") ? 'winning-glow-effect' : ''}`}>26</button></td>
              <td><button className={`black-num ${isWinning("29") ? 'winning-glow-effect' : ''}`}>29</button></td>
              <td><button className={`red-num ${isWinning("32") ? 'winning-glow-effect' : ''}`}>32</button></td>
              <td><button className={`black-num ${isWinning("35") ? 'winning-glow-effect' : ''}`}>35</button></td>
              <td><button className="outside-row">Row</button></td>
            </tr>
            <tr>
              <td><button className={`red-num ${isWinning("1") ? 'winning-glow-effect' : ''}`}>1</button></td>
              <td><button className={`black-num ${isWinning("4") ? 'winning-glow-effect' : ''}`}>4</button></td>
              <td><button className={`red-num ${isWinning("7") ? 'winning-glow-effect' : ''}`}>7</button></td>
              <td><button className={`black-num ${isWinning("10") ? 'winning-glow-effect' : ''}`}>10</button></td>
              <td><button className={`black-num ${isWinning("13") ? 'winning-glow-effect' : ''}`}>13</button></td>
              <td><button className={`red-num ${isWinning("16") ? 'winning-glow-effect' : ''}`}>16</button></td>
              <td><button className={`red-num ${isWinning("19") ? 'winning-glow-effect' : ''}`}>19</button></td>
              <td><button className={`black-num ${isWinning("22") ? 'winning-glow-effect' : ''}`}>22</button></td>
              <td><button className={`red-num ${isWinning("25") ? 'winning-glow-effect' : ''}`}>25</button></td>
              <td><button className={`black-num ${isWinning("28") ? 'winning-glow-effect' : ''}`}>28</button></td>
              <td><button className={`black-num ${isWinning("31") ? 'winning-glow-effect' : ''}`}>31</button></td>
              <td><button className={`red-num ${isWinning("34") ? 'winning-glow-effect' : ''}`}>34</button></td>
              <td><button className="outside-row">Row</button></td>
            </tr>

            {/* Dozen bets */}
            <tr>
              <td className="p-0 border-0"></td>
              <td colSpan={4}><button className="button-third">1-12</button></td>
              <td colSpan={4}><button className="button-third">13-24</button></td>
              <td colSpan={4}><button className="button-third">25-36</button></td>
              <td className="p-0 border-0"></td>
            </tr>

            {/* Outside bets */}
            <tr>
              <td className="p-0 border-0"></td>
              <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">1-18</button></td>
              <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">EVEN</button></td>
              <td colSpan={2} className="p-0 border-0"><button className="button-bottom-red">RED</button></td>
              <td colSpan={2} className="p-0 border-0"><button className="button-bottom-black">BLACK</button></td>
              <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">ODD</button></td>
              <td colSpan={2} className="p-0 border-0"><button className="button-bottom-green">19-36</button></td>
              <td></td>
            </tr>
          </tbody>
        </table>

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
                  left: '5.9375rem'
                }}
              >
                {Array(23 * 6).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'inner')}
                    className="board-grid relative"
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

              {/*Zeros (Number and Split)*/}
              <div 
                className="absolute top-0 left-0"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '1.25rem',
                  gridTemplateRows: '4.6875rem 1.25rem 1.5rem 1.25rem 1.5rem 1.25rem 4.0625rem 1.1875rem',
                  gap: '0px',
                  left: '4.6875rem',
                  zIndex: 2
                }}
              >
                {Array(1 * 8).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'zeros-split')}
                    className="board-grid relative"
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

              {/*Zeros and Numbers Split Bet*/}
              <div 
                className="absolute top-0"
                style={{ 
                  display: 'grid', // Always display the grid for bet placement
                  gridTemplateColumns: '4.6875rem',
                  gridTemplateRows: '7.4375rem 1.25rem 7.4375rem',
                  gap: '0px',
                }}
              >
                {Array(1 * 3).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'zeros')}
                    className="board-grid relative"
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
                  top: '16.125rem'
                }}
              >
                {Array(3 * 1).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'dozens')}
                    className="board-grid relative"
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
                  left: '69.875rem'
                }}
              >
                {Array(1 * 3).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={remSpins === 0 || gridBlock ? undefined : () => handleGridCellClick(index, 'rows')}
                    className="board-grid relative"
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
                  top: '20.1875rem'
                }}
              >
                {Array(6 * 1).fill(null).map((_, index) => (
                  <div 
                    key={index}
                    onClick={() => handleGridCellClick(index, 'outer')}
                    className="board-grid relative"
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