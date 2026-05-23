/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#121417',
        mist: '#f5f7fb',
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e'
        },
        ember: '#f97316',
        berry: '#be123c'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.10)'
      }
    }
  },
  plugins: []
};
