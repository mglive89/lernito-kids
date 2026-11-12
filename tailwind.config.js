/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Farben als CSS-Variablen (src/index.css): helles und dunkles Thema
        creme: 'rgb(var(--c-creme) / <alpha-value>)',
        flaeche: 'rgb(var(--c-flaeche) / <alpha-value>)',
        tinte: { DEFAULT: 'rgb(var(--c-tinte) / <alpha-value>)', fest: 'rgb(var(--c-tinte-fest) / <alpha-value>)' },
        // immer dunkel, z. B. Text auf Gelb
        nacht: '#18213D',
        sonne: { 50: 'rgb(var(--c-sonne-50) / <alpha-value>)', 100: 'rgb(var(--c-sonne-100) / <alpha-value>)', 300: 'rgb(var(--c-sonne-300) / <alpha-value>)', 500: '#F5A524', 600: '#DB8B0B', 700: 'rgb(var(--c-sonne-700) / <alpha-value>)' },
        himmel: { 50: 'rgb(var(--c-himmel-50) / <alpha-value>)', 100: 'rgb(var(--c-himmel-100) / <alpha-value>)', 300: 'rgb(var(--c-himmel-300) / <alpha-value>)', 500: '#2F6FEB', 600: '#2459D1', 700: 'rgb(var(--c-himmel-700) / <alpha-value>)' },
        minze: { 50: 'rgb(var(--c-minze-50) / <alpha-value>)', 100: 'rgb(var(--c-minze-100) / <alpha-value>)', 300: 'rgb(var(--c-minze-300) / <alpha-value>)', 500: '#12B886', 600: '#0C9A70', 700: 'rgb(var(--c-minze-700) / <alpha-value>)' },
        koralle: { 50: 'rgb(var(--c-koralle-50) / <alpha-value>)', 100: 'rgb(var(--c-koralle-100) / <alpha-value>)', 300: 'rgb(var(--c-koralle-300) / <alpha-value>)', 500: '#F0614E', 600: '#D94A37', 700: 'rgb(var(--c-koralle-700) / <alpha-value>)' },
        lila: { 50: 'rgb(var(--c-lila-50) / <alpha-value>)', 100: 'rgb(var(--c-lila-100) / <alpha-value>)', 300: 'rgb(var(--c-lila-300) / <alpha-value>)', 500: '#7A5AF8', 600: '#6741E8', 700: 'rgb(var(--c-lila-700) / <alpha-value>)' }
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
