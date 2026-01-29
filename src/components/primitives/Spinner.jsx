import { Loader2 } from 'lucide-react'
import cx from '../../utils/cx'

export default function Spinner({ 
  size = 'md',
  className = '' 
}) {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 
        size={sizeMap[size]} 
        className={cx('animate-spin text-primary', className)} 
      />
    </div>
  )
}