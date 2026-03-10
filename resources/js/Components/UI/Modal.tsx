import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: Size;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const sizeClasses: Record<Size, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export default function Modal({ isOpen, onClose, title, size = 'md', children, footer }: ModalProps) {
    const [visible, setVisible] = useState(false);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setRendered(true);
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
            const timer = setTimeout(() => setRendered(false), 220);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!rendered) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 transition-opacity duration-200"
                style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    opacity: visible ? 1 : 0,
                }}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`relative w-full ${sizeClasses[size]} rounded-lg shadow-xl transition-all duration-200 flex flex-col`}
                style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'scale(1)' : 'scale(0.95)',
                    maxHeight: '90vh',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded p-1 transition-colors duration-150"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        className="flex items-center justify-end gap-2 px-5 py-4 border-t flex-shrink-0"
                        style={{ borderColor: 'var(--color-border)' }}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
