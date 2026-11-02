/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7EA',
          100: '#F6EBC4',
          200: '#EFD98E',
          300: '#E6C25B',
          400: '#D9A93A',
          500: '#C48B1F',
          600: '#A8741A',
          700: '#84580F',
          800: '#5E3D0E',
          900: '#3D2809',
        },
        ink: {
          50: '#F7F6F3',
          100: '#ECEAE4',
          200: '#D8D5CC',
          300: '#B3AEA2',
          400: '#8A8579',
          500: '#66615A',
          600: '#4A4641',
          700: '#33312D',
          800: '#221F1C',
          900: '#151412',
        },
        ocean: {
          50: '#EEF8F9',
          100: '#D2EEF1',
          300: '#7CC9D1',
          500: '#1B8A99',
          600: '#146F7C',
          700: '#0F5560',
        },
        emerald: {
          50: '#E9F7EE',
          500: '#16803C',
          700: '#0E5A2A',
        },
        amber: {
          50: '#FEF6E7',
          500: '#B45309',
          700: '#8A3F07',
        },
        crimson: {
          50: '#FDECEA',
          600: '#B42318',
          700: '#912018',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 24px 60px -24px rgba(196, 139, 31, 0.55)',
        soft: '0 18px 50px -28px rgba(21, 20, 18, 0.25)',
      },
    },
  },
  plugins: [],
};
