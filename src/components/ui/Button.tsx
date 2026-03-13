import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    loading?: boolean
    children?: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
        primary: 'bg-flux-red text-white hover:bg-flux-red-dark glow-red-subtle',
        secondary: 'bg-flux-black-border text-flux-white hover:bg-flux-gray/20',
        outline: 'border border-flux-black-border text-flux-white hover:bg-white/5',
        ghost: 'text-flux-gray hover:text-flux-white hover:bg-white/5',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
        icon: 'p-2',
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
            {children}
        </button>
    )
}
