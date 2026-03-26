import { motion } from 'framer-motion'
import { itemVariants, containerVariants } from '../../animations/variants'

/**
 * Stats Panel - Brutalist Editorial Design
 * Asymmetric bento grid with high-impact typography
 */
export default function StatsPanel({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-stone-200 h-40 rounded-none"></div>
        ))}
      </div>
    )
  }

  const statCards = [
    { 
      label: 'Pending', 
      value: stats?.todo || 0, 
      color: 'bg-black',
    },
    { 
      label: 'In Motion', 
      value: stats?.in_progress || 0, 
      color: 'bg-tertiary',
    },
    { 
      label: 'Finalized', 
      value: stats?.completed || 0, 
      color: 'bg-black',
    },
    { 
      label: 'Velocity', 
      value: `${stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%`, 
      color: 'bg-white',
      inverse: true
    },
  ]

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`${stat.inverse ? 'bg-black' : 'bg-[#E7E6E6]'} p-8 rounded-none group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden`}
          variants={itemVariants}
        >
          <p className={`font-headline text-xs font-black tracking-[0.2em] uppercase mb-4 ${stat.inverse ? 'text-stone-400' : 'text-on-surface-variant'}`}>
            {stat.label}
          </p>
          <p className={`font-headline text-5xl font-black leading-none tracking-tighter ${stat.inverse ? 'text-white' : 'text-black'}`}>
            {stat.value}
          </p>
          
          {/* Kinetic underline */}
          <div className={`mt-6 h-1 w-12 group-hover:w-full transition-all duration-500 ease-in-out ${stat.color}`}></div>
          
          {/* Subtle background number */}
          <span className="absolute -bottom-4 -right-4 font-headline font-black text-5xl text-black/5 select-none pointer-events-none italic">
             0{index + 1}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}