import api from '../api';

export function usePlayAgain() {
    return async (nickname: string): Promise<string | null> => {
        try {
            const res = await api.register(nickname);
            localStorage.setItem('token', res.token);
            return res;
        } catch (err) {
            console.error('Error during re-registration:', err);
            return null;
        }
    };
}
