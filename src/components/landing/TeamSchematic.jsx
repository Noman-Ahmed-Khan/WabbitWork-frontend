import React from 'react'
import { motion } from 'framer-motion'

/**
 * TeamSchematic - Minimalist Team Engine visual
 */
const TeamSchematic = ({ isDark }) => (
  <div className={`w-full h-full min-h-[120px] sm:min-h-[140px] rounded-lg border ${isDark ? 'border-white/10' : 'border-black/10'} relative overflow-hidden p-2.5 sm:p-3 flex flex-col justify-center gap-2.5 sm:gap-3 group-hover:bg-primary/5 transition-colors duration-500`}>
    <div className="flex justify-between items-center relative z-10">
      <div className="flex -space-x-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 ${isDark ? 'border-black bg-white/10' : 'border-white bg-black/5'} flex items-center justify-center font-black text-[8px] sm:text-[9px]`}>
            {i}
          </div>
        ))}
      </div>
      <div className={`px-3 py-1 rounded-full text-[9px] font-black border ${isDark ? 'border-primary/50 text-primary' : 'border-primary text-primary'} animate-pulse`}>SYNCED</div>
    </div>
    <div className="space-y-2 relative z-10">
      <div className={`w-full h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} overflow-hidden`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="h-full bg-primary"
        />
      </div>
      <div className="flex justify-between text-[7px] sm:text-[8px] font-black uppercase opacity-40">
        <span>Throughput</span>
        <span>98.4%</span>
      </div>
    </div>
    {/* Abstract geometric background */}
    <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-primary/10 rounded-tr-3xl -translate-y-8 translate-x-8" />
  </div>
)

export default TeamSchematic