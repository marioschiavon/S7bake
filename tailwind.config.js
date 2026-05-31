/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf3f4',
          100: '#fbe4e6',
          200: '#f7ced2',
          300: '#f0adb5',
          400: '#e5808b',
          500: '#d55a68',
          600: '#bd404f',
          700: '#9e323e',
          800: '#842c36',
          900: '#702932',
          950: '#3e1217',
        }
      }
    },
  },
  plugins: [],
}
