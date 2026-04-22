import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUIStore from '../../stores/uiStore'

const LandingNav = ({ handleLogin }) => {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '#product', label: 'Product' },
    { href: '#vision', label: 'Vision' },
    { href: '#join', label: 'Join' },
  ]

  return (
    <nav className="fixed top-0 w-full z-[60] backdrop-blur-xl border-b border-outline-variant/10 bg-background/70">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-8 py-4">
        <div className="text-xl font-black tracking-tighter uppercase text-on-background flex items-center gap-2">
          WabbitWorks
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="uppercase tracking-widest text-[11px] font-black text-on-background/60 hover:text-on-background transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="uppercase tracking-widest text-[11px] font-black text-on-background/60 hover:text-on-background transition-colors duration-200 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base leading-none">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLogin}
            className="hidden sm:block bg-primary text-on-primary px-5 py-2 text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Authorize
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-on-background p-2"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-outline-variant/20 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="uppercase tracking-[0.2em] text-xs font-black text-on-background/60 hover:text-on-background transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  toggleTheme()
                  setIsOpen(false)
                }}
                className="uppercase tracking-[0.2em] text-xs font-black text-on-background/60 hover:text-on-background transition-colors flex items-center gap-2 mb-4"
              >
                <span className="material-symbols-outlined text-sm">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
                {isDark ? 'Light' : 'Dark'} Mode
              </button>

              <button
                type="button"
                onClick={() => {
                  handleLogin()
                  setIsOpen(false)
                }}
                className="w-full bg-primary text-on-primary py-4 text-[11px] font-black uppercase tracking-[0.2em] shadow-editorial active:scale-95 transition-transform"
              >
                Authorize System
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default LandingNav
