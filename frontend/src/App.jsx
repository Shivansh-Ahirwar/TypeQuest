import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LessonsPage from './pages/LessonsPage'
import PracticePage from './pages/PracticePage'
import GamesPage from './pages/GamesPage'
import ProgressPage from './pages/ProgressPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '1.5rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
