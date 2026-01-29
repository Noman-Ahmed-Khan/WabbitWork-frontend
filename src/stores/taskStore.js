import { create } from 'zustand'
import tasksApi from '../api/tasks'
import dashboardApi from '../api/dashboard'

/**
 * Task management store
 * Handles tasks state and filtering
 * 
 * @module stores/taskStore
 */
const useTaskStore = create((set, get) => ({
  // State
  tasks: [],
  dashboardStats: null,
  loading: false,
  error: null,
  
  // Filters
  filters: {
    search: '',
    team_id: '',
    status: '',
    priority: '',
    assigned_to: '',
    assigned_to_me: false,
  },

  // Setters
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  /**
   * Set filters (merge with existing)
   * @param {Object} filters - Filter object
   */
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
  },

  /**
   * Reset all filters to default
   */
  resetFilters: () => {
    set({
      filters: {
        search: '',
        team_id: '',
        status: '',
        priority: '',
        assigned_to: '',
        assigned_to_me: false,
      }
    })
  },

  // Actions
  /**
   * Load tasks with current filters
   */
  loadTasks: async () => {
    try {
      set({ loading: true, error: null })
      const { filters } = get()
      
      // Build params from filters
      const params = {}
      if (filters.search) params.search = filters.search
      if (filters.team_id) params.team_id = filters.team_id
      if (filters.status) params.status = filters.status
      if (filters.priority) params.priority = filters.priority
      if (filters.assigned_to) params.assigned_to = filters.assigned_to
      if (filters.assigned_to_me) params.assigned_to_me = true

      const response = await tasksApi.getAll(params)
      set({ tasks: response.data.tasks, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Load dashboard statistics
   */
  loadDashboardStats: async () => {
    try {
      set({ loading: true, error: null })
      const response = await dashboardApi.getStats()
      set({ dashboardStats: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Create new task
   * @param {Object} data - Task data
   */
  createTask: async (data) => {
    try {
      set({ loading: true, error: null })
      await tasksApi.create(data)
      await get().loadTasks()
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} data - Updated task data
   */
  updateTask: async (id, data) => {
    try {
      set({ loading: true, error: null })
      await tasksApi.update(id, data)
      await get().loadTasks()
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Delete task
   * @param {string} id - Task ID
   */
  deleteTask: async (id) => {
    try {
      set({ loading: true, error: null })
      await tasksApi.delete(id)
      await get().loadTasks()
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
      throw error
    }
  },

  /**
   * Reset store to initial state
   */
  reset: () => set({
    tasks: [],
    dashboardStats: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      team_id: '',
      status: '',
      priority: '',
      assigned_to: '',
      assigned_to_me: false,
    },
  }),
}))

export default useTaskStore