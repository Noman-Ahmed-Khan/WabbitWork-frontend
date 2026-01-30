import { BarChart3, CheckCircle2, Clock, GitCommit, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import Panel from '../../layouts/Panel'
import Badge from '../primitives/Badge'
import cx from '../../utils/cx'
import { itemVariants, containerVariants } from '../../animations/variants'
import { transitions } from '../../animations/transitions'

export default function StatsPanel({ stats, loading }) {
  if (loading) {
    return (
      <Panel>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-base-300 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-base-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </Panel>
    )
  }

  const statCards = [
    { 
      label: 'Total', 
      value: stats?.total || 0, 
      color: 'primary',
      icon: BarChart3 
    },
    { 
      label: 'To Do', 
      value: stats?.todo || 0, 
      color: 'info',
      icon: GitCommit 
    },
    { 
      label: 'In Progress', 
      value: stats?.in_progress || 0, 
      color: 'warning',
      icon: Clock 
    },
    { 
      label: 'Completed', 
      value: stats?.completed || 0, 
      color: 'success',
      icon: CheckCircle2 
    },
  ]

  const alertStats = [
    { 
      label: 'Due Soon', 
      value: stats?.due_soon || 0, 
      color: 'warning',
      icon: Clock 
    },
    { 
      label: 'Overdue', 
      value: stats?.overdue || 0, 
      color: 'error',
      icon: AlertTriangle 
    },
  ]

  return (
    <Panel>
      <motion.h2 
        className="text-lg font-bold mb-4 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.normal}
      >
        <BarChart3 size={20} />
        <span>Task Overview</span>
      </motion.h2>

      {/* Main stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className={cx(
                'rounded-lg p-3 border-2',
                `border-${stat.color}/20 bg-${stat.color}/5`
              )}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={transitions.normal}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon size={16} className={`text-${stat.color}`} />
                <motion.div 
                  className={`text-2xl font-bold text-${stat.color}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {stat.value}
                </motion.div>
              </div>
              <div className="text-xs text-base-content/60">
                {stat.label}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Alert stats */}
      {(alertStats[0].value > 0 || alertStats[1].value > 0) && (
        <motion.div 
          className="grid grid-cols-2 gap-3"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {alertStats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className={cx(
                  'rounded-lg p-3 border-2',
                  `border-${stat.color}/20 bg-${stat.color}/5`,
                  stat.value > 0 && 'ring-2 ring-offset-2 ring-offset-base-100',
                  stat.color === 'error' && stat.value > 0 && 'ring-error',
                  stat.color === 'warning' && stat.value > 0 && 'ring-warning'
                )}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={transitions.normal}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={`text-${stat.color}`} />
                    <div>
                      <motion.div 
                        className={`text-xl font-bold text-${stat.color}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs text-base-content/60">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                  {stat.value > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Badge variant={stat.color} size="sm">
                        Action Required
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </Panel>
  )
}