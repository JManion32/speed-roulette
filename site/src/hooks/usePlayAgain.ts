import { register } from '../api/api';

export function usePlayAgain() {
    return async (nickname: string): Promise<string | null> => {
        try {
            const res = await register(nickname);
            localStorage.setItem('token', res.token);
            return res;
        } catch (err) {
            console.error('Error during re-registration:', err);
            return null;
        }
    };
}
