import { motion } from 'framer-motion'
import Badge from '../primitives/Badge'
import tokens from '../../theme/tokens'

/**
 * Team Panel - Brutalist Editorial Design
 * Uses bento-style card structure, Material Symbols, and tactical hover
 */
export default function TeamPanel({ team, onView, onEdit, onDelete, onManageMembers }) {
  const roleConfig = tokens.role[team.role] || { color: 'default', label: team.role }

  return (
    <motion.div 
      className="bg-surface-container-low/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 relative group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Editorial Role Tag */}
      <div className="absolute top-0 right-6 -translate-y-1/2">
         <Badge variant={roleConfig.color} size="sm">
            {roleConfig.label}
         </Badge>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-headline font-black text-xl uppercase tracking-tighter leading-tight mb-2 group-hover:text-tertiary transition-colors">
          {team.name}
        </h3>
        {team.description && (
          <p className="text-sm font-body text-on-surface-variant/80 line-clamp-2 leading-relaxed">
            {team.description}
          </p>
        )}
      </div>

      {/* Stats bento row */}
      <div className="flex flex-wrap gap-4 mb-8 pt-6 border-t border-stone-200/50">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">Collaborators</span>
          <div className="flex items-center gap-1.5">
             <span className="material-symbols-outlined text-[16px] text-on-surface-variant">group</span>
             <span className="text-[11px] font-headline font-black uppercase tracking-widest">{team.member_count}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">Assignments</span>
          <div className="flex items-center gap-1.5">
             <span className="material-symbols-outlined text-[16px] text-on-surface-variant">task_alt</span>
             <span className="text-[11px] font-headline font-black uppercase tracking-widest">{team.task_count}</span>
          </div>
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-1">
            <button
              onClick={() => onView(team)}
              className="px-4 py-2 bg-black text-white text-[10px] font-headline font-black uppercase tracking-widest active:scale-95 transition-all"
            >
              Enter Hub
            </button>
            <button
              onClick={() => onManageMembers(team)}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
              title="Manage members"
            >
              <span className="material-symbols-outlined text-xl">manage_accounts</span>
            </button>
         </div>

         {(team.role === 'owner' || team.role === 'admin') && (
            <div className="flex items-center gap-1">
               <button
                 onClick={() => onEdit(team)}
                 className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
                 title="Edit Team"
               >
                 <span className="material-symbols-outlined text-xl">edit_note</span>
               </button>
               {team.role === 'owner' && (
                 <button
                   onClick={() => onDelete(team.id)}
                   className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                   title="Delete Team"
                 >
                   <span className="material-symbols-outlined text-xl">delete_outline</span>
                 </button>
               )}
            </div>
         )}
      </div>
    </motion.div>
  )
}