/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7CC5FB',
          400: '#36A4F5',
          500: '#2C91E3', // Favicon primary color
          600: '#1A74C4',
          700: '#145B9C',
          800: '#144D81',
          900: '#14416A',
          950: '#0D2A47',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'float': '0 10px 25px -5px rgba(44, 145, 227, 0.15), 0 8px 10px -6px rgba(44, 145, 227, 0.1)',
      }
    },
  },
  plugins: [],
};
