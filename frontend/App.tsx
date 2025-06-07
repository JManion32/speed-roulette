// frontend/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Game from './pages/game';
import Leaderboard from './pages/leaderboard';
import Stats from './pages/stats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;