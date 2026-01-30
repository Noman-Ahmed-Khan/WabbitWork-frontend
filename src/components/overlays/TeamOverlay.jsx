import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUIStore from '../../stores/uiStore'
import useTeamStore from '../../stores/teamStore'
import Input from '../primitives/Input'
import Button from '../primitives/Button'
import { modalVariants, backdropVariants, itemVariants, containerVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

/**
 * Team create/edit overlay
 */
export default function TeamOverlay({ onSuccess }) {
  const { overlayData, closeOverlay } = useUIStore()
  const { createTeam, updateTeam, loading } = useTeamStore()
  
  const isEdit = !!overlayData
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (overlayData) {
      setFormData({
        name: overlayData.name || '',
        description: overlayData.description || '',
      })
    }
  }, [overlayData])

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

    try {
      if (isEdit) {
        await updateTeam(overlayData.id, formData)
      } else {
        await createTeam(formData)
      }
      onSuccess?.()
      closeOverlay()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {overlayData?.type === 'team' && (
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
              {isEdit ? 'Edit Team' : 'Create New Team'}
            </motion.h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={itemVariants}>
                  <Input
                    label="Team Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Development Team"
                    required
                    maxLength={100}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description (Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="What is this team about?"
                    maxLength={500}
                  />
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
                  {isEdit ? 'Update Team' : 'Create Team'}
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