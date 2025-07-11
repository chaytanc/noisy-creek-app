/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pnw-blue': '#1e40af',
        'pnw-green': '#166534',
        'pnw-yellow': '#fcd34d',
        'pnw-purple': '#7c3aed',
      },
      fontFamily: {
        'pixel': ['Orbitron', 'monospace'],
      },
    },
  },
  plugins: [],
}