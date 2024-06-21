/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        calendar: {
          gridLines: colors.gray[200],
          activeMonth: {
            bg: colors.gray[50],
            text: colors.gray[900],
            border: colors.blue[500],
          },
          inActiveMonth: {
            bg: colors.gray[100],
            text: colors.gray[600],
          },
          header: {
            bg: colors.gray[200],
            text: colors.gray[900],
            border: colors.gray[200],
          },
          weekdaysHeader: {
            bg: colors.gray[200],
            text: colors.gray[700],
            border: colors.gray[300],
          },
          weekdays: {
            bg: colors.white,
          },
          daysGrid: {
            text: colors.gray[900],
            bgHover: colors.gray[100],
            today: {
              bg: colors.indigo[600],
              text: colors.white,
              textMobile: colors.indigo[600],
            },
            selected: {
              bg: colors.gray[900],
              text: colors.white,
            },
          },
          events: {
            textRight: colors.gray[500],
            textLeft: colors.gray[900],
            textOverflow: colors.gray[500],
            bgMobile: colors.gray[900],
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
  plugins: [require("@tailwindcss/forms")],
};
