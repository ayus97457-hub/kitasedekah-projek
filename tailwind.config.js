/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#176B4D',
        mint: '#E8F4EC',
        ink: '#17352A',
        muted: '#718078',
        canvas: '#F5F8F5'
      },
      boxShadow: {
        soft: '0 12px 36px rgba(28, 69, 48, 0.07)'
      }
    }
  },
  plugins: []
}
