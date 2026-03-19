import React from 'react';
import { buttonStyles, type ButtonVariant } from '@/lib/buttonStyles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Professional, accessible Button component
 * Supports multiple variants, icons, and loading states
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      icon,
      iconPosition = 'left',
      loading = false,
      className = '',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyle = buttonStyles[variant];
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyle} ${widthClass} ${disabledClass} ${className} flex items-center justify-center gap-2`}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin"></span>
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
