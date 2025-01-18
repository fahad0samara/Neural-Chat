/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          light: 'var(--color-background-light)',
          dark: 'var(--color-background-dark)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '20px',
        '3xl': '30px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    function({ addUtilities, theme }) {
      const utilities = {
        '.glass': {
          '@apply backdrop-blur-lg': {},
          'background': 'var(--glass-background)',
        },
        '.text-gradient': {
          '@apply bg-clip-text text-transparent': {},
          'background-image': 'linear-gradient(to right, var(--color-primary), var(--color-accent))',
        },
      };
      addUtilities(utilities);
    },
  ],
}
