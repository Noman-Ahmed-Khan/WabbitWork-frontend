import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resolveAvatarSrc } from '../../utils/avatar'

/**
 * Team Member Card - Brutalist Editorial Design
 * Displays member info with high-impact typography and icon-driven actions
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
  const [showRoleMenu, setShowRoleMenu] = useState(false)

  const isCurrentUser = member.user_id === currentUserId
  const isOwner = member.role === 'owner'
  
  const canManageRole = (currentUserRole === 'owner' || currentUserRole === 'admin') 
    && !isCurrentUser 
    && !isOwner
  
  const canRemove = (
    ((currentUserRole === 'owner' || currentUserRole === 'admin') && !isCurrentUser && !isOwner) 
    || (isCurrentUser && !isOwner)
  )

  const handleRoleChange = async (newRole) => {
    if (newRole === member.role) {
      setShowRoleMenu(false)
      return
    }
    
    setIsUpdating(true)
    setShowRoleMenu(false)
    try {
      await onUpdateRole(member.id, newRole)
    } catch (error) {
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

  const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase()

  return (
    <motion.div 
      className="bg-surface-container-low/50 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 group relative"
      layout
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-black font-headline font-black text-lg uppercase tracking-tighter">
            {member.avatar_url ? (
              <img src={resolveAvatarSrc(member.avatar_url)} alt={member.first_name} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          {isOwner && (
            <div className="absolute -top-1 -right-1 bg-tertiary text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-headline font-black text-base uppercase tracking-tight truncate">
              {member.first_name} {member.last_name}
            </h3>
            {isCurrentUser && (
              <span className="text-[9px] font-black uppercase tracking-widest text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">You</span>
            )}
          </div>
          <p className="text-[10px] font-headline font-bold text-stone-400 uppercase tracking-widest truncate">
            {member.email}
          </p>
        </div>

        {/* Status / Role Badge */}
        <div className="flex-shrink-0 flex items-center gap-3">
         <div className="relative">
             <button 
               type="button"
               onClick={() => canManageRole && setShowRoleMenu(!showRoleMenu)}
               disabled={!canManageRole || isUpdating}
               aria-haspopup="menu"
               aria-expanded={showRoleMenu}
               aria-controls={`member-role-menu-${member.id}`}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                 canManageRole ? 'hover:bg-black hover:text-white cursor-pointer' : ''
               } ${showRoleMenu ? 'bg-black text-white' : 'bg-surface-container-highest text-on-surface-variant'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2`}
             >
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Role</span>
                   <span className="text-[10px] font-headline font-bold uppercase tracking-widest">{member.role}</span>
                </div>
                {canManageRole && (
                  <span className="material-symbols-outlined text-sm">unfold_more</span>
                )}
             </button>

             {/* Role Selection Menu */}
             <AnimatePresence>
               {showRoleMenu && (
                 <motion.div 
                   id={`member-role-menu-${member.id}`}
                   role="menu"
                   aria-label="Change member role"
                   className="absolute top-full right-0 mt-2 w-40 bg-white shadow-xl rounded-xl border border-stone-100 p-2 z-50 overflow-hidden"
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 >
                   {['admin', 'member'].map(role => (
                     <button
                       key={role}
                       type="button"
                       onClick={() => handleRoleChange(role)}
                       role="menuitem"
                       className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
                     >
                       <span className="text-[10px] font-headline font-black uppercase tracking-widest leading-none">
                         {role}
                       </span>
                       {member.role === role && (
                         <span className="material-symbols-outlined text-sm text-green-500">check</span>
                       )}
                     </button>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Remove/Leave */}
          {canRemove && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 rounded-lg text-stone-400 hover:text-tertiary hover:bg-tertiary/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              title={isCurrentUser ? 'Leave Team' : 'Remove Member'}
              aria-label={isCurrentUser ? 'Leave team' : 'Remove member'}
            >
              <span className="material-symbols-outlined text-xl">
                {isCurrentUser ? 'logout' : 'person_remove'}
              </span>
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
           <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  )
}
