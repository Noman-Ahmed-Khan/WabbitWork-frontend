import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import tokens from '../../theme/tokens'

export default function TeamPanel({ team, onView, onEdit, onDelete, onManageMembers }) {
  const roleConfig = tokens.role[team.role]

  return (
    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate mb-1">{team.name}</h3>
            {team.description && (
              <p className="text-sm text-base-content/60 line-clamp-2">
                {team.description}
              </p>
            )}
          </div>
          <Badge variant={roleConfig.color} size="sm">
            {roleConfig.label}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base-content/60">👥</span>
            <span className="font-medium">{team.member_count}</span>
            <span className="text-base-content/60">members</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base-content/60">✓</span>
            <span className="font-medium">{team.task_count}</span>
            <span className="text-base-content/60">tasks</span>
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(team)}
          >
            View Tasks
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onManageMembers(team)}
          >
            Members
          </Button>
          {(team.role === 'owner' || team.role === 'admin') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(team)}
              >
                Edit
              </Button>
              {team.role === 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(team.id)}
                  className="text-error hover:bg-error/10"
                >
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