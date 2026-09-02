/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          paper: '#FAFAF8',       // Ultra clean warm white
          cream: '#F5F0EB',       // Soft oatmeal / warm cream
          sand: '#ECE5DE',        // Light warm beige border & panel
          tan: '#D8CABF',         // Subtle divider
          latte: '#B49A85',       // Secondary muted brown
          caramel: '#A26A4A',     // Warm caramel accent
          chestnut: '#784D34',    // Primary rich warm brown
          mocha: '#543624',       // Deep rich brown
          espresso: '#2D2016',    // Dark espresso text
        },
        lost: {
          light: '#FEF3C7',
          border: '#FDE68A',
          DEFAULT: '#D97706',
          dark: '#B45309',
        },
        found: {
          light: '#DCFCE7',
          border: '#BBF7D0',
          DEFAULT: '#15803D',
          dark: '#166534',
        },
        match: {
          light: '#E0F2FE',
          border: '#BAE6FD',
          DEFAULT: '#0284C7',
          dark: '#0369A1',
        },
        returned: {
          light: '#F3F4F6',
          border: '#E5E7EB',
          DEFAULT: '#6B7280',
          dark: '#4B5563',
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Prompt', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }],   // 10px micro badges
        'xs-plus': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.01em' }], // 11px category chips
      },
      boxShadow: {
        'warm-sm': '0 1px 2px rgba(45, 32, 22, 0.05)',
        'warm-md': '0 4px 12px -2px rgba(45, 32, 22, 0.07), 0 2px 4px -1px rgba(45, 32, 22, 0.03)',
        'warm-lg': '0 8px 20px -4px rgba(45, 32, 22, 0.08), 0 3px 6px -2px rgba(45, 32, 22, 0.04)',
        'warm-xl': '0 16px 30px -5px rgba(45, 32, 22, 0.1), 0 6px 12px -4px rgba(45, 32, 22, 0.05)',
        'glow-caramel': '0 0 16px -2px rgba(162, 106, 74, 0.2)',
      },
      borderRadius: {
        'lg': '0.75rem',    // 12px (crisp buttons & inputs)
        'xl': '1rem',       // 16px (crisp cards)
        '2xl': '1.25rem',   // 20px (dialog panels)
        '3xl': '1.5rem',    // 24px (macro containers)
      }
    },
  },
  plugins: [],
}
