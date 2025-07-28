import { useDarkMode } from "../contexts/DarkModeContext";
import sun from "../assets/sun.png";
import moon from "../assets/moon_white.png";

export default function DarkModeToggle() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <button 
        className={`duration-200 absolute right-3 rounded-full w-15 h-15 hover:scale-110 border-[0.125rem]
          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 border-transparent' : 'bg-white hover:bg-gray-300 border-black'}`}
        onClick={() => setIsDarkMode(!isDarkMode)}
        data-cy="dark-mode-toggle">
        <img
          src={isDarkMode ? moon : sun}
          alt={isDarkMode ? "Moon" : "Sun"}
          draggable="false" />
    </button>
  );
}
