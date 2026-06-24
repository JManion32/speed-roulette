import { useState } from 'react';
import { logGame as logGameApi } from '../api/api';

export function useLogGame() {
    const [rank, setRank] = useState<number | null>(null);

    const logGame = async (nickname: string, userBalance: number, remSpins: number, timeLeft: number) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn('No token found. User might be logged out.');
            return;
        }

        try {
            const res = await logGameApi(nickname, userBalance, remSpins, timeLeft);
            setRank(res.rank);
        } catch (err) {
            console.error('Failed to log game and get rank:', err);
        }
    };

    return { rank, logGame };
}
