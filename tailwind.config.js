/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(14, 165, 233, 0.12)',
        'card-hover': '0 8px 32px -4px rgba(14, 165, 233, 0.22)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0c4a6e 0%, #134e4a 100%)',
      },
    },
  },
  plugins: [],
}
