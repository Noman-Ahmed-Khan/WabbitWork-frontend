import useUIStore from '../../stores/uiStore'

const LandingNav = ({ handleLogin }) => {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === 'dark'

  return (
    <nav className="fixed top-0 w-full z-[60] backdrop-blur-xl border-b border-outline-variant/10 bg-background/70">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-8 py-4">
        <div className="text-xl font-black tracking-tighter uppercase text-on-background flex items-center gap-2">
          WabbitWorks
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {['#product', '#vision', '#join'].map((href, i) => (
            <a
              key={href}
              href={href}
              className="uppercase tracking-widest text-[11px] font-black text-on-background/60 hover:text-on-background transition-colors duration-200"
            >
              {['Product', 'Vision', 'Join'][i]}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="uppercase tracking-widest text-[11px] font-black text-on-background/60 hover:text-on-background transition-colors duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
          >
            <span className="material-symbols-outlined text-base leading-none">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="bg-primary text-on-primary px-5 py-2 text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
        >
          Authorize
        </button>
      </div>
    </nav>
  )
}

export default LandingNav
