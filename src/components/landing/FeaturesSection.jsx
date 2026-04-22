import { motion } from 'framer-motion'
import TaskSchematic from './TaskSchematic'
import TeamSchematic from './TeamSchematic'

const FeaturesSection = ({ isDark }) => (
  <section
    id="product"
    className="min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-5 py-4 sm:py-5 lg:py-12 bg-background relative scroll-mt-[25px]"
  >
    <div className="max-w-6xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 sm:mb-5"
      >
        <span className="text-primary font-black uppercase tracking-widest text-[13px] sm:text-[15px] block mb-2">// CAPABILITIES</span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.95]">STRUCTURED FOR RAW CONTROL<span className="text-stroke-sm">UTILITY</span></h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3">

        {/* 01 Product Command (Updated Visual) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-8 bg-surface-container-low p-4 sm:p-5 lg:p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/10 min-w-0"
        >
          <span className="absolute top-3 right-5 text-6xl sm:text-7xl font-black text-on-background opacity-[0.15] group-hover:opacity-[0.2] transition-opacity">01</span>
          <div className="relative z-10 mb-4 sm:mb-5">
            <h3 className="text-lg sm:text-xl font-bold uppercase mb-2 text-on-background">Command Center</h3>
            <p className="text-xs sm:text-sm max-w-sm leading-relaxed text-on-surface-variant">
              A centralized, high-density visualization engine for every moving part of your operation. Monitor throughput in real-time.
            </p>
          </div>
          {/* Custom Task Schematic Visual */}
          <TaskSchematic isDark={isDark} />
        </motion.div>

        {/* 02 Task Matrix (Updated Visual) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-4 bg-surface-container-high p-4 sm:p-5 lg:p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/10 group min-w-0"
        >
          <div>
            <span className="text-2xl sm:text-3xl font-black text-on-background/20 group-hover:text-primary/40 transition-colors mb-2 block">02</span>
            <h3 className="text-lg sm:text-xl font-bold uppercase mb-2 text-on-background">Task Matrix</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-on-surface-variant">Cross-functional workflow mapping. Precision over busy-work.</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className={`p-2.5 rounded border transition-colors ${isDark ? 'bg-background/40 border-white/5 group-hover:border-primary/30' : 'bg-background/20 border-black/5 group-hover:border-primary/20'} flex justify-between items-center`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-background">Core Kernel</span>
              <span className="text-[10px] font-black text-primary uppercase">STABLE</span>
            </div>
            <div className={`p-2.5 rounded border transition-colors ${isDark ? 'bg-background/40 border-white/5 group-hover:border-primary/30' : 'bg-background/20 border-black/5 group-hover:border-primary/20'} flex justify-between items-center`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-background">Queue Load</span>
              <span className="animate-pulse text-[10px] font-black text-error uppercase">HIGH</span>
            </div>
          </div>
        </motion.div>

        {/* 03 Latency Zero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          id="teams" className="md:col-span-4 bg-primary p-4 sm:p-5 lg:p-6 rounded-2xl text-on-primary relative overflow-hidden group min-w-0"
        >
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black opacity-30 mb-2 block">03</span>
              <h3 className="text-lg sm:text-xl font-bold uppercase mb-2">Latency Zero</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">Every keystroke. Every unit. Synchronized at the speed of thought.</p>
            </div>
            <div className="mt-5 text-2xl sm:text-3xl lg:text-4xl font-black italic tracking-tighter opacity-10 group-hover:opacity-20 transition-opacity translate-x-4">SYNCED</div>
          </div>
        </motion.div>

        {/* 04 Team Engine (Updated Visual) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-8 bg-surface-container-lowest p-4 sm:p-5 lg:p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 lg:gap-6 border border-outline-variant/10 group min-w-0"
        >
          <div className="w-full md:w-1/2 flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold uppercase mb-2 text-on-background">Team Engine</h3>
            <p className="text-xs sm:text-sm leading-relaxed mb-4 text-on-surface-variant">
              Autonomous architecture for decoupled teams. Raw performance without organizational silos.
            </p>
            <TeamSchematic isDark={isDark} />
          </div>
          <div className="hidden md:block w-1/3 shrink-0 relative min-w-[8rem]">
            <div className={`aspect-[4/5] rounded-xl border border-outline-variant/20 relative overflow-hidden ${isDark ? 'bg-black/40' : 'bg-white/40'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-[6rem] font-black text-on-background/5 select-none uppercase -rotate-90">UNITS</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  </section>
)

export default FeaturesSection
