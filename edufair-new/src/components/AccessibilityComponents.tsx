'use client'

import React from 'react'

/**
 * Screen reader only text component
 * Content is hidden from visual display but read by screen readers
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

/**
 * Visually hidden but accessible component
 */
export function VisuallyHidden({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)',
        height: '1px',
        overflow: 'hidden',
        position: 'absolute',
        whiteSpace: 'nowrap',
        width: '1px',
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Focus visible wrapper for keyboard navigation
 */
export function FocusableElement({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      tabIndex={0}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
      {...props}
    >
      {children}
    </div>
  )
}
