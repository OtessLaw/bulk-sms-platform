/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#E7D3A4',
          DEFAULT: '#D4AF6A',
          dark: '#B88E3E',
        },
      },
    },
  },
  plugins: [],
};
