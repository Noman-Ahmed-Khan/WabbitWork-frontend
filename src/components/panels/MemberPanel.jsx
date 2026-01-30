import { User, UserMinus, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import Select from '../primitives/Select'
import { useState } from 'react'
import tokens from '../../theme/tokens'
import { itemVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

export default function MemberPanel({ 
  member, 
  currentUserRole,
  currentUserId,
  onUpdateRole,
  onRemove 
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedRole, setSelectedRole] = useState(member.role)

  const roleConfig = tokens.role[member.role]
  const isCurrentUser = member.user_id === currentUserId
  const canManage = currentUserRole === 'owner' && !isCurrentUser && member.role !== 'owner'

  const handleRoleChange = async () => {
    if (selectedRole === member.role) return
    
    setIsUpdating(true)
    try {
      await onUpdateRole(member.id, selectedRole)
    } finally {
      setIsUpdating(false)
    }
  }

  // Get initials
  const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`

  return (
    <motion.div 
      className="card bg-base-100 border border-base-300"
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -2 }}
      transition={transitions.normal}
    >
      <div className="card-body p-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <motion.div 
            className="avatar placeholder"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 rounded-full bg-primary text-primary-content">
              <span className="text-sm font-bold">{initials}</span>
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-sm flex items-center gap-2">
              {member.first_name} {member.last_name}
              {isCurrentUser && (
                <motion.span 
                  className="text-xs text-base-content/60"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transitions.normal}
                >
                  (You)
                </motion.span>
              )}
            </h3>
            <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
              <User size={10} />
              {member.email}
            </p>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            {canManage ? (
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    options={[
                      { value: 'admin', label: 'Admin' },
                      { value: 'member', label: 'Member' },
                    ]}
                    className="select-sm w-28"
                  />
                </motion.div>
                {selectedRole !== member.role && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={transitions.normal}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRoleChange}
                      loading={isUpdating}
                    >
                      <Save size={12} />
                    </Button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant={roleConfig.color} size="sm">
                  {roleConfig.label}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Remove button */}
          {((currentUserRole === 'owner' || currentUserRole === 'admin') && !isCurrentUser && member.role !== 'owner') || isCurrentUser ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(member.id)}
                className="text-error hover:bg-error/10"
              >
                <UserMinus size={14} />
                {isCurrentUser ? 'Leave' : 'Remove'}
              </Button>
            </motion.div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}