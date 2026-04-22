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
      className="bg-surface-container-low/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transform-gpu will-change-transform transition-[transform,box-shadow,background-color] duration-300 ease-out relative group overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="pointer-events-none absolute inset-0 z-20 translate-y-1 scale-[0.99] opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-80 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100">
        <div className="absolute inset-0 bg-surface-container-high/80 backdrop-blur-lg" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="space-y-3 pr-10">
            <span className="block text-[10px] font-black uppercase tracking-[0.28em] text-on-surface/80">
              Quick Preview
            </span>
            <h4 className="font-headline text-xl font-black uppercase tracking-tighter leading-tight text-on-surface break-words line-clamp-3">
              {team.name}
            </h4>
            {team.description ? (
              <p className="text-sm text-on-surface/95 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto pr-2">
                {team.description}
              </p>
            ) : (
              <p className="text-sm text-on-surface/80 leading-relaxed">
                No description provided for this team.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Editorial Role Tag */}
      <div className="absolute top-0 right-6 -translate-y-1/2">
         <Badge variant={roleConfig.color} size="sm">
            {roleConfig.label}
         </Badge>
      </div>

      {/* Header */}
      <div className="mb-6 relative z-10 transition-opacity duration-150 ease-out group-hover:opacity-0 group-focus-within:opacity-0">
        <h3 className="font-headline font-black text-xl uppercase tracking-tighter leading-tight mb-2 group-hover:text-tertiary transition-colors break-words line-clamp-2">
          {team.name}
        </h3>
        {team.description && (
          <p className="text-sm font-body text-on-surface-variant/80 line-clamp-2 leading-relaxed break-words">
            {team.description}
          </p>
        )}
      </div>

      {/* Stats bento row */}
      <div className="flex flex-wrap gap-4 mb-8 pt-6 border-t border-stone-200/50 relative z-10">
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
      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity relative z-10">
         <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onView(team)}
              className="px-4 py-2 bg-black text-white text-[10px] font-headline font-black uppercase tracking-widest active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
            >
              Enter Hub
            </button>
            <button
              type="button"
              onClick={() => onManageMembers(team)}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              title="Manage members"
              aria-label={`Manage members for ${team.name}`}
            >
              <span className="material-symbols-outlined text-xl">manage_accounts</span>
            </button>
         </div>

         {(team.role === 'owner' || team.role === 'admin') && (
            <div className="flex items-center gap-1">
               <button
                 type="button"
                 onClick={() => onEdit(team)}
                 className="p-2 rounded-lg hover:bg-stone-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                 title="Edit Team"
                 aria-label={`Edit ${team.name}`}
               >
                 <span className="material-symbols-outlined text-xl">edit_note</span>
               </button>
               {team.role === 'owner' && (
                 <button
                   type="button"
                   onClick={() => onDelete(team.id)}
                   className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                   title="Delete Team"
                   aria-label={`Delete ${team.name}`}
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
