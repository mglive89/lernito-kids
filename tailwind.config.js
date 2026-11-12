/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        creme: '#F6F7FB',
        sonne: { 50: '#FFFAEB', 100: '#FEF0C7', 300: '#FDD272', 500: '#F5A524', 600: '#DB8B0B', 700: '#A15C07' },
        himmel: { 50: '#EFF5FF', 100: '#DCE8FE', 300: '#9DBEFB', 500: '#2F6FEB', 600: '#2459D1', 700: '#1D47A8' },
        minze: { 50: '#ECFDF6', 100: '#D1FAE8', 300: '#7EDDBC', 500: '#12B886', 600: '#0C9A70', 700: '#08725A' },
        koralle: { 50: '#FFF4F2', 100: '#FFE3DE', 300: '#FDA394', 500: '#F0614E', 600: '#D94A37', 700: '#B23A28' },
        lila: { 50: '#F5F3FF', 100: '#EAE5FF', 300: '#BFAEFD', 500: '#7A5AF8', 600: '#6741E8', 700: '#4F33C2' },
        tinte: '#18213D'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif']
      },
      borderRadius: { blob: 'var(--radius-card)' },
      boxShadow: {
        knopf: '0 1px 2px rgba(16,24,40,0.08), 0 3px 0 rgba(16,24,40,0.10)',
        karte: '0 1px 2px rgba(16,24,40,0.04), 0 10px 28px -14px rgba(16,24,40,0.16)',
        weich: '0 1px 2px rgba(16,24,40,0.04), 0 4px 14px -6px rgba(16,24,40,0.14)'
      }
    }
  },
  plugins: []
};
