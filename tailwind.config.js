/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      currentMonthBg: "bg-white", // Witte achtergrond voor de huidige maand
      currentMonthText: "text-gray-700", // Zwarte tekst voor de huidige maand
      otherMonthBg: "bg-gray-200", // Grijze achtergrond voor andere maanden
      otherMonthText: "text-gray-500", // Lichtere grijze tekst voor andere maanden
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
