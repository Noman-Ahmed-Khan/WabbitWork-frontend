import { Users, CheckSquare, Eye, Edit, Trash2, UserCog } from 'lucide-react'
import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import tokens from '../../theme/tokens'

export default function TeamPanel({ team, onView, onEdit, onDelete, onManageMembers }) {
  const roleConfig = tokens.role[team.role]

  return (
    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm truncate mb-1">{team.name}</h3>
            {team.description && (
              <p className="text-xs text-base-content/60 line-clamp-2">
                {team.description}
              </p>
            )}
          </div>
          <Badge variant={roleConfig.color} size="sm">
            {roleConfig.label}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <Users size={14} className="text-base-content/60" />
            <span className="font-medium">{team.member_count}</span>
            <span className="text-base-content/60">members</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckSquare size={14} className="text-base-content/60" />
            <span className="font-medium">{team.task_count}</span>
            <span className="text-base-content/60">tasks</span>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions justify-end gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(team)}
          >
            <Eye size={14} />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageMembers(team)}
          >
            <UserCog size={14} />
            Members
          </Button>
          {(team.role === 'owner' || team.role === 'admin') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(team)}
              >
                <Edit size={14} />
                Edit
              </Button>
              {team.role === 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(team.id)}
                  className="text-error hover:bg-error/10"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}