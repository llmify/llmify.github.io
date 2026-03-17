/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './insights/**/*.html',
    './_partials/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6BA5F2',
        'brand-dark': '#4A8CE8',
        'brand-light': '#F0F6FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
