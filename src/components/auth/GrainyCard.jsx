/**
 * Grainy translucent card - Subtle grain with glass effect
 * Refined to be less noisy, more elegant
 */
export default function GrainyCard({ children, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Subtle tinted base */}
      <div className="absolute inset-0 bg-black/[0.02] dark:bg-black/30 pointer-events-none" />
      
      {/* Single subtle grain layer */}
      <div 
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Glass sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/5 to-transparent dark:from-white/10 dark:via-transparent dark:to-black/10 pointer-events-none z-[2]" />
      
      {/* Top highlight line */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20 pointer-events-none z-[2]" />
      
      {/* Inner shadow for depth */}
      <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.2)] pointer-events-none z-[2] rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}