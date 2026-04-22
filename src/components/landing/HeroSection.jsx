import React, { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
const LiquidMercuryCanvas = lazy(() => import('../../animations/LiquidMercury'))

// Commit 3: Minor update

const HeroSection = ({ isDark, handleGetStarted, handleLogin }) => {

  return (
    <section
      className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 relative overflow-hidden"
      style={{ background: isDark ? '#010101' : '#f5f3ef' }}
    >

      {/* Particle canvas */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full" style={{ background: isDark ? '#010101' : '#f5f3ef' }} />}>
          <LiquidMercuryCanvas isDark={isDark} />
        </Suspense>
      </div>

      {/* Bottom vignette - fades to matching bg so the seam is invisible */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, transparent 40%, #010101cc 100%)'
            : 'linear-gradient(to bottom, transparent 40%, #f5f3efcc 100%)'
        }}
      />

      {/* Watermark (Restored) */}
      <motion.div 
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 0.3, x: -64 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -right-6 sm:-right-10 lg:-right-16 top-1/4 pointer-events-none select-none z-[2] opacity-20 sm:opacity-30"
        aria-hidden="true"
      >
        <span
          className="text-[7rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] font-black leading-none uppercase tracking-tighter"
          style={{ WebkitTextStroke: '2px #ffffff', color: isDark ? '#ffffff' : '#000000' }}
        >MSTR</span>
      </motion.div>

      {/* Content - centered layout restored */}
      <div
        className="max-w-5xl mx-auto w-full z-[3] pointer-events-none"
        style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
      >
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="uppercase tracking-[0.4em] text-xs sm:text-sm font-black mb-4 sm:mb-5 text-black/70 dark:text-white/70"
        >
          SYSTEM REV 04.2
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-[5.5rem] lg:text-[6.5rem] font-black leading-[0.88] tracking-tighter uppercase mb-6 sm:mb-7"
        >
          CONTROL<br />THE CHAOS
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6"
        >
          <p className="max-w-sm text-base sm:text-lg font-bold font-body leading-relaxed text-black/70 dark:text-white/70">
            A brutalist approach to project management. Built for precision, not procrastination.
          </p>

          {/* Buttons re-enable pointer events */}
          <div className="flex flex-col sm:flex-row gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-black uppercase tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              style={{ background: isDark ? '#ffffff' : '#1a1a1a', color: isDark ? '#000000' : '#ffffff' }}
            >
              DEPLOY SYSTEM
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-black uppercase tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
              style={{
                border: isDark ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(0,0,0,0.3)',
                color: isDark ? '#ffffff' : '#1a1a1a',
              }}
            >
              AUTHORIZE
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
