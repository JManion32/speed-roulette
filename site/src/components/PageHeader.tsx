import { useState, useEffect } from 'react';
import DarkModeToggle from './ThemeToggle';
import HomeButton from './HomeButton';
import GamePrevNums from './game/GamePrevNums';

interface PageHeaderProps {
    prevNums?: string[];
    home?: boolean;
}

export default function PageHeader({ prevNums, home }: PageHeaderProps) {

    const [nickname, setNickname] = useState<string>('');
    useEffect(() => {
        setNickname(localStorage.getItem('nickname') ?? '');
    }, []);

    return (
        <div className="page-header">

            {prevNums && (
                <>
                    <p className="result-header-nickname">{nickname}</p>
                    <GamePrevNums prevNums={prevNums} />
                </>
            )}

            <DarkModeToggle />
            {!home && (
                <>
                    <HomeButton />
                </>
            )}
        </div>
    );
}
