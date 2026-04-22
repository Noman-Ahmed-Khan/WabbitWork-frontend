import React from 'react'

/**
 * TaskSchematic - Minimalist Task Matrix visual
 */
const TaskSchematic = ({ isDark }) => (
  <div className={`w-full min-h-[8rem] sm:h-36 md:h-40 rounded-lg overflow-hidden border ${isDark ? 'border-white/10 bg-black/40' : 'border-black/10 bg-white/40'} relative p-2 sm:p-3 flex flex-col gap-1.5 transition-transform duration-700 group-hover:scale-[1.02]`}>
    <div className="flex gap-2">
      {[1, 2, 3].map(i => <div key={i} className={`h-1 flex-1 rounded-sm ${isDark ? 'bg-primary/40' : 'bg-primary/20'}`} />)}
    </div>
    <div className="grid grid-cols-4 gap-2 flex-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`rounded-sm border ${isDark ? 'border-white/25' : 'border-black/25'} flex items-center justify-center`}>
          <div className={`w-1/2 h-1/2 rounded-full ${i % 3 === 0 ? 'bg-primary/60 animate-pulse' : 'bg-on-background/10'}`} />
        </div>
      ))}
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(2rem,8vw,4rem)] font-black text-on-background/5 select-none pointer-events-none uppercase italic">MATRIX</div>
  </div>
)

export default TaskSchematic