/**
 * WCAG 2.1 Accessibility Utilities
 */

// ARIA label helpers
export const a11y = {
  /**
   * Generate descriptive label for form inputs
   */
  label: (text: string) => ({
    'aria-label': text,
  }),

  /**
   * Mark required fields
   */
  required: () => ({
    'aria-required': 'true',
  }),

  /**
   * Describe invalid inputs
   */
  invalid: (message: string) => ({
    'aria-invalid': 'true',
    'aria-describedby': `error-${Date.now()}`,
  }),

  /**
   * Create skip links for keyboard navigation
   */
  skipLink: () => ({
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50',
    href: '#main-content',
  }),

  /**
   * Mark loading states
   */
  loading: () => ({
    'aria-busy': 'true',
    'aria-label': 'Loading...',
  }),

  /**
   * Mark disabled states
   */
  disabled: () => ({
    'aria-disabled': 'true',
  }),

  /**
   * Create live region for announcements
   */
  liveRegion: (polite: boolean = false) => ({
    'aria-live': polite ? 'polite' : 'assertive',
    'aria-atomic': 'true',
  }),

  /**
   * Mark expanded/collapsed states
   */
  expanded: (isExpanded: boolean) => ({
    'aria-expanded': isExpanded.toString(),
  }),

  /**
   * Mark current navigation item
   */
  current: (isCurrent: boolean) => ({
    'aria-current': isCurrent ? 'page' : undefined,
  }),

  /**
   * Provide button labels for icon buttons
   */
  button: (label: string) => ({
    'aria-label': label,
    type: 'button',
  }),

  /**
   * Create landmark regions
   */
  main: () => ({
    role: 'main',
    id: 'main-content',
  }),

  navigation: () => ({
    role: 'navigation',
  }),

  complementary: () => ({
    role: 'complementary',
  }),

  contentinfo: () => ({
    role: 'contentinfo',
  }),
}

/**
 * Color contrast checker (WCAG AA standards: 4.5:1 for normal text)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgLuminance = getLuminance(foreground)
  const bgLuminance = getLuminance(background)

  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Calculate luminance of a color
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = rgb.map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }) as [number, number, number]

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): number[] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1]!, 16), parseInt(result[2]!, 16), parseInt(result[3]!, 16)] : null
}

/**
 * Focus management helpers
 */
export const focusManagement = {
  /**
   * Trap focus within element
   */
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    return {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      },
    }
  },

  /**
   * Restore focus to element
   */
  restoreFocus: (target: HTMLElement) => {
    return () => {
      target?.focus()
    }
  },
}

/**
 * Keyboard shortcuts
 */
export const keyboardShortcuts = {
  /**
   * Escape key handler
   */
  onEscape: (callback: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback()
      }
    },
  }),

  /**
   * Enter key handler
   */
  onEnter: (callback: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        callback()
      }
    },
  }),

  /**
   * Space key handler
   */
  onSpace: (callback: () => void) => ({
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        callback()
      }
    },
  }),
}

/**
 * Screen reader only component - use ScreenReaderOnly from components instead
 */
export const visuallyHidden = {
  className: 'absolute w-px h-px p-0 -m-px overflow-hidden clip-rect border-0',
  style: {
    clip: 'rect(0, 0, 0, 0)',
    clipPath: 'inset(50%)',
  },
}

/**
 * Announce messages to screen readers
 */
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus visible polyfill for browsers that don't support :focus-visible
 */
export function setupFocusVisible() {
  const handleMouseDown = () => {
    document.body.classList.remove('js-focus-visible')
  }

  const handleKeyDown = () => {
    document.body.classList.add('js-focus-visible')
  }

  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('keydown', handleKeyDown)

  return () => {
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('keydown', handleKeyDown)
  }
}
