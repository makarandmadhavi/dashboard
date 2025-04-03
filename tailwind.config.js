/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
      // etc...
    ],
    theme: {
      extend: {
        // If you want custom colors or other custom theming:
        // colors: {
        //   brand: { DEFAULT: '#14b8a6' },
        // },
      },
    },
    plugins: [
      // e.g. require('@tailwindcss/forms'),
    ],
  };
  