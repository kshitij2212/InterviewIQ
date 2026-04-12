import { clsx } from 'clsx'

const variants = {
  default:   'bg-accent text-accent-foreground hover:bg-accent/90 border border-accent/30',
  outline:   'border border-gray-200/70 bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/80',
  ghost:     'bg-transparent hover:bg-gray-100/60 backdrop-blur-sm text-gray-700',
  secondary: 'bg-gray-100/60 backdrop-blur-sm border border-gray-200/60 text-gray-700 hover:bg-gray-100/80',
  glass:     'bg-white/40 backdrop-blur-md border border-gray-200/50 text-gray-700 hover:bg-white/70 shadow-sm',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function Button({ children, className, variant = 'default', size = 'md', ...props }) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}