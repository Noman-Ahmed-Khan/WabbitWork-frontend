import { createContext, useContext, useState, useEffect } from 'react'

const UIContext = createContext(null)

/**
 * UI state management
 * Handles theme, overlays, and global UI state
 */
export function UIProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [activeOverlay, setActiveOverlay] = useState(null)
  const [overlayData, setOverlayData] = useState(null)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const openOverlay = (name, data = null) => {
    setActiveOverlay(name)
    setOverlayData(data)
  }

  const closeOverlay = () => {
    setActiveOverlay(null)
    setOverlayData(null)
  }

  const value = {
    theme,
    toggleTheme,
    activeOverlay,
    overlayData,
    openOverlay,
    closeOverlay,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within UIProvider')
  }
  return context
}