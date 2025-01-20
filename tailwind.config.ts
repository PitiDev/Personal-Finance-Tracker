import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EBF5FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212'
        }
      },
      backgroundColor: {
        'light': '#FFFFFF',
        'dark': '#121212'
      },
      textColor: {
        'light': '#333333',
        'dark': '#FFFFFF'
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms'
      },
      fontSize: {
        'xxxs': '0.5rem',
        'xxs': '0.65rem'
      },
      boxShadow: {
        'light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dark': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)'
      },
      borderRadius: {
        'xs': '0.125rem'
      },
      extend: {
        fontFamily: {
          sans: ['Arial', 'sans-serif'],
          lo: ['Noto Sans Lao', 'sans-serif'],
          jp: ['Noto Sans JP', 'sans-serif'],
          th: ['Noto Sans Thai', 'sans-serif'],
        },
      },
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
    }
  },
  plugins: [
    // Optional: Add plugins like form styling, typography, etc.
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography')
  ],
}

export default config