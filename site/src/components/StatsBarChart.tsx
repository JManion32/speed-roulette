import { createStackedBarData, stackedBarOptions } from '../utils/chartUtils';
import { Bar } from 'react-chartjs-2';

interface StatsBarChartProps {
    counts: Record<string, number>;
    labels: string[];
}

export function StatsBarChart({ counts, labels }: StatsBarChartProps) {
    return (
        <div className="stats-chart-cell">
            <Bar data={createStackedBarData(counts, labels)} options={stackedBarOptions} />
        </div>
    );
}
