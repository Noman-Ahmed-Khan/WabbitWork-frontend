import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * UI state store using Zustand
 * Manages theme toggle, overlays, and global UI state
 */
const useUIStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'light',
      kineticFx: true,
      activeOverlay: null,
      overlayData: null,
      sidebarOpen: false,
      notifications: [],

      // Theme Actions
      setTheme: (theme) => {
        const root = window.document.documentElement
        const daisyTheme = theme === 'dark' ? 'brutalist-dark' : 'brutalist'
        
        // Sync DaisyUI theme
        root.setAttribute('data-theme', daisyTheme)
        
        // Sync Tailwind dark mode class
        if (theme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
        
        set({ theme })
      },

      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },

      initializeTheme: () => {
        const { theme } = get()
        get().setTheme(theme)
      },

      // Kinetic FX toggle
      toggleKineticFx: () => {
        set((state) => ({ kineticFx: !state.kineticFx }))
      },

      // Overlay Actions
      openOverlay: (name, data = null) => {
        set({ activeOverlay: name, overlayData: data })
      },

      closeOverlay: () => {
        set({ activeOverlay: null, overlayData: null })
      },

      updateOverlayData: (data) => {
        set({ overlayData: data })
      },

      // Sidebar Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      // Toast Notification Actions
      addNotification: (notification) => {
        const id = Date.now()
        set((state) => ({
          notifications: [
            ...state.notifications,
            { id, ...notification }
          ]
        }))
        
        setTimeout(() => {
          get().removeNotification(id)
        }, 5000)
        
        return id
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        kineticFx: state.kineticFx,
      }),
    }
  )
)

export default useUIStore