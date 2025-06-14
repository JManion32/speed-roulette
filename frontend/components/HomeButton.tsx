import { Link } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import home from '../assets/home.png';
import home_white from '../assets/home_white.png';

export default function HomeButton() {
  const { isDarkMode } = useDarkMode();

  return (
    <Link to="/" className="inline-block">
      <button
        className={`
          absolute right-24 rounded-full w-15 h-15 
          flex justify-center items-center 
          transition-transform transform hover:scale-110
          ${isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700' 
            : 'bg-gray-200 hover:bg-gray-300'}
        `}
      >
        <img
          src={isDarkMode ? home_white : home}
          alt="Home"
          className="w-12 h-12"
        />
      </button>
    </Link>
  );
}