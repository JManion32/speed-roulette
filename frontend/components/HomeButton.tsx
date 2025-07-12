import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useLogout } from '../hooks/useLogout';
import home from '../assets/home.png';
import home_white from '../assets/home_white.png';

export default function HomeButton() {
  const { isDarkMode } = useDarkMode();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleClick = async () => {
    await logout();
    localStorage.removeItem("nickname");
    navigate('/');
  };

  return (
    <button
      onClick={handleClick}
      className={`
        absolute right-24 rounded-full w-15 h-15 
        flex justify-center items-center 
        duration-200 hover:scale-110
        ${isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-white hover:bg-gray-300 border-2 border-black'}
      `}
    >
      <img
        src={isDarkMode ? home_white : home}
        alt="Home"
        className="w-12 h-12"
        draggable="false"
      />
    </button>
  );
}
