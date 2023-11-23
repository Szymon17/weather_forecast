/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        whiteBottom: "0 8px 10px -3px rgb(252, 252, 252, 0.4)",
        full: "0 2px 8px 2px rgb(0, 0, 0, 0.5)",
        fullHover: "0 2px 8px 2px rgb(0, 0, 0, 0.5), inset 0 0 2px 1px rgb(0, 0, 0, 0.5)",
      },
      colors: {
        glass: "#404040",
        glassDarker: "#333333",
      },

      height: {
        "1/2-screen": "50vh",
      },
    },
  },
  plugins: [],
};
