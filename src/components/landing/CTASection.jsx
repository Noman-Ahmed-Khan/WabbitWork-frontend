import { motion } from 'framer-motion'

const CTASection = ({ handleGetStarted }) => (
  <section id="cta" className="min-h-[80vh] flex flex-col justify-center items-center bg-primary overflow-hidden relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-24">
    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent opacity-20" />

    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.2]">
      <motion.div
        className="flex whitespace-nowrap text-[clamp(4rem,12vw,12rem)] font-black uppercase italic tracking-tighter text-on-primary select-none"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          ease: 'linear',
          duration: 20,
          repeat: Infinity,
        }}
      >
        <span className="mr-10">
          BUILD THE FUTURE&nbsp;&nbsp;BUILD THE FUTURE&nbsp;&nbsp;BUILD THE FUTURE
        </span>
      </motion.div>
    </div>

    <div className="relative z-10 text-center max-w-4xl">
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-on-primary text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase mb-8 sm:mb-12 tracking-tighter leading-none"
      >
        INITIALIZE<br /><span className="text-stroke-sm text-on-primary">THE ENGINE</span>
      </motion.h2>
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        type="button"
        onClick={handleGetStarted}
        className="bg-on-primary text-primary px-10 sm:px-12 lg:px-16 py-4 sm:py-5 lg:py-6 rounded-full text-base sm:text-lg lg:text-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
      >
        Get Started
      </motion.button>
    </div>
  </section>
)

export default CTASection
