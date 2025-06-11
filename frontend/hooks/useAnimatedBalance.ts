import { useEffect, useState } from 'react';

type Direction = 'up' | 'down' | null;

export function useAnimatedBalance(userBalance: number) {
  const [animatedBalance, setAnimatedBalance] = useState<number>(userBalance);
  const [balanceChangeDirection, setBalanceChangeDirection] = useState<Direction>(null);

  useEffect(() => {
    const duration = 750;
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;

    let frame = 0;
    const start = animatedBalance;
    const end = userBalance;
    const diff = end - start;

    // Set direction immediately
    if (diff > 0) setBalanceChangeDirection('up');
    else if (diff < 0) setBalanceChangeDirection('down');
    else setBalanceChangeDirection(null);

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = Math.min(progress, 1);

      setAnimatedBalance(start + diff * easedProgress);

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedBalance(end);
        setBalanceChangeDirection(null);
      }
    };

    requestAnimationFrame(animate);
  }, [userBalance]);

  return { animatedBalance, balanceChangeDirection };
}