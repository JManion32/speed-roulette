import { useState, useEffect } from 'react';
import DarkModeToggle from '../ThemeToggle';
import HomeButton from '../HomeButton';
import { getColorClass } from '../../utils/recentNumColor';

interface GamePageHeaderProps {
    resultNums: string[];
}

export default function GamePageHeader({ resultNums }: GamePageHeaderProps) {

    const [nickname, setNickname] = useState<string>('');
    useEffect(() => {
        setNickname(localStorage.getItem('nickname') ?? '');
    }, []);

    return (
        <div className="result-header">
            <p className="result-header-nickname">{nickname}</p>

            <span className="result-header-results">
                {[...Array(9)].map((_, i) => {
                    const result = resultNums[i];

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

            <DarkModeToggle />
            <HomeButton />
        </div>
    );
}
