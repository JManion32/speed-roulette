import { useDarkMode } from "../contexts/DarkModeContext";
import sun from "../assets/sun.png";
import moon from "../assets/moon_white.png";

export default function DarkModeToggle() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <button 
        className={`absolute right-6 rounded-full w-15 h-15 transition-transform transform hover:scale-110 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-350 border-2 border-black'}`}
        onClick={() => setIsDarkMode(!isDarkMode)}>
        <img src={isDarkMode ? moon : sun} alt={isDarkMode ? "Sun" : "Moon"}/>
    </button>
  );
}
