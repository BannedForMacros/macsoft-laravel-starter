import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export default function Input({ label, error, hint, required, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}
            <input
                className={`rounded border px-3 py-2 text-sm outline-none transition-all duration-150 ${className}`}
                style={{
                    borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-surface)',
                }}
                onFocus={e => {
                    if (!error) e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)'}`;
                }}
                onBlur={e => {
                    e.currentTarget.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)';
                    e.currentTarget.style.boxShadow = '';
                }}
                required={required}
                {...props}
            />
            {error && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>}
            {hint && !error && <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{hint}</p>}
        </div>
    );
}
