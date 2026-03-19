import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // Professional gradient colors
        'gradient-primary': '#1e3a8a',
        'gradient-secondary': '#0ea5e9',
        'accent': '#06b6d4',
        'premium': '#8b5cf6',
        'elite': '#ec4899',
        'success-dark': '#059669',
        'warning-dark': '#d97706',
        'danger-dark': '#dc2626',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-premium': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-elite': 'linear-gradient(135deg, #ec4899 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
        'gradient-midnight': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },
      boxShadow: {
        'button': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'button-lg': '0 6px 25px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 15px rgba(37, 99, 235, 0.4)',
        'glow-success': '0 0 15px rgba(16, 185, 129, 0.4)',
        'glow-warning': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-danger': '0 0 15px rgba(239, 68, 68, 0.4)',
        'glow-premium': '0 0 15px rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
}
export default config
