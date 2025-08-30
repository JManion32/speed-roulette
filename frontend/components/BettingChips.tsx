// frontend/components/ChipControls.tsx
import { useDarkMode } from '../contexts/DarkModeContext';
import type { Chip } from '../types/chips';

interface ChipControlsProps {
  selectedChip: Chip | null;
  userBalance: number;
  isSelected: boolean;
  handleChipSelect: (value: number, color: string) => void;
  setIsSelected: (selected: boolean) => void;
}

const CHIP_OPTIONS = [
  { value: 0.5, color: '#6B7280', bg: 'bg-gray-500 hover:bg-gray-400 border-gray-400' },
  { value: 1, color: '#6366F1', bg: 'bg-indigo-500 hover:bg-indigo-400 border-indigo-400' },
  { value: 2, color: '#3B82F6', bg: 'bg-blue-500 hover:bg-blue-400 border-blue-400' },
  { value: 5, color: '#A855F7', bg: 'bg-purple-500 hover:bg-purple-400 border-purple-400' },
  { value: 10, color: '#EC4899', bg: 'bg-pink-500 hover:bg-pink-400 border-pink-400' },
  { value: 20, color: '#06B6D4', bg: 'bg-cyan-500 hover:bg-cyan-400 border-cyan-400' },
  { value: 50, color: '#10B981', bg: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400' },
  { value: 100, color: '#EAB308', bg: 'bg-yellow-500 hover:bg-yellow-400 border-yellow-400' },
  { value: 500, color: '#F97316', bg: 'bg-orange-500 hover:bg-orange-400 border-orange-400' },
  { value: -1, color: '#DC2626', isMax: true, bg: 'bg-red-600 hover:bg-red-500 border-red-500' },
];

export default function ChipControls({
  selectedChip,
  userBalance,
  isSelected,
  handleChipSelect,
  setIsSelected,
}: ChipControlsProps) {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-5">
      {CHIP_OPTIONS.map(({ value, color, isMax, bg }) => {
        const isCurrent = selectedChip?.value === value;

        let betValue: number;
        if (isMax) {
          betValue = userBalance;
        }
        else {
          betValue = value;
        }

        const canAfford = userBalance >= value;

        return (
          <button
            key={isMax ? 'MAX' : value}
            data-cy={`chip-${value}`}
            disabled={!canAfford}
            className={`chip-button mr-2 transition duration-200 ${
              isCurrent ? (isDarkMode ? 'ring-4 ring-white' : 'ring-4 ring-yellow-500') : ''
            } ${
              !isSelected && canAfford ? (isDarkMode ? 'glow-pulse-dark' : 'glow-pulse-light') : ''
            } ${
              !canAfford ? (isDarkMode ? 'bg-gray-900' : 'bg-gray-400') + ' cursor-not-allowed opacity-50' : bg
            } ${
              isMax ? 'text-[1.70rem]' : 'text-[2rem]'}
            `}
            onClick={() => {
              handleChipSelect(betValue, color, isMax);
              setIsSelected(true);
            }}
          >
            {isMax ? 'MAX' : value}
          </button>
        );
      })}
    </div>
  );
}
