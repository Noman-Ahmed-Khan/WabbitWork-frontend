import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUIStore from '../../stores/uiStore'
import useTeamStore from '../../stores/teamStore'
import Input from '../primitives/Input'
import Select from '../primitives/Select'
import Button from '../primitives/Button'
import { modalVariants, backdropVariants, itemVariants, containerVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

/**
 * Member invitation overlay
 */
export default function MemberOverlay({ teamId, onSuccess }) {
  // Get activeOverlay from store
  const { activeOverlay, closeOverlay } = useUIStore()
  const { addMember, loading } = useTeamStore()
  
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
  })
  const [error, setError] = useState('')

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
      await addMember(teamId, formData)
      onSuccess?.()
      closeOverlay()
      // Reset form on success
      setFormData({ email: '', role: 'member' }) 
    } catch (err) {
      setError(err.message)
    }
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
            <motion.h3 
              className="font-bold text-lg mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transitions.normal}
            >
              Add Team Member
            </motion.h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={itemVariants}>
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="member@example.com"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={[
                      { value: 'member', label: 'Member' },
                      { value: 'admin', label: 'Admin' },
                    ]}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="text-sm text-base-content/60">
                  <p className="mb-2 font-medium">Role permissions:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Member:</strong> Can view and create tasks</li>
                    <li><strong>Admin:</strong> Can manage members and tasks</li>
                  </ul>
                </motion.div>

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
                  onClick={closeOverlay}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Add Member
                </Button>
              </motion.div>
            </form>
          </motion.div>
          <form method="dialog" className="modal-backdrop" onClick={closeOverlay}>
            <button>close</button>
          </form>
        </motion.dialog>
      )}
    </AnimatePresence>
  )
}
