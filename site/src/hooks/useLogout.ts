import api from '../api';

export function useLogout() {
    return async function logout() {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                await api.logout();
            } catch (err) {
                console.error('Token cleanup failed:', err);
            }

            // No longer need token in local storage
            localStorage.removeItem('token');
        }
    };
}
