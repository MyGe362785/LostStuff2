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
          paper: 'rgb(var(--brand-paper) / <alpha-value>)',
          cream: 'rgb(var(--brand-cream) / <alpha-value>)',
          sand: 'rgb(var(--brand-sand) / <alpha-value>)',
          tan: 'rgb(var(--brand-tan) / <alpha-value>)',
          latte: 'rgb(var(--brand-latte) / <alpha-value>)',
          caramel: 'rgb(var(--brand-caramel) / <alpha-value>)',
          chestnut: 'rgb(var(--brand-chestnut) / <alpha-value>)',
          mocha: 'rgb(var(--brand-mocha) / <alpha-value>)',
          espresso: 'rgb(var(--brand-espresso) / <alpha-value>)',
        },
        lost: {
          light: 'rgb(var(--status-lost-light) / <alpha-value>)',
          border: 'rgb(var(--status-lost-border) / <alpha-value>)',
          DEFAULT: 'rgb(var(--status-lost) / <alpha-value>)',
          dark: 'rgb(var(--status-lost-dark) / <alpha-value>)',
        },
        found: {
          light: 'rgb(var(--status-found-light) / <alpha-value>)',
          border: 'rgb(var(--status-found-border) / <alpha-value>)',
          DEFAULT: 'rgb(var(--status-found) / <alpha-value>)',
          dark: 'rgb(var(--status-found-dark) / <alpha-value>)',
        },
        match: {
          light: 'rgb(var(--status-match-light) / <alpha-value>)',
          border: 'rgb(var(--status-match-border) / <alpha-value>)',
          DEFAULT: 'rgb(var(--status-match) / <alpha-value>)',
          dark: 'rgb(var(--status-match-dark) / <alpha-value>)',
        },
        returned: {
          light: 'rgb(var(--status-returned-light) / <alpha-value>)',
          border: 'rgb(var(--status-returned-border) / <alpha-value>)',
          DEFAULT: 'rgb(var(--status-returned) / <alpha-value>)',
          dark: 'rgb(var(--status-returned-dark) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Kanit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Kanit', 'system-ui', 'sans-serif'],
        mono: ['Kanit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.02em' }],   // 10px micro badges
        'xs-plus': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.01em' }], // 11px category chips
      },
      boxShadow: {
        'warm-sm': 'var(--shadow-sm)',
        'warm-md': 'var(--shadow-md)',
        'warm-lg': 'var(--shadow-lg)',
        'warm-xl': 'var(--shadow-xl)',
        'glow-caramel': 'var(--shadow-focus)',
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
