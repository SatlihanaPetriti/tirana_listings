import { createContext, useContext, useState, useEffect } from 'react'

const FavCtx = createContext(null)

export function FavoritesProvider({ children }) {
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tirana_favs') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('tirana_favs', JSON.stringify(favs))
  }, [favs])

  const toggle = (item) => {
    setFavs(prev => {
      const exists = prev.some(f => f.id === item.id)
      return exists ? prev.filter(f => f.id !== item.id) : [...prev, item]
    })
  }

  const isFav = (id) => favs.some(f => f.id === id)

  return (
    <FavCtx.Provider value={{ favs, toggle, isFav }}>
      {children}
    </FavCtx.Provider>
  )
}

export function useFavorites() {
  return useContext(FavCtx)
}
