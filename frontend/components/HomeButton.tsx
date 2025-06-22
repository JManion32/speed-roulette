import { useDarkMode } from '../contexts/DarkModeContext';
import { useLogoutToHome } from '../hooks/useLogout';
import home from '../assets/home.png';
import home_white from '../assets/home_white.png';

export default function HomeButton() {
  const { isDarkMode } = useDarkMode();
  const logoutAndRedirect = useLogoutToHome();

  return (
    <button
      onClick={logoutAndRedirect}
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
