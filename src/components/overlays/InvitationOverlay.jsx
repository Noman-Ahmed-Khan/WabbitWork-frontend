import { useState } from 'react'
import { X, Send, Mail, Shield, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import Panel from '../../layouts/Panel'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'

/**
 * Invite member overlay modal
 */
export default function InvitationOverlay({ team, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: '',
  })
  const [success, setSuccess] = useState(false)

  const { createInvitation, loading, error, clearError } = useInvitationStore()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createInvitation(team.id, formData)
      setSuccess(true)
      
      // Reset form
      setFormData({ email: '', role: 'member', message: '' })
      
      // Close after delay or let user close
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Failed to create invitation:', err)
    }
  }

  const roleOptions = [
    { value: 'member', label: 'Member - Can view and manage tasks' },
    { value: 'admin', label: 'Admin - Can also manage members' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <Panel>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Invite to Team</h2>
                <p className="text-sm text-base-content/60">{team.name}</p>
              </div>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X size={18} />
              </button>
            </div>

            {/* Success state */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Invitation Sent!</h3>
                <p className="text-sm text-base-content/60">
                  An email has been sent to {formData.email}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Mail size={14} />
                      Email Address
                    </span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="colleague@example.com"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Shield size={14} />
                      Role
                    </span>
                  </label>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={roleOptions}
                  />
                </div>

                {/* Personal message (optional) */}
                <div>
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <MessageSquare size={14} />
                      Personal Message (optional)
                    </span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full h-20 text-sm"
                    placeholder="Add a personal note to your invitation..."
                    maxLength={500}
                  />
                  <div className="text-xs text-base-content/50 text-right mt-1">
                    {formData.message.length}/500
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="alert alert-error text-sm py-2">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                  >
                    <Send size={16} />
                    Send Invitation
                  </Button>
                </div>
              </form>
            )}
          </Panel>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}