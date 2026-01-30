/**
 * Common transition configurations
 * Reusable transition settings for different animation scenarios
 */

export const transitions = {
  // Fast transitions
  fast: {
    duration: 0.15,
    ease: 'easeOut',
  },

  // Normal/default transitions
  normal: {
    duration: 0.2,
    ease: 'easeOut',
  },

  // Smooth/slower transitions
  smooth: {
    duration: 0.3,
    ease: 'easeOut',
  },

  // Very smooth/slow transitions
  slowSmooth: {
    duration: 0.5,
    ease: 'easeOut',
  },

  // Spring transitions (bouncy)
  spring: {
    type: 'spring',
    damping: 10,
    stiffness: 100,
    mass: 1,
  },

  // Gentle spring
  gentleSpring: {
    type: 'spring',
    damping: 15,
    stiffness: 100,
    mass: 1,
  },

  // Bouncy spring
  bouncySpring: {
    type: 'spring',
    damping: 8,
    stiffness: 120,
    mass: 1,
  },

  // Layout animations
  layout: {
    type: 'spring',
    damping: 20,
    stiffness: 150,
    mass: 0.5,
  },

  // Easing functions
  easing: {
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    linear: [0.25, 0.25, 0.75, 0.75],
  },
}

/**
 * Get a transition config by name
 * @param {string} name - Transition name (fast, normal, smooth, etc.)
 * @returns {object} Transition configuration
 */
export const getTransition = (name = 'normal') => {
  return transitions[name] || transitions.normal
}
