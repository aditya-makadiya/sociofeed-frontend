/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // Blue for buttons, links
        secondary: '#6b7280', // Gray for secondary elements
        error: '#ef4444', // Red for errors
        success: '#10b981', // Green for success
      },
    },
  },
  plugins: [],
}