import { useEffect, useState } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast, type Toast as ToastType } from '@/lib/hooks'

export function Toast({ id, title, description, variant = 'default' }: ToastType) {
  const { dismiss } = useToast()
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => dismiss(id), 200)
  }

  useEffect(() => {
    // Slide in animation trigger
    const timer = setTimeout(() => setIsExiting(false), 10)
    return () => clearTimeout(timer)
  }, [])

  const icons = {
    default: <Info className="size-5" />,
    success: <CheckCircle2 className="size-5" />,
    destructive: <AlertCircle className="size-5" />
  }

  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all',
        'data-[exiting=true]:animate-out data-[exiting=true]:fade-out-80 data-[exiting=true]:slide-out-to-right-full',
        'animate-in slide-in-from-bottom-full',
        variant === 'default' && 'bg-card border-border',
        variant === 'success' && 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
        variant === 'destructive' && 'bg-destructive/10 border-destructive/20'
      )}
      data-exiting={isExiting}
    >
      <div className={cn(
        'shrink-0 mt-0.5',
        variant === 'default' && 'text-primary',
        variant === 'success' && 'text-green-600 dark:text-green-400',
        variant === 'destructive' && 'text-destructive'
      )}>
        {icons[variant]}
      </div>
      
      <div className="flex-1 grid gap-1">
        <div className={cn(
          'text-sm font-semibold',
          variant === 'default' && 'text-foreground',
          variant === 'success' && 'text-green-900 dark:text-green-100',
          variant === 'destructive' && 'text-destructive'
        )}>
          {title}
        </div>
        {description && (
          <div className={cn(
            'text-sm opacity-90',
            variant === 'default' && 'text-muted-foreground',
            variant === 'success' && 'text-green-800 dark:text-green-200',
            variant === 'destructive' && 'text-destructive'
          )}>
            {description}
          </div>
        )}
      </div>
      
      <button
        onClick={handleDismiss}
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-70',
          variant === 'default' && 'text-foreground/50 hover:text-foreground',
          variant === 'success' && 'text-green-800/50 hover:text-green-900 dark:text-green-200/50 dark:hover:text-green-100',
          variant === 'destructive' && 'text-destructive/50 hover:text-destructive'
        )}
      >
        <X className="size-4" />
      </button>
    </div>
  )
}