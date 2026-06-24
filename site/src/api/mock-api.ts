import leaderboard from './mocks/mock-leaderboard.json';
import stats from './mocks/mock-stats.json';

export async function register(_nickname: string) {
    return {
        token: 'development',
    };
}

export async function getLeaderboard() {
    return leaderboard;
}

export async function getStats() {
    return stats;
}

export async function logRound(_betsJson: string) {
    return {
        number: 32,
        payout: 500,
    };
}

export async function logGame(_nickname: string, _userBalance: number, _remSpins: number, _timeLeft: number) {
    return {
        rank: 1,
    };
}

export async function logout() {
    return;
}