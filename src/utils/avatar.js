import config from '../config/env'

const ALLOWED_AVATAR_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/avif',
])

const ALLOWED_AVATAR_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'avif',
])

export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024

const getBackendOrigin = () => {
  try {
    return new URL(config.api.baseURL).origin
  } catch {
    return ''
  }
}

export const getUserInitials = (user) => {
  if (!user) return 'U'

  const firstInitial = `${user.first_name || ''}`.trim().charAt(0) || ''
  const lastInitial = `${user.last_name || ''}`.trim().charAt(0) || ''
  const emailInitial = `${user.email || ''}`.trim().charAt(0) || ''

  const initials = `${firstInitial}${lastInitial}` || emailInitial || 'U'
  return initials.toUpperCase()
}

export const resolveAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return ''

  const trimmed = `${avatarUrl}`.trim()
  if (!trimmed) return ''

  if (/^(blob:|data:|https?:)/i.test(trimmed)) {
    return trimmed
  }

  const backendOrigin = getBackendOrigin()
  if (!backendOrigin) {
    return trimmed
  }

  try {
    return new URL(trimmed, backendOrigin).href
  } catch {
    return trimmed
  }
}

const getFileExtension = (fileName = '') => {
  const parts = `${fileName}`.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

export const validateAvatarFile = (file) => {
  if (!file) {
    return 'Choose an image file first.'
  }

  const hasAllowedMimeType = ALLOWED_AVATAR_MIME_TYPES.has(file.type)
  const hasAllowedExtension = ALLOWED_AVATAR_EXTENSIONS.has(getFileExtension(file.name))

  if (!hasAllowedMimeType && !hasAllowedExtension) {
    return 'Use PNG, JPG, JPEG, WEBP, GIF, or AVIF files only.'
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    return 'Avatar images must be 5 MB or smaller.'
  }

  return null
}

export const validateAvatarUrl = (value) => {
  const trimmed = `${value || ''}`.trim()

  if (!trimmed) {
    return 'Enter an avatar image URL.'
  }

  try {
    const parsed = new URL(trimmed)

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return 'Avatar URL must use http or https.'
    }
  } catch {
    return 'Enter a valid avatar image URL.'
  }

  return null
}
