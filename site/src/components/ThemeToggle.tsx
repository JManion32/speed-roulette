import { useTheme } from '../contexts/ThemeContext';
import sun from '../assets/sun.png';
import moon from '../assets/moon-white.png';
import '../css/components/theme-toggle.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className="theme-toggle" onClick={toggleTheme} data-cy="dark-mode-toggle">
            <img
                src={theme === 'dark' ? moon : sun}
                alt={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                className="theme-toggle-icon"
                draggable="false"
            />
        </button>
    );
}
