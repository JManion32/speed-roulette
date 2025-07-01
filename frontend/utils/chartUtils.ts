export const createStackedBarData = (counts: Record<string, number>) => {
  const total = Object.values(counts).reduce((acc, val) => acc + val, 0);
  const labels = Object.keys(counts);
  const colors = {
    red: '#dc2626',
    black: '#000000',
    green: '#16a34a',
    even: '#3b82f6',
    odd: '#8b5cf6',
    high: '#f59e0b',
    low: '#10b981',
    first: '#22d3ee',
    second: '#eab308',
    third: '#f472b6',
    row1: '#7c3aed',
    row2: '#f87171',
    row3: '#4ade80',
    zero: '#14b8a6',
    // add more as needed
  };

  return {
    labels: [""], // only 1 bar
    datasets: labels.map((label) => ({
      label,
      data: [total === 0 ? 0 : (counts[label] / total) * 100],
      backgroundColor: colors[label] || '#facc15',
      barPercentage: 1.0,
      categoryPercentage: 1.0,
    })),
  };
};

export const stackedBarOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true, display: false, max: 100 },
    y: { stacked: true, display: false },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
      },
    },
  },
};
