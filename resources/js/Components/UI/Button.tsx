import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    children: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
    primary: {
        backgroundColor: 'var(--color-primary)',
        color: '#fff',
        border: '1px solid var(--color-primary)',
    },
    secondary: {
        backgroundColor: 'var(--color-secondary)',
        color: '#fff',
        border: '1px solid var(--color-secondary)',
    },
    success: {
        backgroundColor: 'var(--color-success)',
        color: '#fff',
        border: '1px solid var(--color-success)',
    },
    danger: {
        backgroundColor: 'var(--color-danger)',
        color: '#fff',
        border: '1px solid var(--color-danger)',
    },
    warning: {
        backgroundColor: 'var(--color-warning)',
        color: '#fff',
        border: '1px solid var(--color-warning)',
    },
    ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
    },
};

const variantHoverClass: Record<Variant, string> = {
    primary: 'hover:opacity-90',
    secondary: 'hover:opacity-90',
    success: 'hover:opacity-90',
    danger: 'hover:opacity-90',
    warning: 'hover:opacity-90',
    ghost: 'hover:bg-gray-100',
};

const sizeClasses: Record<Size, string> = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={[
                'inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-150 cursor-pointer',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                sizeClasses[size],
                variantHoverClass[variant],
                className,
            ].join(' ')}
            style={variantStyles[variant]}
            {...props}
        >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {children}
        </button>
    );
}
