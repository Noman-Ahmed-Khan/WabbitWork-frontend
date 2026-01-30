import { Calendar, User, Edit, Trash2 } from 'lucide-react'
import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import { formatRelativeDate, isOverdue } from '../../utils/formatDate'
import tokens from '../../theme/tokens'
import cx from '../../utils/cx'

export default function TaskPanel({ task, onEdit, onDelete, showTeam = true }) {
  const statusConfig = tokens.status[task.status]
  const priorityConfig = tokens.priority[task.priority]

  return (
    <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
      <div className="card-body p-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate mb-1">
              {task.title}
            </h3>
            {showTeam && task.team_name && (
              <p className="text-xs text-base-content/60 truncate flex items-center gap-1">
                <User size={10} />
                {task.team_name}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <Badge variant={priorityConfig.color} size="sm">
              {priorityConfig.label}
            </Badge>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-base-content/70 line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        {/* Meta info */}
        <div className="space-y-1 mb-2">
          {/* Status */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base-content/60">Status:</span>
            <Badge variant={statusConfig.color} size="sm">
              {statusConfig.label}
            </Badge>
          </div>

          {/* Assignee */}
          {task.assignee_first_name && (
            <div className="flex items-center gap-2 text-xs">
              <User size={10} className="text-base-content/60" />
              <span className="font-medium">
                {task.assignee_first_name} {task.assignee_last_name}
              </span>
            </div>
          )}

          {/* Due date */}
          {task.due_date && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar size={10} className="text-base-content/60" />
              <span
                className={cx(
                  'font-medium',
                  isOverdue(task.due_date) && task.status !== 'completed' && 'text-error',
                  !isOverdue(task.due_date) && 'text-base-content'
                )}
              >
                {formatRelativeDate(task.due_date)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
          >
            <Edit size={12} />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-error hover:bg-error/10"
          >
            <Trash2 size={12} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}