import { Users, CheckSquare, Eye, Edit, Trash2, UserCog } from 'lucide-react'
import { motion } from 'framer-motion'
import Badge from '../primitives/Badge'
import Button from '../primitives/Button'
import tokens from '../../theme/tokens'
import { itemVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

export default function TeamPanel({ team, onView, onEdit, onDelete, onManageMembers }) {
  const roleConfig = tokens.role[team.role]

  return (
    <motion.div 
      className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -2 }}
      transition={transitions.normal}
    >
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant={roleConfig.color} size="sm">
              {roleConfig.label}
            </Badge>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3">
          <motion.div 
            className="flex items-center gap-2 text-xs"
            whileHover={{ scale: 1.05 }}
          >
            <Users size={14} className="text-base-content/60" />
            <span className="font-medium">{team.member_count}</span>
            <span className="text-base-content/60">members</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2 text-xs"
            whileHover={{ scale: 1.05 }}
          >
            <CheckSquare size={14} className="text-base-content/60" />
            <span className="font-medium">{team.task_count}</span>
            <span className="text-base-content/60">tasks</span>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="card-actions justify-end gap-1 flex-wrap">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(team)}
            >
              <Eye size={14} />
              View
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onManageMembers(team)}
            >
              <UserCog size={14} />
              Members
            </Button>
          </motion.div>
          {(team.role === 'owner' || team.role === 'admin') && (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(team)}
                >
                  <Edit size={14} />
                  Edit
                </Button>
              </motion.div>
              {team.role === 'owner' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(team.id)}
                    className="text-error hover:bg-error/10"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}