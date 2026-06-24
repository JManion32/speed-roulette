import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLogout } from '../hooks/useLogout';
import home from '../assets/home.png';
import home_white from '../assets/home_white.png';
import '../css/components/home-button.css';

export default function HomeButton() {
    const { theme } = useTheme();
    const logout = useLogout();
    const navigate = useNavigate();

    const handleClick = async () => {
        await logout();
        localStorage.removeItem('nickname');
        navigate('/');
    };

    return (
        <button
            onClick={handleClick}
            data-cy="home-button"
            className={`home-button`}
        >
            <img
                src={theme === 'dark' ? home_white : home}
                alt="Home"
                className="home-button-icon"
                draggable="false"
            />
        </button>
    );
}
