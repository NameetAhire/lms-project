/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366f1', 50: '#eceafe', 100: '#dddbfd', 200: '#c5c1fb', 300: '#a9a3f8', 400: '#9189f5', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
        secondary: { DEFAULT: '#8b5cf6', 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95' },
        accent: { DEFAULT: '#06b6d4', 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { clay: '0 4px 0 0 rgba(99, 102, 241, 0.2), 0 8px 24px -4px rgba(99, 102, 241, 0.25)', card: '0 2px 0 0 rgba(0, 0, 0, 0.05), 0 12px 32px -8px rgba(0,0,0,0.1)' }
    }
  },
  plugins: []
};
