/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EEEDFE',
          100: '#CECBF6',
          500: '#534AB7',
          700: '#3C3489',
          900: '#26215C',
        },
        success: {
          50:  '#E1F5EE',
          500: '#1D9E75',
          800: '#085041',
        },
        danger: {
          50:  '#FCEBEB',
          500: '#E24B4A',
          800: '#791F1F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    }
  },
  plugins: []
};
