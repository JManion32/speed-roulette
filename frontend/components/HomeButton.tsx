import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import home from '../assets/home.png';
import home_white from '../assets/home_white.png';

export default function HomeButton() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const handleClick = async () => {
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

  return (
    <button
      onClick={handleClick}
      className={`
        absolute right-24 rounded-full w-15 h-15 
        flex justify-center items-center 
        transition-transform transform hover:scale-110
        ${isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-white hover:bg-gray-300 border-2 border-black'}
      `}
    >
      <img
        src={isDarkMode ? home_white : home}
        alt="Home"
        className="w-12 h-12"
      />
    </button>
  );
}
