/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'media',
  theme: {
    extends: {
      colors: {
        calendar: {
          activeMonth: {
            bg: colors.gray[50],
            text: colors.gray[900],
            border: colors.blue[500],
          },
          inActiveMonth: {
            bg: colors.gray[200],
            text: colors.gray[400],
          },
          header: {
            bg: colors.gray[200],
            text: colors.gray[900],
            border: colors.gray[200],
          },
          weekdaysHeader: {
            bg: colors.gray[50],
            text: colors.gray[700],
            border: colors.gray[300],
          },
        },
        dark: {
          bg: colors.gray[900],
          border: colors.yellow[400],
          text: colors.gray[50],
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
