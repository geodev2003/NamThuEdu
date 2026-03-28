/** @type {import('tailwindcss').Config} */
// THEME: Orange & White - Modern Educational Platform
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Orange Palette
        primary: {
          DEFAULT: '#FF8C42',
          dark: '#FF6B35',
          light: '#FFA726',
          soft: '#FFF4E6',
          pale: '#FFF9F0',
        },
        // Accent - Light Orange
        accent: {
          DEFAULT: '#FFB74D',
          soft: '#FFE0B2',
        },
        // Neutral
        dark: '#2D2D2D',
        gray: '#666666',
        bg: '#FFFFFF',
        bgLight: '#FAFAFA',
      },
    },
  },
  plugins: [],
}
