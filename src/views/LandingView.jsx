import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useUIStore from '../stores/uiStore'

/**
 * LandingView - Noir Editorial Design
 * High-contrast, brutalist framework for TaskMaster (WabbitWork).
 * Supports Light/Dark modes using system tokens.
 */
export default function LandingView() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useUIStore()

  const handleGetStarted = () => {
    navigate('/auth?mode=register')
  }

  const handleLogin = () => {
    navigate('/auth?mode=login')
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-headline selection:bg-primary selection:text-on-primary transition-colors duration-500 overflow-x-hidden">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.08] mix-blend-overlay bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTHChCK3EfhW25n_zu3FKGflHE3T3tbrbbyQ1mffzaCw3BSRH2T2mYxiYT0FEdMpFbg4a3SmbIvMWsOYoocMAw2G-MZL5uyUSvAbupf552uwEzkqFC-p-MWCXsg4X4uYMsTSt0OUqpgVKRV8YTWIteBShwCIbPE2D76EF6TGWPtzbu5N7n__VbES-AW1yqo442mnY2DVSXiAui1qzEVV1B1_o10Y4gXIX8JORYlTkdxbtjPY1fk6kQHdFAUvfr8XK6J0LPMt0PRus')]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto left-0 right-0">
        <div className="text-2xl font-black tracking-tighter uppercase">TASKMASTER</div>
        
        <div className="hidden md:flex gap-10 items-center">
          <a href="#product" className="uppercase tracking-widest text-[10px] font-black opacity-40 hover:opacity-100 transition-opacity">Product</a>
          <a href="#teams" className="uppercase tracking-widest text-[10px] font-black opacity-40 hover:opacity-100 transition-opacity">Teams</a>
          <a href="#vision" className="uppercase tracking-widest text-[10px] font-black opacity-40 hover:opacity-100 transition-opacity">Vision</a>
          <button 
            onClick={toggleTheme}
            className="uppercase tracking-widest text-[10px] font-black opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <button 
          onClick={handleLogin}
          className="bg-primary text-on-primary px-6 py-2 uppercase tracking-widest text-[10px] font-black hover:scale-105 active:scale-95 transition-all shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.05)]"
        >
          Authorize
        </button>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-8 pt-32 pb-20 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute -right-20 top-40 opacity-[0.03] dark:opacity-[0.1] pointer-events-none select-none">
            <h2 className="text-[25rem] font-black leading-none uppercase tracking-tighter">MSTR</h2>
          </div>

          <div className="max-w-7xl mx-auto w-full z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="uppercase tracking-[0.4em] text-[10px] font-black opacity-40 mb-8"
            >
              SYSTEM REV 04.2
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-[10rem] font-black leading-[0.85] tracking-tighter uppercase mb-12"
            >
              CONTROL<br/>THE CHAOS
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col md:flex-row items-start md:items-end gap-12"
            >
              <p className="max-w-md text-xl opacity-60 font-body leading-relaxed">
                A brutalist approach to project management. Designed for teams who value speed over safety, and precision over polish.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-primary text-on-primary px-10 py-5 rounded-lg text-lg font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  DEPLOY SYSTEM
                </button>
                <button 
                  className="border-2 border-primary text-primary px-10 py-5 rounded-lg text-lg font-black uppercase tracking-tighter hover:bg-primary/5 transition-all"
                >
                  WATCH INTEL
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bento Features */}
        <section id="product" className="px-8 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 py-20">
          <div className="md:col-span-8 bg-surface-container-low p-12 rounded-xl relative overflow-hidden group border border-outline-variant/5">
            <span className="absolute top-4 right-8 text-8xl font-black opacity-[0.05]">01</span>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold uppercase mb-4">Command Center</h3>
              <p className="opacity-60 max-w-sm mb-8">Centralized high-density data visualization for every moving part of your operation.</p>
            </div>
            <div className="mt-12 transition-transform duration-700 group-hover:scale-[1.02]">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe0uEGcpxIR0grV5nNHr2tmkaHWhq2qbOtCAolFpZTRz-oBR9IQBTeF-UlhmfAxXDUpFD1GvinEyFGie_gGISnPzTL7TjQREulV6Pny84Cd9pQ3UFGgO6izzP1sHQzbvAc0ebj0uNxrzI6UfjibF4fH0E0-Ezq4ylzSAOEsnV71uqTsQzvHL-sq9d3WeY93FINGyzu4tKvxd2ivXioIXPfu2bkc_-5yu2ytA7BbG_RIOa6CBt5n4DZ2d35S4GMQFNZ7CR5c2O1QFY" 
                alt="Dashboard" 
                className="rounded-lg grayscale contrast-125 border border-primary/10" 
              />
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-high p-12 rounded-xl flex flex-col justify-between border border-outline-variant/10">
            <div>
              <span className="text-4xl font-black opacity-20 mb-4 block">02</span>
              <h3 className="text-3xl font-bold uppercase mb-4">Task Matrix</h3>
              <p className="opacity-60">Non-linear workflow mapping. Break the grid, build the future.</p>
            </div>
            <div className="mt-8 space-y-4">
              <div className="bg-background/40 p-4 rounded border border-outline-variant/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest">Protocol Breach</span>
                <span className="text-[10px] font-black text-error uppercase">CRITICAL</span>
              </div>
              <div className="bg-background/40 p-4 rounded border border-outline-variant/10 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest">Neural Link</span>
                <span className="text-[10px] font-black text-primary uppercase">ACTIVE</span>
              </div>
            </div>
          </div>

          <div id="teams" className="md:col-span-4 bg-primary p-12 rounded-xl text-on-primary">
            <span className="text-4xl font-black opacity-20 mb-4 block">03</span>
            <h3 className="text-3xl font-bold uppercase mb-4">Latency Zero</h3>
            <p className="font-medium opacity-80">Every keystroke. Every team. Instantaneous global distribution.</p>
            <div className="mt-12 text-6xl font-black italic tracking-tighter opacity-10">SYNCED</div>
          </div>

          <div className="md:col-span-8 bg-surface-container-lowest p-12 rounded-xl flex flex-col md:flex-row items-center gap-12 border border-outline-variant/5">
            <div className="hidden md:block w-1/3">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWVdhP7lHSHw1qF0cpZikHQlVNDP5schXJmYMQ3TibpDSvUDoVTZYPE9-Slhxon8_YM__sZ680hNbwtWZVcq2aFMsj3iKrEKLWvFbhYYiH6pRjHmMHrCYT12PfkuJG5nmPsTAAyBXFOpQu6vkmbLc3VTApGRgDR_fZRJ75YxzFsEHGAcLTb1-YFfO7fSsg9YOX-XvSFK85Y_mS9FyMOjovaESeALEZEYvRD9_iGGk98aIHfM1nZxaSNTzp4d8fNvWgQwoY84e8ldU" 
                alt="Engine" 
                className="rounded-lg grayscale brightness-75" 
              />
            </div>
            <div className="flex-1">
              <h3 className="text-4xl font-bold uppercase mb-4">Team Engine</h3>
              <p className="opacity-60 text-lg leading-relaxed">Collaborative architecture built for autonomous units. No silos, just raw performance.</p>
              <div className="mt-8 flex -space-x-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-12 h-12 rounded-full border-4 border-background bg-surface-container-high i-${i}`}></div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-on-primary text-[10px] font-black">+12</div>
              </div>
            </div>
          </div>
        </section>

        {/* Void Gap */}
        <div className="h-[20vh] md:h-[40vh]"></div>

        {/* Editorial Section */}
        <section id="vision" className="px-8 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -left-8 -top-8 w-32 h-32 border-l-2 border-t-2 border-primary"></div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK3Lr8QviZw8uoxxvBJ_kJd2jLqH93_KbD-m0_AEH4H2F9BDuH_wywAsmgLGTpz4pOKtLaqnLFo1SZqwa3kCU7NZrVfx2yMOaKdnoMUBFb5XhpyV3hKSA388U788UJYyn2qbiWpWWhfJ0tSFsHvKLf5vMhueIZG7jWxojb1j-kJ448osn11hBpDeLr7xb0Us23-gZCuuDAqm9rbguEHXiIP9aFY_dedTbIyTnW-SX94SfEnoBaC1OCO81ca_LKUHyLEsJYf3c6Iiw" 
                alt="Workspace" 
                className="rounded-lg shadow-2xl contrast-110 grayscale" 
              />
            </div>
            <div>
              <span className="uppercase tracking-[0.4em] text-[10px] font-black text-primary mb-6 block">DESIGN PHILOSOPHY</span>
              <h2 className="text-6xl font-black uppercase leading-[0.9] mb-8">ELIMINATE THE EXCESS</h2>
              <p className="opacity-60 text-xl leading-relaxed mb-10">
                Most tools are built to keep you busy. We are built to get you finished. Our interface is a weapon against procrastination—a sharp, uncompromising tool for serious work.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: 'check_circle', text: 'No Distractions' },
                  { icon: 'bolt', text: 'Instant Response' },
                  { icon: 'security', text: 'Hardened Security' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                    <span className="text-lg uppercase font-black tracking-widest">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-40 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="flex whitespace-nowrap text-[20rem] font-black uppercase italic tracking-tighter mix-blend-difference">
              BUILD THE FUTURE BUILD THE FUTURE BUILD THE FUTURE
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
            <h2 className="text-on-primary text-5xl md:text-9xl font-black uppercase mb-16 tracking-tighter leading-none">
              ARE YOU READY?
            </h2>
            <button 
              onClick={handleGetStarted}
              className="bg-on-primary text-primary px-16 py-8 rounded-full text-2xl font-black uppercase hover:scale-105 transition-all shadow-[12px_12px_0_0_rgba(0,0,0,0.1)] active:scale-95"
            >
              INITIALIZE SYSTEM
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/10 bg-background flex flex-col md:flex-row justify-between items-center px-12 py-20">
        <div className="mb-12 md:mb-0">
          <div className="text-lg font-black uppercase mb-4">TASKMASTER ARCHIVE</div>
          <p className="uppercase tracking-[0.2em] text-[10px] opacity-40">©2024 TASKMASTER ARCHIVE. ALL RIGHTS RESERVED.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-12">
          {['Privacy', 'Terms', 'Github', 'Twitter'].map(link => (
            <a key={link} href="#" className="uppercase tracking-[0.2em] text-[10px] opacity-40 hover:opacity-100 transition-opacity">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
