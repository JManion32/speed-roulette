import DarkModeToggle from '../ThemeToggle';
import HomeButton from '../HomeButton';

interface ResultHeaderProps {
    nickname: string;
    resultNums: string[];
    getColorClass: (num: string) => string;
}

export default function ResultHeader({ nickname, resultNums, getColorClass }: ResultHeaderProps) {
    return (
        <div className="result-header">
            <p className="result-header-nickname">
                {nickname}
            </p>

            <span className="result-header-results">
                {[...Array(9)].map((_, i) => {
                    const result = resultNums[i];

                    return (
                        <button
                            key={i}
                            aria-label={`Previous result: ${result}`}
                            className={`result-header-result ${
                                result !== undefined
                                    ? getColorClass(result)
                                    : 'result-header-result-empty'
                            }`}
                        >
                            {result ?? ''}
                        </button>
                    );
                })}
            </span>

            <DarkModeToggle />
            <HomeButton />
        </div>
    );
}
