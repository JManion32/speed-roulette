export function useLogout() {
    return async function logout() {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                await fetch("/api/logout", {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (err) {
                console.error("Token cleanup failed:", err);
            }

            // No longer need token in local storage
            localStorage.removeItem("token");
        }
    };
}
