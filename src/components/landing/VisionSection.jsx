import { motion } from 'framer-motion'

const VisionSection = ({ isDark }) => (
  <section
    id="vision"
    className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 bg-surface-container-low scroll-mt-[25px]"
  >
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative min-w-0 max-w-xl mx-auto md:mx-0"
      >
        <div className="absolute -left-6 -top-6 w-24 h-24 border-l-2 border-t-2 border-primary" />
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK3Lr8QviZw8uoxxvBJ_kJd2jLqH93_KbD-m0_AEH4H2F9BDuH_wywAsmgLGTpz4pOKtLaqnLFo1SZqwa3kCU7NZrVfx2yMOaKdnoMUBFb5XhpyV3hKSA388U788UJYyn2qbiWpWWhfJ0tSFsHvKLf5vMhueIZG7jWxojb1j-kJ448osn11hBpDeLr7xb0Us23-gZCuuDAqm9rbguEHXiIP9aFY_dedTbIyTnW-SX94SfEnoBaC1OCO81ca_LKUHyLEsJYf3c6Iiw"
          alt="Workspace"
          className="rounded-xl shadow-2xl grayscale w-full h-auto object-cover"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="min-w-0"
      >
        <span className="uppercase tracking-[0.4em] text-[13px] sm:text-[15px] font-black/50 text-primary mb-5 sm:mb-6 block">
          DESIGN PHILOSOPHY
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.85] mb-6 sm:mb-8 text-on-background">
          ELIMINATE<br />THE <span className="text-primary dark:text-secondary">EXCESS</span>
        </h2>
        <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 opacity-70">
          Most tools are built to keep you busy. We are built to get you finished. WabbitWorks is an uncompromising blade for serious engineers.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: 'check_circle', text: 'Zero Noise Ratio' },
            { icon: 'bolt', text: 'Sub-ms Reactivity' },
            { icon: 'security', text: 'Military-Grade Core' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
              className="flex items-center gap-4 sm:gap-5 group"
            >
              <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="text-base sm:text-lg uppercase font-black tracking-widest text-on-background">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
)

export default VisionSection
