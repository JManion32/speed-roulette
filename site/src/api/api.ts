import secureFetch from './secure-fetch.ts'

export async function register(nickname: string) {
    const res = await secureFetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ nickname }),
    });
    return res.json();
}

export async function getLeaderboard() {
    const res = await secureFetch('/api/leaderboards');
    return res.json();
}

export async function getStats() {
    const res = await secureFetch('/api/stats');
    return res.json();
}

export async function logRound(betsJson: string) {
    const res = await secureFetch('/api/round', {
        method: 'POST',
        body: betsJson,
    });
    return res.json();
}

export async function logGame(nickname: string, userBalance: number, remSpins: number, timeLeft: number) {
    const res = await secureFetch('/api/game', {
        body: JSON.stringify({
            nickname,
            final_balance: userBalance,
            rem_spins: remSpins,
            rem_time: timeLeft,
        }),
    });
    return res.json();
}

export async function logout() {
    const res = await secureFetch('/api/logout', {
        method: 'DELETE',
    });

    return res.json();
}