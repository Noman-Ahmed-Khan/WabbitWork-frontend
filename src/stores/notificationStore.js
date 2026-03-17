import { create } from 'zustand'
import notificationsApi from '../api/notifications'

/**
 * Notification store using Zustand
 * Manages notifications with real-time count updates
 * 
 * @module stores/notificationStore
 */
const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  preferences: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },

  // Setters
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setPreferences: (preferences) => set({ preferences }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Actions

  /**
   * Fetch unread count
   */
  fetchUnreadCount: async () => {
    try {
      const response = await notificationsApi.getUnreadCount()
      set({ unreadCount: response.data.count })
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  },

  /**
   * Fetch notifications with pagination
   * @param {Object} params - Query parameters
   */
  fetchNotifications: async (params = {}) => {
    try {
      set({ loading: true, error: null })
      const response = await notificationsApi.getAll(params)
      
      const { notifications, pagination } = response.data
      
      set({ 
        notifications,
        pagination,
        loading: false 
      })
      
      return response
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  /**
   * Load more notifications (infinite scroll)
   */
  loadMore: async () => {
    const { pagination, notifications: current } = get()
    
    if (!pagination.hasMore) return
    
    try {
      const response = await notificationsApi.getAll({
        page: pagination.page + 1,
        limit: pagination.limit,
      })
      
      const { notifications: newNotifications, pagination: newPagination } = response.data
      
      set({ 
        notifications: [...current, ...newNotifications],
        pagination: newPagination,
      })
    } catch (error) {
      console.error('Failed to load more notifications:', error)
    }
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   */
  markAsRead: async (id) => {
    try {
      await notificationsApi.markAsRead(id)
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
    } catch (error) {
      console.error('Failed to mark as read:', error)
      throw error
    }
  },

  /**
   * Mark notification as unread
   * @param {string} id - Notification ID
   */
  markAsUnread: async (id) => {
    try {
      await notificationsApi.markAsUnread(id)
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, is_read: false, read_at: null } : n
        ),
        unreadCount: state.unreadCount + 1,
      }))
    } catch (error) {
      console.error('Failed to mark as unread:', error)
      throw error
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead()
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        })),
        unreadCount: 0,
      }))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      throw error
    }
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   */
  deleteNotification: async (id) => {
    try {
      await notificationsApi.delete(id)
      
      // Update local state
      set(state => {
        const notification = state.notifications.find(n => n.id === id)
        return {
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: notification && !notification.is_read 
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        }
      })
    } catch (error) {
      console.error('Failed to delete notification:', error)
      throw error
    }
  },

  /**
   * Delete all notifications
   */
  deleteAll: async () => {
    try {
      await notificationsApi.deleteAll()
      
      set({ 
        notifications: [],
        unreadCount: 0,
      })
    } catch (error) {
      console.error('Failed to delete all notifications:', error)
      throw error
    }
  },

  /**
   * Fetch notification preferences
   */
  fetchPreferences: async () => {
    try {
      const response = await notificationsApi.getPreferences()
      set({ preferences: response.data.preferences })
      return response
    } catch (error) {
      console.error('Failed to fetch preferences:', error)
      throw error
    }
  },

  /**
   * Update notification preferences
   * @param {Object} preferences - Preferences to update
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await notificationsApi.updatePreferences(preferences)
      set({ preferences: response.data.preferences })
      return response
    } catch (error) {
      console.error('Failed to update preferences:', error)
      throw error
    }
  },

  /**
   * Add new notification (for real-time updates)
   * @param {Object} notification - New notification
   */
  addNotification: (notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  /**
   * Reset store to initial state
   */
  reset: () => set({
    notifications: [],
    unreadCount: 0,
    preferences: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: true,
    },
  }),
}))

export default useNotificationStore
