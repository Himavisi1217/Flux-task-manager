import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="block text-xs font-semibold text-flux-gray uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full bg-flux-black-soft border border-flux-black-border rounded-xl px-4 py-2.5 text-flux-white text-sm focus:border-flux-red focus:ring-1 focus:ring-flux-red/20 outline-none transition-all placeholder:text-flux-text-dim ${error ? 'border-red-500/50 focus:border-red-500' : ''
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
