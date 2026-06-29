import '../css/home.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AboutModal from '../components/modals/AboutModal.tsx';
import HomeFooter from '../components/HomeFooter';
import HomeNavButton from '../components/HomeNavButton';
import stats from '../assets/stats.png';
import trophy from '../assets/trophy.png';
import { useStartGame } from '../hooks/useStartGame';
import { generateSplashText } from '../utils/generateSplashText';

function Home() {
    const [nickname, setNickname] = useState('');
    const startGame = useStartGame(nickname, setNickname);
    const [splashText] = useState(() => generateSplashText());

    return (
        <div className="home-page" data-cy="main-app-div">
            <PageHeader home={true}/>

            <div className="home-content">
                <h1 className="home-title fade-in">Speed Roulette</h1>

                <p className="home-splash-text fade-in">{splashText}</p>

                <div className="home-form">
                    <p className="home-error-message" id="profanity-error">
                        Please choose a clean nickname!
                    </p>

                    <input
                        type="text"
                        id="nickname-enter-form"
                        data-cy="nickname-enter-form"
                        value={nickname}
                        name="nickname"
                        autoComplete="nickname"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        onChange={(e) => setNickname(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && nickname) {
                                e.preventDefault();
                                startGame();
                            }
                        }}
                        maxLength={20}
                        className="home-nickname-input"
                        placeholder="Enter Nickname"
                        title="Enter your nickname"
                    />

                    <Link to="">
                        <button
                            data-cy="play-button"
                            onClick={startGame}
                            className={`home-play-button ${
                                nickname === '' ? 'home-play-button-disabled' : 'home-play-button-enabled'
                            }`}
                            disabled={nickname === ''}
                        >
                            Play
                        </button>
                    </Link>
                </div>

                <div className="home-navigation-container">
                    <AboutModal />

                    <HomeNavButton to="/leaderboard" image={trophy} alt="Trophy" testId="open-leaderboard-page" />

                    <HomeNavButton to="/stats" image={stats} alt="Statistics" testId="open-stats-page" />
                </div>
            </div>

            <HomeFooter />
        </div>
    );
}

export default Home;
