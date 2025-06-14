import { useState, useCallback } from 'react';
import type { Bet, BetAction, Chip } from '../types/chips';
import { updateChipColor } from '../utils/chipFormatting';

interface UseBettingParams {
    setIsPaused?: (val: boolean) => void;
}

export function useBetting({ setIsPaused }: { setIsPaused: (val: boolean) => void }) {
  const [selectedChip, setSelectedChip] = useState<Chip | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [betActions, setBetActions] = useState<BetAction[]>([]);
  const [userBalance, setUserBalance] = useState<number>(20);
  const [totalBet, setTotalBet] = useState<number>(0);

  const handleChipSelect = (value: number, color: string) => {
    if (userBalance >= value) {
      setSelectedChip({ value, color });
    }
  };

  const handleGridCellClick = useCallback((index: number, gridId: string) => {
    if (!selectedChip || userBalance < selectedChip.value) return;

    setIsPaused(false);

    setBetActions(prev => [...prev, { gridIndex: index, gridId, chipValue: selectedChip.value }]);
    setTotalBet(prev => prev + selectedChip.value);
    setUserBalance(prev => prev - selectedChip.value);

    const existingBetIndex = bets.findIndex(bet => bet.gridIndex === index && bet.gridId === gridId);

    if (existingBetIndex === -1) {
      setBets(prev => [...prev, {
        gridIndex: index,
        gridId,
        chipValue: selectedChip.value,
        chipColor: selectedChip.color
      }]);
    } else {
      setBets(prev => {
        const newBets = [...prev];
        const updated = { ...newBets[existingBetIndex] };
        updated.chipValue += selectedChip.value;
        updated.chipColor = updateChipColor(updated.chipValue);
        newBets[existingBetIndex] = updated;
        return newBets;
      });
    }
  }, [selectedChip, userBalance, bets]);

  const handleUndoBet = () => {
    if (betActions.length === 0) return;
    const last = betActions[betActions.length - 1];

    setBetActions(prev => prev.slice(0, -1));
    setUserBalance(prev => prev + last.chipValue);
    setTotalBet(prev => prev - last.chipValue);

    const idx = bets.findIndex(b => b.gridIndex === last.gridIndex && b.gridId === last.gridId);
    if (idx !== -1) {
      setBets(prev => {
        const newBets = [...prev];
        const updated = { ...newBets[idx] };
        updated.chipValue -= last.chipValue;
        if (updated.chipValue <= 0) {
          return newBets.filter((_, i) => i !== idx);
        }
        updated.chipColor = updateChipColor(updated.chipValue);
        newBets[idx] = updated;
        return newBets;
      });
    }
  };

  const hasBet = (index: number, gridId: string) => {
    return bets.some(bet => bet.gridIndex === index && bet.gridId === gridId);
  };

  const getBet = (index: number, gridId: string) => {
    return bets.find(bet => bet.gridIndex === index && bet.gridId === gridId);
  };

  return {
    selectedChip,
    setSelectedChip,
    isSelected,
    setIsSelected,
    bets,
    betActions,
    userBalance,
    totalBet,
    handleChipSelect,
    handleGridCellClick,
    handleUndoBet,
    hasBet,
    getBet,
    setUserBalance,
    setTotalBet,
    setBets,
    setBetActions,
  };
}
