/**
 * Design tokens for Liquid Morphic design system
 * Works in harmony with DaisyUI themes
 */

export const tokens = {
  // Spacing scale
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },

  // Border radius for morphic design
  radius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },

  // Transparency and glass effect
  opacity: {
    glass: '0.7',
    card: '0.75',
    hover: '0.85',
  },

  // Shadows for depth
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Blur for glass morphism
  blur: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  // Gradient definitions
  gradients: {
    primary: 'radial-gradient(circle at 20% 50%, rgba(37, 52, 63, 0.15) 0%, transparent 50%)',
    secondary: 'radial-gradient(circle at 80% 80%, rgba(191, 201, 209, 0.15) 0%, transparent 50%)',
    accent: 'radial-gradient(circle at 50% 0%, rgba(255, 155, 81, 0.1) 0%, transparent 60%)',
    combined: 'radial-gradient(circle at 20% 50%, rgba(37, 52, 63, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(191, 201, 209, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 0%, rgba(255, 155, 81, 0.08) 0%, transparent 60%)',
  },

  // Animation durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },

  // Status colors (aligned with DaisyUI)
  status: {
    todo: { color: 'info', label: 'To Do' },
    in_progress: { color: 'warning', label: 'In Progress' },
    review: { color: 'secondary', label: 'Review' },
    completed: { color: 'success', label: 'Completed' },
  },

  // Priority colors
  priority: {
    low: { color: 'info', label: 'Low' },
    medium: { color: 'warning', label: 'Medium' },
    high: { color: 'error', label: 'High' },
    urgent: { color: 'error', label: 'Urgent', pulse: true },
  },

  // Role colors
  role: {
    owner: { color: 'primary', label: 'Owner' },
    admin: { color: 'secondary', label: 'Admin' },
    member: { color: 'neutral', label: 'Member' },
  },
}

export default tokens