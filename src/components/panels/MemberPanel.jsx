import { useState } from 'react'
import { User, UserMinus, Save, Shield, Crown, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import Select from '../primitives/Select'
import tokens from '../../theme/tokens'
import { itemVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

/**
 * Single team member card
 * Displays member info with role management and removal options
 */
export default function MemberPanel({ 
  member, 
  currentUserRole,
  currentUserId,
  onUpdateRole,
  onRemove,
  loading = false,
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [selectedRole, setSelectedRole] = useState(member.role)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  const roleConfig = tokens.role?.[member.role] || { color: 'ghost', label: member.role }
  const isCurrentUser = member.user_id === currentUserId
  const isOwner = member.role === 'owner'
  
  // Admins and owners can manage members (but not owners, and not themselves)
  const canManageRole = (currentUserRole === 'owner' || currentUserRole === 'admin') 
    && !isCurrentUser 
    && !isOwner
  
  // Admins/owners can remove members, or user can leave themselves (if not owner)
  const canRemove = (
    ((currentUserRole === 'owner' || currentUserRole === 'admin') && !isCurrentUser && !isOwner) 
    || (isCurrentUser && !isOwner)
  )

  // Get role icon
  const getRoleIcon = (role, size = 14) => {
    switch (role) {
      case 'owner':
        return <Crown size={size} className="text-warning" />
      case 'admin':
        return <Shield size={size} className="text-info" />
      default:
        return <User size={size} className="text-base-content/50" />
    }
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'owner':
        return 'warning'
      case 'admin':
        return 'info'
      default:
        return 'ghost'
    }
  }

  const handleRoleChange = async () => {
    if (selectedRole === member.role) return
    
    setIsUpdating(true)
    try {
      await onUpdateRole(member.id, selectedRole)
    } catch (error) {
      // Reset to original role on error
      setSelectedRole(member.role)
      console.error('Failed to update role:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    const confirmMessage = isCurrentUser 
      ? 'Are you sure you want to leave this team?' 
      : `Remove ${member.first_name} ${member.last_name} from the team?`
    
    if (!confirm(confirmMessage)) return

    setIsRemoving(true)
    try {
      await onRemove(member.id, isCurrentUser)
    } catch (error) {
      console.error('Failed to remove member:', error)
    } finally {
      setIsRemoving(false)
    }
  }

  // Reset selected role when member prop changes
  if (selectedRole !== member.role && !isUpdating) {
    setSelectedRole(member.role)
  }

  // Get initials
  const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase()

  return (
    <motion.div 
      className="card bg-base-100 border border-base-300 hover:border-base-content/20 transition-colors"
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -2 }}
      transition={transitions.normal}
      layout
    >
      <div className="card-body p-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <motion.div 
            className="avatar placeholder flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-10 h-10 rounded-full ${
              isOwner 
                ? 'bg-warning/20 text-warning' 
                : member.role === 'admin' 
                  ? 'bg-info/20 text-info'
                  : 'bg-primary/20 text-primary'
            }`}>
              {member.avatar_url ? (
                <img 
                  src={member.avatar_url} 
                  alt={`${member.first_name} ${member.last_name}`}
                  className="rounded-full"
                />
              ) : (
                <span className="text-sm font-bold">{initials}</span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-sm flex items-center gap-2">
              <span className="truncate">
                {member.first_name} {member.last_name}
              </span>
              {isCurrentUser && (
                <motion.span 
                  className="badge badge-ghost badge-xs"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={transitions.normal}
                >
                  You
                </motion.span>
              )}
            </h3>
            <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
              <User size={10} />
              {member.email}
            </p>
            {member.joined_at && (
              <p className="text-xs text-base-content/40 mt-0.5">
                Joined {new Date(member.joined_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Role Management */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {canManageRole ? (
              <div className="flex items-center gap-2">
                {/* Role Dropdown */}
                <div className="dropdown dropdown-end">
                  <motion.label 
                    tabIndex={0} 
                    className="btn btn-ghost btn-sm gap-1 normal-case"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {getRoleIcon(selectedRole, 14)}
                    <span className="capitalize hidden sm:inline">{selectedRole}</span>
                    <ChevronDown size={12} />
                  </motion.label>
                  <ul 
                    tabIndex={0} 
                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-40 border border-base-300"
                  >
                    <li>
                      <button 
                        onClick={() => setSelectedRole('admin')}
                        className={selectedRole === 'admin' ? 'active' : ''}
                      >
                        <Shield size={14} className="text-info" />
                        Admin
                        {selectedRole === 'admin' && <span className="text-xs">✓</span>}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setSelectedRole('member')}
                        className={selectedRole === 'member' ? 'active' : ''}
                      >
                        <User size={14} />
                        Member
                        {selectedRole === 'member' && <span className="text-xs">✓</span>}
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Save button (only show if role changed) */}
                <AnimatePresence>
                  {selectedRole !== member.role && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: 'auto' }}
                      exit={{ opacity: 0, scale: 0.8, width: 0 }}
                      transition={transitions.fast}
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleRoleChange}
                        loading={isUpdating}
                        title="Save role change"
                      >
                        <Save size={12} />
                        <span className="hidden sm:inline">Save</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Role Badge (non-editable) */
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                  {getRoleIcon(member.role, 12)}
                  <span className="capitalize">{member.role}</span>
                </Badge>
              </motion.div>
            )}

            {/* Remove/Leave button */}
            {canRemove && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  loading={isRemoving}
                  className={`${isCurrentUser ? 'text-warning hover:bg-warning/10' : 'text-error hover:bg-error/10'}`}
                  title={isCurrentUser ? 'Leave team' : 'Remove member'}
                >
                  <UserMinus size={14} />
                  <span className="hidden sm:inline">
                    {isCurrentUser ? 'Leave' : 'Remove'}
                  </span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}