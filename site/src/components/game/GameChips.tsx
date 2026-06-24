import type { Chip } from '../../types/chips';

interface ChipControlsProps {
    selectedChip: Chip | null;
    userBalance: number;
    isSelected: boolean;
    handleChipSelect: (value: number, color: string) => void;
    setIsSelected: (selected: boolean) => void;
}

const CHIP_OPTIONS = [
    {
        value: 0.5,
        color: '#6B7280',
        className: 'chip-gray',
    },
    {
        value: 1,
        color: '#6366F1',
        className: 'chip-indigo',
    },
    {
        value: 2,
        color: '#3B82F6',
        className: 'chip-blue',
    },
    {
        value: 5,
        color: '#A855F7',
        className: 'chip-purple',
    },
    {
        value: 10,
        color: '#EC4899',
        className: 'chip-pink',
    },
    {
        value: 20,
        color: '#06B6D4',
        className: 'chip-cyan',
    },
    {
        value: 50,
        color: '#10B981',
        className: 'chip-emerald',
    },
    {
        value: 100,
        color: '#EAB308',
        className: 'chip-yellow',
    },
    {
        value: 500,
        color: '#F97316',
        className: 'chip-orange',
    },
];

export default function ChipControls({
    selectedChip,
    userBalance,
    isSelected,
    handleChipSelect,
    setIsSelected,
}: ChipControlsProps) {

    return (
        <div className="chip-controls">
            {CHIP_OPTIONS.map(({ value, color, className }) => {
                const isCurrent = selectedChip?.value === value;
                const canAfford = userBalance >= value;

                return (
                    <button
                        key={value}
                        data-cy={`chip-${value}`}
                        disabled={!canAfford}
                        className={`
                            chip-button
                            chip-spacing
                            ${isCurrent ? 'chip-selected' : ''}
                            ${!isSelected && canAfford ? 'chip-glow' : ''}
                            ${!canAfford ? 'chip-disabled' : className}
                        `}
                        onClick={() => {
                            handleChipSelect(value, color);
                            setIsSelected(true);
                        }}
                    >
                        {value}
                    </button>
                );
            })}
        </div>
    );
}
