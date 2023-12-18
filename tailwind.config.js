/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(250, 35, 59)",
        bgPrimary: "#f4f4f4",
        textPrimary: "rgb(31, 31, 31)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
