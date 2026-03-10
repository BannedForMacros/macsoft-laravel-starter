import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/* ---- Wrapper ---- */
function TableRoot({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={`overflow-x-auto rounded border ${className}`}
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {children}
            </table>
        </div>
    );
}

/* ---- Head ---- */
function Head({ children }: { children: React.ReactNode }) {
    return (
        <thead style={{ backgroundColor: 'var(--color-bg)' }}>
            {children}
        </thead>
    );
}

/* ---- Body ---- */
function Body({ children }: { children: React.ReactNode }) {
    return (
        <tbody
            className="divide-y"
            style={{ borderColor: 'var(--color-border)' }}
        >
            {children}
        </tbody>
    );
}

/* ---- Row ---- */
function Row({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <tr
            className={`transition-colors duration-100 hover:bg-opacity-50 ${className}`}
            style={{ '--tw-bg-opacity': '1' } as React.CSSProperties}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '';
            }}
        >
            {children}
        </tr>
    );
}

/* ---- Th ---- */
interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortable?: boolean;
    sortDir?: 'asc' | 'desc' | null;
    onSort?: () => void;
}

function Th({ children, sortable, sortDir, onSort, className = '', ...props }: ThProps) {
    return (
        <th
            className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sortable ? 'cursor-pointer select-none' : ''} ${className}`}
            style={{ color: 'var(--color-text-muted)' }}
            onClick={sortable ? onSort : undefined}
            {...props}
        >
            <span className="inline-flex items-center gap-1">
                {children}
                {sortable && (
                    <span className="flex flex-col" style={{ lineHeight: 0 }}>
                        <ChevronUp size={10} className={sortDir === 'asc' ? 'opacity-100' : 'opacity-30'} />
                        <ChevronDown size={10} className={sortDir === 'desc' ? 'opacity-100' : 'opacity-30'} />
                    </span>
                )}
            </span>
        </th>
    );
}

/* ---- Td ---- */
function Td({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={`px-4 py-3 text-sm ${className}`}
            style={{ color: 'var(--color-text)' }}
            {...props}
        >
            {children}
        </td>
    );
}

/* ---- Empty ---- */
function Empty({ message = 'No hay datos disponibles' }: { message?: string }) {
    return (
        <tr>
            <td colSpan={999} className="py-12 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {message}
            </td>
        </tr>
    );
}

/* ---- Loading skeleton ---- */
function Loading({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {Array.from({ length: cols }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                            <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

const Table = Object.assign(TableRoot, { Head, Body, Row, Th, Td, Empty, Loading });

export default Table;
