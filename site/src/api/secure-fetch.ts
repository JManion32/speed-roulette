export default async function secureFetch(url: string, options: RequestInit = {}, onExpire?: () => void) {
    const token = localStorage.getItem('token');

    const mergedOptions: RequestInit = {
        ...options,
        headers: {
            ...(options.body && {
                'Content-Type': 'application/json',
            }),
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    };

    const res = await fetch(url, mergedOptions);

    if (res.status === 401 || res.status === 403) {
        if (onExpire) onExpire();
        else {
            alert('Session expired. Please start a new game.');
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        throw new Error('Unauthorized');
    }
    if (res.status === 429) {
        throw new Error('Rate limited');
    }

    return res;
}
