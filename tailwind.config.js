/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,css,js}", "./views/*.ejs"],

  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
