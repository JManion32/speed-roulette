import { Link } from 'react-router-dom';

import AboutModal from './modals/AboutModal.tsx';

// Contexts
import { useTheme } from '../contexts/ThemeContext.tsx';

// Images
import stats from '../assets/stats.png';
import trophy from '../assets/trophy.png';

export default function HomeActionButtons() {
    const { theme } = useTheme();
    return (
        <div>
            <div className="flex justify-center gap-4">
                <AboutModal />
                <Link to="/leaderboard" className="inline-block">
                    <button
                        className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300'} home-action-btn mr-10`}
                        data-cy="open-leaderboard-page"
                    >
                        <img src={trophy} alt="Trophy" className="w-20 h-20" draggable="false" />
                    </button>
                </Link>
                <Link to="/stats" className="inline-block">
                    <button
                        className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300'} home-action-btn`}
                        data-cy="open-stats-page"
                    >
                        <img src={stats} alt="Statistics" className="w-20 h-20" draggable="false" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
