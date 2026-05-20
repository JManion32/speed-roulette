import { useTheme } from '../contexts/ThemeContext';
import sun from '../assets/sun.png';
import moon from '../assets/moon_white.png';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={`duration-200 absolute right-3 rounded-full w-15 h-15 hover:scale-110 shadow-md
            ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-white hover:bg-gray-300'
            }`}
            onClick={toggleTheme}
            data-cy="dark-mode-toggle"
        >
            <img
                src={theme === 'dark' ? moon : sun}
                alt={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                draggable="false"
            />
        </button>
    );
}