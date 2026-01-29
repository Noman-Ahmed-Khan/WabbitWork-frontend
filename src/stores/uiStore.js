import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * UI state store using Zustand
 * Manages theme, overlays, and global UI state
 * 
 * @module stores/uiStore
 */
const useUIStore = create(
  persist(
    (set, get) => ({
      // State
      theme: 'light',
      activeOverlay: null,
      overlayData: null,
      sidebarOpen: false,
      notifications: [],

      // Theme Actions
      /**
       * Set theme
       * @param {string} theme - Theme name ('light' or 'dark')
       */
      setTheme: (theme) => {
        set({ theme })
        document.documentElement.setAttribute('data-theme', theme)
      },

      /**
       * Toggle between light and dark theme
       */
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'light' ? 'dark' : 'light'
        get().setTheme(newTheme)
      },

      /**
       * Initialize theme from stored value
       * Called on app mount
       */
      initializeTheme: () => {
        const { theme } = get()
        document.documentElement.setAttribute('data-theme', theme)
      },

      // Overlay Actions
      /**
       * Open overlay with optional data
       * @param {string} name - Overlay name
       * @param {Object} data - Optional data to pass to overlay
       */
      openOverlay: (name, data = null) => {
        set({ activeOverlay: name, overlayData: data })
      },

      /**
       * Close active overlay
       */
      closeOverlay: () => {
        set({ activeOverlay: null, overlayData: null })
      },

      /**
       * Update overlay data
       * @param {Object} data - New data
       */
      updateOverlayData: (data) => {
        set({ overlayData: data })
      },

      // Sidebar Actions
      /**
       * Toggle sidebar open/closed
       */
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      /**
       * Set sidebar state
       * @param {boolean} open - Open state
       */
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },

      // Notification Actions
      /**
       * Add notification
       * @param {Object} notification - Notification object
       * @param {string} notification.message - Notification message
       * @param {string} notification.type - Notification type (success, error, warning, info)
       * @returns {number} Notification ID
       */
      addNotification: (notification) => {
        const id = Date.now()
        set((state) => ({
          notifications: [
            ...state.notifications,
            { id, ...notification }
          ]
        }))
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id)
        }, 5000)
        
        return id
      },

      /**
       * Remove notification by ID
       * @param {number} id - Notification ID
       */
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },

      /**
       * Clear all notifications
       */
      clearNotifications: () => {
        set({ notifications: [] })
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ 
        theme: state.theme 
      }),
    }
  )
)

export default useUIStore