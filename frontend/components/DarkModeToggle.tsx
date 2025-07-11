import { useDarkMode } from "../contexts/DarkModeContext";
import sun from "../assets/sun.png";
import moon from "../assets/moon_white.png";

export default function DarkModeToggle() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <button 
        className={`transition-[background-color_200ms_ease,border-color_0ms,transform_200ms_ease] absolute right-6 rounded-full w-15 h-15 transition-transform transform hover:scale-110
          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300 border-2 border-black'}`}
        onClick={() => setIsDarkMode(!isDarkMode)}>
        <img
          src={isDarkMode ? moon : sun}
          alt={isDarkMode ? "Moon" : "Sun"}
          draggable="false" />
    </button>
  );
}
