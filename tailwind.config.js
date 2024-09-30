/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        bgF8F8FC: '#F8F8FC',
        primary: '#1CA3AB',
        accentprimary: '#1CDFEA',
        abuabu: '#757575',
        pink1: '#F4B1C9',
        pink2: '#F0A1DB',
        ungu1: '#B2AAE9',
        abutext: '#757575',
        primary1: '#2F455C',
        disable: '#5b80a6'
      },
      boxShadow: {
        'custom': '0px 4px 4px 0px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        'fold': '200px'
      },
      fontSize: {
        kecil: '0.7rem',
        sedang: '0.75rem',
        sedangdikit: '0.8rem'
      }
    },
  },
  plugins: [],
}
