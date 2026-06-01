/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 55px rgba(15, 23, 42, 0.10)',
        glow: '0 20px 60px rgba(37, 99, 235, 0.25)',
      },
    },
  },
  plugins: [],
};
