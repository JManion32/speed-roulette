import { getColorClass } from '../../utils/recentNumColor';

interface GamePageHeaderProps {
    prevNums: string[];
}

export default function GamePrevNums({ prevNums }: GamePageHeaderProps) {

    return (
        <span className="result-header-results">
            {[...Array(9)].map((_, i) => {
                const result = prevNums[i];

                return (
                    <button
                        key={i}
                        aria-label={`Previous result: ${result}`}
                        className={`result-header-result ${
                            result !== undefined ? getColorClass(result) : 'result-header-result-empty'
                        }`}
                    >
                        {result ?? ''}
                    </button>
                );
            })}
        </span>
    );
}
