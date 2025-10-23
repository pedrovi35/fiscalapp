import React from 'react'
import { cn } from '../../utils/cn'

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'badge',
        {
          'badge-default': variant === 'default',
          'badge-secondary': variant === 'secondary',
          'badge-destructive': variant === 'destructive',
          'badge-outline': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }






