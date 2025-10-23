import React from 'react'
import { cn } from '../../utils/cn'

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
      className={cn(
        'btn hover-lift',
        {
          'btn-primary': variant === 'default',
          'btn-secondary': variant === 'secondary',
          'btn-destructive': variant === 'destructive',
          'btn-outline': variant === 'outline',
          'btn-ghost': variant === 'ghost',
          'btn-sm': size === 'sm',
          'btn-lg': size === 'lg',
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button }






