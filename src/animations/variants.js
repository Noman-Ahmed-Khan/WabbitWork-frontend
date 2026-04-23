/**
 * Framer Motion animation variants
 * Centralized animation definitions for consistent, reusable animations
 */

// Modern Brutalist Easing (snappy start, smooth finish)
const brutalEase = [0.23, 1, 0.32, 1]
const bounceEase = [0.175, 0.885, 0.32, 1.275]

// Page transition variants - "Building" effect
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    rotateX: 2,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: brutalEase,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    rotateX: -2,
    scale: 1.02,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 1, 1],
    },
  },
}

// Shutter/Wipe variants for high-impact transitions
export const shutterVariants = {
  initial: { height: "100%" },
  animate: { 
    height: "0%",
    transition: { duration: 0.8, ease: brutalEase }
  },
  exit: { 
    height: "100%",
    transition: { duration: 0.6, ease: [0.4, 0, 1, 1] }
  }
}

// Modal/Overlay variants
export const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    rotate: -1,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: brutalEase,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

// Backdrop variants
export const backdropVariants = {
  initial: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    transition: {
      duration: 0.3,
    },
  },
}

// Card/Panel variants
export const cardVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: brutalEase,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    transition: {
      duration: 0.3,
    },
  },
}

// Container with staggered children
export const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

// List item variants (Physical feel)
export const itemVariants = {
  initial: {
    opacity: 0,
    y: 15,
    x: -5,
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: 0.4,
      ease: brutalEase,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
  hover: {
    y: -4,
    x: 2,
    transition: {
      duration: 0.3,
      ease: bounceEase,
    },
  },
}

// Button variants (Physical "Mass")
export const buttonVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
  },
  hover: {
    scale: 1.02,
    y: -2,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      ease: brutalEase,
    },
  },
  tap: {
    scale: 0.98,
    y: 1,
    boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.1,
    },
  },
}

// Badge variants
export const badgeVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
    },
  },
}

// Spinner/Loading variants
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Pulse variants (for loading states)
export const pulseVariants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Success/Error animations
export const successVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    y: -10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
}

// Shake animation (for errors)
export const shakeVariants = {
  animate: {
    x: [-5, 5, -5, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
}

// Slide in animations
export const slideInVariants = {
  left: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  right: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  up: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  down: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
}

// Expand/Collapse variants
export const expandVariants = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}
