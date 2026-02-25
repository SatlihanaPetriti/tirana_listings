import { Routes, Route } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar from './components/Navbar'
import ListingsPage from './pages/ListingsPage'
import DetailPage from './pages/DetailPage'
import ComparePage from './pages/ComparePage'

export default function App() {
  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col" style={{ background: '#07111f', color: '#e8f4fd' }}>
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<ListingsPage />} />
            <Route path="/listings/:id"  element={<DetailPage />} />
            <Route path="/compare"       element={<ComparePage />} />
          </Routes>
        </main>
      </div>
    </FavoritesProvider>
  )
}
