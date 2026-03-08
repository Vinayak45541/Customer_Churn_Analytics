/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // Teal
        secondary: "#1f2937",
        accent: "#f59e0b"
      }
    },
  },
  plugins: [],
}
