import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Stats from './pages/Stats';

function App() {

    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/stats" element={<Stats />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
