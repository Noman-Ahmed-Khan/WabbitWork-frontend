import { useState } from 'react'
import { X, Send, Mail, Shield, MessageSquare, Users2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useInvitationStore from '../../stores/invitationStore'
import Panel from '../../layouts/Panel'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'

/**
 * Invite member overlay modal
 */
export default function InvitationOverlay({
  team = null,
  teams = [],
  defaultTeamId = '',
  onClose,
  onSuccess,
}) {
  const initialTeamId = team?.id || defaultTeamId || (teams.length === 1 ? teams[0].id : '')

  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: '',
    team_id: initialTeamId,
  })
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState('')

  const { createInvitation, loading, error, clearError } = useInvitationStore()
  const selectedTeam = team || teams.find(t => t.id === formData.team_id) || null
  const teamOptions = teams.map((t) => ({
    value: t.id,
    label: t.name,
  }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setValidationError('')
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    try {
      const targetTeamId = team?.id || formData.team_id
      const targetTeam = team || teams.find(t => t.id === targetTeamId) || null

      if (!targetTeamId || !targetTeam) {
        setValidationError('Please choose a team first.')
        return
      }

      await createInvitation(targetTeamId, {
        email: formData.email,
        role: formData.role,
        message: formData.message,
      })

      setSuccess(true)

      Promise.resolve(onSuccess?.(targetTeam)).catch((handlerError) => {
        console.error('Invitation success handler failed:', handlerError)
      })

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
          className="w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <Panel>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">Invite to Team</h2>
                <p className="text-sm text-base-content/60">
                  {selectedTeam?.name || 'Choose a team to continue'}
                </p>
              </div>
              <button
                type="button"
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
                  {selectedTeam?.name ? ` for ${selectedTeam.name}` : ''}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!team && (
                  <div>
                    <label className="label">
                      <span className="label-text flex items-center gap-2">
                        <Users2 size={14} />
                        Team
                      </span>
                    </label>
                    <Select
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleChange}
                      options={teamOptions}
                      placeholder={teamOptions.length > 0 ? 'Choose a team' : 'No teams available'}
                      disabled={teamOptions.length === 0}
                    />
                  </div>
                )}

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
                {(error || validationError) && (
                  <div className="alert alert-error text-sm py-2">
                    {error || validationError}
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
                    disabled={loading || (!team && (!selectedTeam || teamOptions.length === 0))}
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
