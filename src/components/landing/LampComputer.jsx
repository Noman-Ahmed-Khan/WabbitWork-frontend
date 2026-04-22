import React from 'react'
import { motion } from 'framer-motion'

/**
 * LampComputer - A stylized, brutalist CSS/SVG terminal component.
 */
const LampComputer = ({ isDark }) => (
  <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] sm:aspect-square flex items-center justify-center">
    {/* The "Lamp" neck */}
    <div className={`absolute bottom-1/2 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-24 sm:h-32 border-l-2 border-r-2 ${isDark ? 'border-primary/40' : 'border-primary/20'} origin-bottom rotate-[-15deg]`} />
    
    {/* The Terminal Screen */}
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`relative z-10 w-52 sm:w-64 h-40 sm:h-48 rounded-2xl border-2 p-1 ${isDark ? 'bg-black border-white/20' : 'bg-white border-black/10'} shadow-2xl`}
    >
      <div className={`w-full h-full rounded-xl overflow-hidden relative ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f0f0f0]'}`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        
        {/* Scan lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        {/* Terminal Content */}
        <div className="p-4 font-mono text-[8px] space-y-2">
          <div className="flex justify-between border-b border-primary/20 pb-1">
            <span className="text-primary font-black uppercase">System.Status</span>
            <span className="animate-pulse">● ACTIVE</span>
          </div>
          <div className="space-y-1">
            <div className="w-full h-1 bg-primary/20 rounded" />
            <div className="w-3/4 h-1 bg-primary/10 rounded" />
            <div className="w-1/2 h-1 bg-primary/10 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-4">
            <div className={`aspect-video rounded border ${isDark ? 'border-white/10' : 'border-black/5'}`} />
            <div className={`aspect-video rounded border ${isDark ? 'border-white/10' : 'border-black/5'}`} />
          </div>
        </div>
      </div>
    </motion.div>

    {/* The Base */}
    <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-10 sm:h-12 rounded-[50%] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'} blur-xl`} />
    <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-7 sm:h-8 rounded-full border-2 ${isDark ? 'bg-black border-white/20' : 'bg-white border-black/10'} shadow-inner`} />
  </div>
)

export default LampComputer