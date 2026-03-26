/**
 * Animation variants for Auth views
 * Funky brutalist transitions
 */

// Card entrance/exit with 3D flip
export const cardVariants = {
  initial: { 
    scale: 0.92, 
    opacity: 0, 
    rotateX: -10,
    y: 40
  },
  animate: { 
    scale: 1, 
    opacity: 1, 
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    scale: 0.92, 
    opacity: 0, 
    rotateX: 10,
    y: -40,
    transition: {
      duration: 0.35
    }
  }
}

// Staggered form container
export const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1
    }
  }
}

// Form items slide with blur
export const formItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -20, 
    filter: 'blur(8px)' 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.35, 
      ease: [0.16, 1, 0.3, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    filter: 'blur(8px)',
    transition: { duration: 0.25 }
  }
}

// Glitch reveal for name fields
export const glitchRevealVariants = {
  hidden: { 
    opacity: 0, 
    scaleY: 0,
    clipPath: 'inset(50% 0 50% 0)'
  },
  visible: { 
    opacity: 1, 
    scaleY: 1,
    clipPath: 'inset(0% 0 0% 0)',
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    scaleY: 0,
    clipPath: 'inset(50% 0 50% 0)',
    transition: { duration: 0.25 }
  }
}

// Password requirements
export const requirementsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 }
  }
}

export const requirementItemVariants = {
  hidden: { opacity: 0, x: -8, scale: 0.9 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 8, scale: 0.9 }
}

// Social buttons
export const socialContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 }
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.04, staggerDirection: -1 }
  }
}

export const socialItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 }
}

// Title flip
export const titleVariants = {
  initial: { y: 30, opacity: 0, rotateX: -45 },
  animate: { 
    y: 0, 
    opacity: 1, 
    rotateX: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    y: -30, 
    opacity: 0, 
    rotateX: 45,
    transition: { duration: 0.25 }
  }
}

// Icon spin
export const iconVariants = {
  initial: { scale: 0, rotate: -90 },
  animate: { 
    scale: 1, 
    rotate: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  },
  exit: { 
    scale: 0, 
    rotate: 90,
    transition: { duration: 0.25 }
  }
}

// Watermark
export const watermarkVariants = {
  initial: { opacity: 0, scale: 0.9, x: -30 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    x: 0,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0, 
    scale: 1.1, 
    x: 30,
    transition: { duration: 0.25 }
  }
}