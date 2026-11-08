/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        creme: '#F5F7FB',
        sonne: { 50: '#FFFAEB', 100: '#FFF1CC', 300: '#FFD166', 500: '#FFB020', 700: '#B86E00' },
        himmel: { 50: '#F0F6FF', 100: '#DCEBFF', 300: '#93C2FF', 500: '#2F7DEB', 700: '#1B4FA8' },
        minze: { 50: '#EEFBF7', 100: '#D5F5EC', 300: '#7FDCC3', 500: '#14B8A6', 700: '#0B7468' },
        koralle: { 50: '#FFF3F1', 100: '#FFE1DC', 300: '#FF9E8F', 500: '#F25F4C', 700: '#B23A28' },
        lila: { 50: '#F5F2FF', 100: '#E9E3FF', 300: '#BBA8FF', 500: '#7C5CFA', 700: '#4F33C2' },
        tinte: '#1F2340'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif']
      },
      borderRadius: { blob: 'var(--radius-card)' },
      boxShadow: {
        knopf: '0 1px 2px rgba(16,24,40,0.08), 0 3px 0 rgba(16,24,40,0.10)',
        karte: '0 1px 2px rgba(16,24,40,0.05), 0 12px 32px -14px rgba(16,24,40,0.22)',
        weich: '0 1px 2px rgba(16,24,40,0.04), 0 4px 14px -6px rgba(16,24,40,0.14)'
      }
    }
  },
  plugins: []
};
