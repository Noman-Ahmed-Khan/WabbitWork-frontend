import { motion } from 'framer-motion'
import Badge from '../primitives/Badge'
import { formatRelativeDate, isOverdue } from '../../utils/formatDate'
import tokens from '../../theme/tokens'

/**
 * Task Panel - Brutalist Editorial Design
 * Simplified typography, Material Symbols, and kinetic interaction
 */
export default function TaskPanel({ task, onEdit, onDelete, showTeam = true }) {
  const statusConfig = tokens.status[task.status] || { color: 'default', label: task.status }
  const priorityConfig = tokens.priority[task.priority] || { color: 'default', label: task.priority }

  return (
    <motion.div 
      className="bg-surface-container-low/50 rounded-xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 relative group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Editorial Priority Tag */}
      <div className="absolute top-0 right-5 -translate-y-1/2">
         <Badge variant={priorityConfig.color} size="sm">
            {priorityConfig.label}
         </Badge>
      </div>

      {/* Header */}
      <div className="mb-4">
        <h3 className="font-headline font-black text-lg uppercase tracking-tight leading-tight mb-1 group-hover:text-tertiary transition-colors">
          {task.title}
        </h3>
        {showTeam && task.team_name && (
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="material-symbols-outlined text-xs">groups</span>
            <span className="text-[10px] font-headline font-bold uppercase tracking-widest">{task.team_name}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm font-body text-on-surface-variant/80 line-clamp-2 mb-5 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-stone-200/50">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">Status</span>
            <div className="flex items-center gap-2">
               <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-tertiary'}`} />
               <span className="text-[10px] font-headline font-bold uppercase tracking-widest">{statusConfig.label}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {task.due_date && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">Deadline</span>
              <div className={`flex items-center gap-1.5 ${isOverdue(task.due_date) && task.status !== 'completed' ? 'text-tertiary' : ''}`}>
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                <span className="text-[10px] font-headline font-bold uppercase tracking-widest">
                   {formatRelativeDate(task.due_date)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignee if exists */}
      {task.assignee_first_name && (
        <div className="flex items-center gap-2 mb-6">
           <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-white">
              <span className="material-symbols-outlined text-xs">person</span>
           </div>
           <span className="text-[10px] font-headline font-bold uppercase tracking-widest">
              {task.assignee_first_name} {task.assignee_last_name}
           </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          title="Edit Task"
        >
          <span className="material-symbols-outlined text-xl">edit_note</span>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
          title="Delete Task"
        >
          <span className="material-symbols-outlined text-xl">delete_outline</span>
        </button>
      </div>
    </motion.div>
  )
}