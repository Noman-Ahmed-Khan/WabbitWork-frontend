/**
 * Utility for conditional class names
 * Simple implementation without external dependencies
 */
export function cx(...classes) {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
    .trim()
}

export default cx