import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import Select from '../primitives/Select'
import { useState } from 'react'
import tokens from '../../theme/tokens'

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

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar placeholder">
            <div className="w-12 rounded-full bg-primary text-primary-content">
              <span className="text-lg font-bold">
                {member.first_name?.[0]}{member.last_name?.[0]}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {member.first_name} {member.last_name}
              {isCurrentUser && <span className="text-xs ml-2 text-base-content/60">(You)</span>}
            </h3>
            <p className="text-sm text-base-content/60 truncate">{member.email}</p>
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            {canManage ? (
              <div className="flex items-center gap-2">
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'member', label: 'Member' },
                  ]}
                  className="select-sm w-32"
                />
                {selectedRole !== member.role && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRoleChange}
                    loading={isUpdating}
                  >
                    Update
                  </Button>
                )}
              </div>
            ) : (
              <Badge variant={roleConfig.color}>
                {roleConfig.label}
              </Badge>
            )}
          </div>

          {/* Remove button */}
          {((currentUserRole === 'owner' || currentUserRole === 'admin') && !isCurrentUser && member.role !== 'owner') || isCurrentUser ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(member.id)}
              className="text-error hover:bg-error/10"
            >
              {isCurrentUser ? 'Leave' : 'Remove'}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}