export function generateSplashText(): string {
  const texts = [
    "Welcome back!",
    "Keep it simple.",
    "Make as much as you can in 10 spins!",
    "Beat $6,700 for the site record!",
    "Feeling lucky today?",
    "Double or nothing!",
    "Spin to win!",
    "Roulette is just strategy in disguise.",
    "Go big or go broke.",
    "Place your bets!",
    "Hot streaks don't last forever, neither do cold ones!",
    "Straight-up numbers pay 35x but are risky.",
    "Today could be the day.",
    "Fortune favors the bold.",
    "One spin could change it all.",
    "The zeros are always lurking...",
    "ALL IN ON RED!!!",
    "Zeros are green for a reason...",
    "Even/odd and red/black are the safest bets.",
    "The leaderboard never sleeps.",
    "Consistency builds champions.",
    "Records are made to be broken.",
  ];

  const index = Math.floor(Math.random() * texts.length);
  return texts[index];
}
