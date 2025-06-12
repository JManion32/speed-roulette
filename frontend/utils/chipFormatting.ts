  // Decides what color the betting chip should be based on amount
  const updateChipColor = (bet: number) => {
    if(bet >= 500) {
      return '#F97316'; // orange-500
    }
    else if(bet >= 100) {
      return '#EAB308'; // yellow-500
    }
    else if(bet >= 50) {
      return '#10B981'; // emerald-500
    }
    else if(bet >= 20) {
      return '#06B6D4'; // cyan-500
    }
    else if(bet >= 10) {
      return '#EC4899'; // pink-500
    }
    else if(bet >= 5) {
      return '#A855F7'; // purple-500
    }
    else if(bet >= 2) {
      return '#3B82F6'; // blue-500
    }
    else if(bet >= 1) {
      return '#6366F1'; // indigo-500
    }
    else {
      return '#6B7280'; // gray-500
    }
  };

  // To prevent text overflow on the chip
  const formatBetValue = (value: number): string => {
    if (value >= 100000) return `${Math.floor(value / 1000)}k`;

    if (value >= 1000) {
      const valueInK = value / 1000;
      return valueInK % 1 < 0.1 ? `${Math.floor(valueInK)}k` : `${valueInK.toFixed(1)}k`;
    }

    return value % 1 === 0 ? value.toString() : value.toFixed(1).replace(/^0+/, '');
  };

  export { updateChipColor, formatBetValue };