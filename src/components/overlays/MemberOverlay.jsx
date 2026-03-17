import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, Shield, MessageSquare } from 'lucide-react'
import useUIStore from '../../stores/uiStore'
import useInvitationStore from '../../stores/invitationStore'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'
import { modalVariants, backdropVariants, itemVariants, containerVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

/**
 * Member invitation overlay
 * Now uses invitation system instead of direct member addition
 */
export default function MemberOverlay({ teamId, teamName, onSuccess }) {
  const { activeOverlay, closeOverlay } = useUIStore()
  const { createInvitation, loading } = useInvitationStore()
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Safety check for Team ID
    if (!teamId) {
      setError('No team selected. Please try again.')
      return
    }

    try {
      await createInvitation(teamId, formData)
      setSuccess(true)
      
      // Close after showing success
      setTimeout(() => {
        onSuccess?.()
        closeOverlay()
        // Reset form
        setFormData({ email: '', role: 'member', message: '' })
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to send invitation')
    }
  }

  const handleClose = () => {
    closeOverlay()
    setFormData({ email: '', role: 'member', message: '' })
    setError('')
    setSuccess(false)
  }

  return (
    <AnimatePresence mode="wait">
      {/* Check activeOverlay string instead of overlayData properties */}
      {activeOverlay === 'member' && (
        <motion.dialog 
          className="modal modal-open"
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div 
            className="modal-box"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Header */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitions.normal}
            >
              <h3 className="font-bold text-lg">Invite Team Member</h3>
              {teamName && (
                <p className="text-sm text-base-content/60">{teamName}</p>
              )}
            </motion.div>

            {/* Success State */}
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                  <Send size={32} className="text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Invitation Sent!</h3>
                <p className="text-sm text-base-content/60">
                  An invitation has been sent to {formData.email}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                >
                  {/* Email */}
                  <motion.div variants={itemVariants}>
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
                  </motion.div>

                  {/* Role */}
                  <motion.div variants={itemVariants}>
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
                      options={[
                        { value: 'member', label: 'Member - Can view and manage tasks' },
                        { value: 'admin', label: 'Admin - Can also manage members' },
                      ]}
                    />
                  </motion.div>

                  {/* Personal Message (Optional) */}
                  <motion.div variants={itemVariants}>
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
                  </motion.div>

                  {/* Info Box */}
                  <motion.div 
                    variants={itemVariants} 
                    className="bg-base-200 rounded-lg p-3 text-sm text-base-content/70"
                  >
                    <p className="font-medium mb-1">How invitations work:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>An email will be sent to the invited user</li>
                      <li>They must accept the invitation to join</li>
                      <li>Invitations expire after 7 days</li>
                    </ul>
                  </motion.div>

                  {/* Error */}
                  {error && (
                    <motion.div 
                      className="alert alert-error"
                      variants={itemVariants}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span className="text-sm">{error}</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Actions */}
                <motion.div 
                  className="modal-action"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
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
                </motion.div>
              </form>
            )}
          </motion.div>
          
          <form method="dialog" className="modal-backdrop" onClick={handleClose}>
            <button>close</button>
          </form>
        </motion.dialog>
      )}
    </AnimatePresence>
  )
}
