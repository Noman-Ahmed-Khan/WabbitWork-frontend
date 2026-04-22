import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useAuthStore from '../../stores/authStore'
import ProfileAvatar from './ProfileAvatar'
import {
  MAX_AVATAR_SIZE_BYTES,
  validateAvatarFile,
} from '../../utils/avatar'

export default function AvatarUploader({ className = '' }) {
  const user = useAuthStore((state) => state.user)
  const updateAvatar = useAuthStore((state) => state.updateAvatar)
  const removeAvatar = useAuthStore((state) => state.removeAvatar)

  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (user?.avatar_url) {
      setPreviewUrl('')
    }
  }, [user?.avatar_url])

  const clearInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openPicker = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const input = event.currentTarget
    const file = input.files?.[0]

    setError('')
    setSuccess('')

    if (!file) {
      clearInput()
      return
    }

    const validationError = validateAvatarFile(file)
    if (validationError) {
      setError(validationError)
      clearInput()
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setIsSaving(true)

    try {
      await updateAvatar({ file })
      setPreviewUrl('')
      setSuccess('Avatar updated successfully.')
    } catch (uploadError) {
      setPreviewUrl('')
      setError(uploadError.message || 'Failed to update avatar.')
    } finally {
      setIsSaving(false)
      clearInput()
    }
  }

  const handleRemove = async () => {
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      await removeAvatar()
      setPreviewUrl('')
      setSuccess('Avatar removed.')
    } catch (removeError) {
      setError(removeError.message || 'Failed to remove avatar.')
    } finally {
      setIsSaving(false)
    }
  }

  const canRemove = Boolean(user?.avatar_url) && !isSaving
  const displayUser = previewUrl ? { ...user, avatar_url: previewUrl } : user

  return (
    <section className={`rounded-none border-2 border-on-surface bg-surface-container-lowest p-4 md:p-6 shadow-sm ${className}`}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-outline">
              Profile Avatar
            </p>
            <h4 className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface italic">
              Click to change
            </h4>
            <p className="mt-2 text-xs font-medium text-on-surface-variant max-w-xl">
              Hover the image for the camera control. PNG, JPG, JPEG, WEBP, GIF, and AVIF up to {Math.round(MAX_AVATAR_SIZE_BYTES / (1024 * 1024))} MB.
            </p>
          </div>

          {canRemove && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isSaving}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-tertiary hover:underline disabled:opacity-40 disabled:no-underline"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Remove avatar
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <motion.button
            type="button"
            onClick={openPicker}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSaving}
            className="group relative shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 rounded-full"
            aria-label="Change profile avatar"
            title="Change profile avatar"
          >
            <ProfileAvatar
              user={displayUser}
              size="xl"
              className="border-4 border-on-surface shadow-brutalist transition-transform duration-200"
              fallbackClassName="text-2xl"
            />

            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100 group-focus-visible:bg-black/45 group-focus-visible:opacity-100">
              {isSaving ? (
                <span className="loading loading-spinner loading-sm text-white" />
              ) : (
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  photo_camera
                </span>
              )}
            </div>
          </motion.button>

          <div className="flex-1 space-y-2 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-outline">
              Upload
            </p>
            <p className="text-sm font-medium text-on-surface-variant">
              Select a new image to upload. The avatar updates immediately after the server confirms the change.
            </p>

            <div
              className="min-h-6"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isSaving && (
                <p className="text-sm font-medium text-on-surface-variant">Uploading avatar...</p>
              )}
              {!isSaving && error && (
                <p className="text-sm font-medium text-tertiary">{error}</p>
              )}
              {!isSaving && !error && success && (
                <p className="text-sm font-medium text-green-700 dark:text-green-300">{success}</p>
              )}
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </section>
  )
}
