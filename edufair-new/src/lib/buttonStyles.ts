/**
 * Consistent Button Styling Utilities
 * Provides professional, accessible button styles across the application
 */

export const buttonStyles = {
  // Primary Action Buttons (Most Important)
  primary: 'bg-gradient-primary text-white px-6 py-2.5 rounded-lg font-semibold shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  
  // Secondary Action Buttons
  secondary: 'bg-gray-100 text-gray-900 px-6 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-200 shadow-button transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Success Buttons (Confirmations, Submissions)
  success: 'bg-gradient-success text-white px-6 py-2.5 rounded-lg font-semibold shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  
  // Danger Buttons (Destructive Actions)
  danger: 'bg-gradient-danger text-white px-6 py-2.5 rounded-lg font-semibold shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  
  // Warning Buttons (Caution Actions)
  warning: 'bg-gradient-warning text-white px-6 py-2.5 rounded-lg font-semibold shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  
  // Ghost Buttons (Minimal Style)
  ghost: 'bg-transparent text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Outline Buttons (Border Style)
  outline: 'border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 active:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Small Buttons (Compact)
  small: 'bg-gradient-primary text-white px-4 py-1.5 rounded-md font-medium shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Large Buttons (Full prominence)
  large: 'bg-gradient-primary text-white px-8 py-3 rounded-lg font-bold shadow-button-lg hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Icon Buttons (Round with Icons)
  icon: 'w-10 h-10 bg-gradient-primary text-white rounded-full flex items-center justify-center shadow-button hover:shadow-button-lg hover:scale-110 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Icon Button Secondary
  iconSecondary: 'w-10 h-10 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-all duration-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Text Buttons (Minimal)
  text: 'text-blue-600 py-2 px-2 font-medium hover:text-blue-700 hover:underline transition-all duration-200 focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed',
  
  // Tag/Chip Buttons
  tag: 'inline-block bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50',
  
  // Premium Button (Elite styling)
  premium: 'bg-gradient-premium text-white px-6 py-2.5 rounded-lg font-bold shadow-button hover:shadow-button-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  
  // Floating Action Button (FAB)
  fab: 'fixed bottom-8 right-8 w-14 h-14 bg-gradient-primary text-white rounded-full flex items-center justify-center shadow-button-lg hover:shadow-button-lg hover:scale-110 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 z-50',
};

// Button component type for TypeScript
export type ButtonVariant = keyof typeof buttonStyles;

/**
 * Get button style by variant
 */
export const getButtonStyle = (variant: ButtonVariant = 'primary'): string => {
  return buttonStyles[variant] || buttonStyles.primary;
};

/**
 * Combine multiple button styles
 */
export const combineButtonStyles = (...styles: string[]): string => {
  return styles.filter(Boolean).join(' ');
};

// Status-specific button colors
export const statusButtonColors = {
  accepted: 'bg-gradient-success text-white',
  rejected: 'bg-gradient-danger text-white',
  submitted: 'bg-gradient-primary text-white',
  reviewing: 'bg-gradient-warning text-white',
  draft: 'bg-gray-100 text-gray-900',
  pending: 'bg-blue-50 text-blue-700 border border-blue-200',
};

// Badge/Chip styles for different statuses
export const statusBadgeStyles = {
  accepted: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  submitted: 'bg-blue-50 text-blue-700 border border-blue-200',
  reviewing: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  draft: 'bg-gray-50 text-gray-700 border border-gray-200',
  pending: 'bg-purple-50 text-purple-700 border border-purple-200',
};

// Icon button sizes and spacing
export const iconSizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-14 h-14 text-xl',
};
