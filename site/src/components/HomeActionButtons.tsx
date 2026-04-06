import { Link } from "react-router-dom";

// Contexts
import { useDarkMode } from "../contexts/DarkModeContext";

// Images
import about from "../assets/about.png";
import stats from "../assets/stats.png";
import trophy from "../assets/trophy.png";

interface HomeActionButtonsProps {
    setShowModal: (v: boolean) => void;
}

export default function HomeActionButtons({
    setShowModal,
}: HomeActionButtonsProps) {
    const { isDarkMode } = useDarkMode();
    return (
        <div>
            <div className="flex justify-center gap-4">
                <button
                    className={`${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}
            home-action-btn mr-10`}
                    onClick={() => setShowModal(true)}
                    data-cy="open-about-modal"
                >
                    <img
                        src={about}
                        alt="About"
                        className="w-20 h-20"
                        draggable="false"
                    />
                </button>
                <Link to="/leaderboard" className="inline-block">
                    <button
                        className={`${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}
            home-action-btn mr-10`}
                        data-cy="open-leaderboard-page"
                    >
                        <img
                            src={trophy}
                            alt="Trophy"
                            className="w-20 h-20"
                            draggable="false"
                        />
                    </button>
                </Link>
                <Link to="/stats" className="inline-block">
                    <button
                        className={`${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}
            home-action-btn`}
                        data-cy="open-stats-page"
                    >
                        <img
                            src={stats}
                            alt="Statistics"
                            className="w-20 h-20"
                            draggable="false"
                        />
                    </button>
                </Link>
            </div>
        </div>
    );
}
