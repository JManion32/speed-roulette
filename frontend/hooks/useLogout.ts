import { useNavigate } from 'react-router-dom';

export function useLogoutToHome() {
  const navigate = useNavigate();

  return async function logoutAndRedirect() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await fetch("/api/logout", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Token cleanup failed:", err);
      }

      localStorage.removeItem("token");
    }

    navigate("/");
  };
}
