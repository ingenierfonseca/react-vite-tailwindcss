/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Esto conectará con tu variable de la DB en .NET
        primary: {
          DEFAULT: 'var(--color-primary, #f97316)', 
          foreground: 'var(--color-primary-foreground, #ffffff)',
        },
      },
    },
  },
  plugins: [],
}