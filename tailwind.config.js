/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'faith-blue': {
          50: '#EAF6FF',
          100: '#D5EDFF',
          200: '#78BDE8',
          400: '#78BDE8',
          600: '#4A9FD8',
        },
        'faith-green': {
          50: '#E8F6F0',
          100: '#D0EDEA',
          400: '#168F78',
          600: '#0F6B5E',
        },
        'faith-navy': {
          900: '#17324D',
          800: '#1F3D55',
          700: '#2A4A65',
        },
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '44px'],
        '5xl': ['48px', '52px'],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 8px 24px rgba(22, 143, 120, 0.12)',
        'xl': '0 12px 32px rgba(22, 143, 120, 0.15)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'gutter': '16px',
      },
    },
  },
  plugins: [],
}
