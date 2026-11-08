/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        creme: '#FFF8E7',
        sonne: { 100: '#FFF1CC', 300: '#FFD166', 500: '#FFB627', 700: '#C77D00' },
        himmel: { 100: '#DDF1FF', 300: '#8ED1FC', 500: '#3A9BDC', 700: '#1D5F8F' },
        minze: { 100: '#DDF7EC', 300: '#8EE3BF', 500: '#2EC4B6', 700: '#137A70' },
        koralle: { 100: '#FFE3DE', 300: '#FF9F8E', 500: '#FF6F59', 700: '#B83A26' },
        lila: { 100: '#EFE5FF', 300: '#C3A6FF', 500: '#8E6CEF', 700: '#5233B0' },
        tinte: '#2B2D42'
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Nunito', 'system-ui', 'sans-serif']
      },
      borderRadius: { blob: '2rem' },
      boxShadow: {
        knopf: '0 6px 0 rgba(43,45,66,0.18)',
        karte: '0 10px 30px -10px rgba(43,45,66,0.25)'
      }
    }
  },
  plugins: []
};
