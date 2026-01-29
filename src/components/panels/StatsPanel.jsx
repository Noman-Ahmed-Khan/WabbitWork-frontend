import Panel from '../../layouts/Panel'
import Badge from '../primitives/Badge'
import cx from '../../utils/cx'

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
    { label: 'Total', value: stats?.total || 0, color: 'primary' },
    { label: 'To Do', value: stats?.todo || 0, color: 'info' },
    { label: 'In Progress', value: stats?.in_progress || 0, color: 'warning' },
    { label: 'Completed', value: stats?.completed || 0, color: 'success' },
  ]

  const alertStats = [
    { label: 'Due Soon', value: stats?.due_soon || 0, color: 'warning' },
    { label: 'Overdue', value: stats?.overdue || 0, color: 'error' },
  ]

  return (
    <Panel>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>📊</span>
        <span>Task Overview</span>
      </h2>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={cx(
              'rounded-xl p-4 border-2',
              `border-${stat.color}/20 bg-${stat.color}/5`
            )}
          >
            <div className={`text-3xl font-bold text-${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-base-content/60 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Alert stats */}
      {(alertStats[0].value > 0 || alertStats[1].value > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {alertStats.map((stat) => (
            <div
              key={stat.label}
              className={cx(
                'rounded-xl p-4 border-2',
                `border-${stat.color}/20 bg-${stat.color}/5`,
                stat.value > 0 && 'ring-2 ring-offset-2 ring-offset-base-100',
                stat.color === 'error' && stat.value > 0 && 'ring-error',
                stat.color === 'warning' && stat.value > 0 && 'ring-warning'
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold text-${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-base-content/60 mt-1">
                    {stat.label}
                  </div>
                </div>
                {stat.value > 0 && (
                  <Badge variant={stat.color} size="sm">
                    Action Required
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}