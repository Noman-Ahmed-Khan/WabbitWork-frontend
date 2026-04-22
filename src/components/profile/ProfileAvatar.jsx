import { useEffect, useState } from 'react'
import { getUserInitials, resolveAvatarSrc } from '../../utils/avatar'

const sizeClasses = {
  xs: 'w-7 h-7 text-[9px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-xl',
}

export default function ProfileAvatar({
  user,
  size = 'md',
  className = '',
  imageClassName = '',
  fallbackClassName = '',
  alt,
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const avatarUrl = resolveAvatarSrc(user?.avatar_url)

  useEffect(() => {
    setImageFailed(false)
  }, [avatarUrl])

  const initials = getUserInitials(user)
  const avatarAlt = alt || user?.first_name || user?.last_name || user?.email || 'Profile avatar'

  return (
    <div
      role="img"
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-container-highest ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-label={avatarAlt}
    >
      {avatarUrl && !imageFailed ? (
        <img
          src={avatarUrl}
          alt={avatarAlt}
          className={`h-full w-full object-cover ${imageClassName}`}
          draggable="false"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className={`font-headline font-black uppercase tracking-tighter text-on-surface ${fallbackClassName}`}>
          {initials}
        </span>
      )}
    </div>
  )
}
