module.exports = {
  content: ["./src/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        white: "#F9FBFD",
        black: "#0F0E13",
        gray: "#909092",
        blue: "#475569",
        primary: "#662483",
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "1025px",
        xl: "1200px",
        "2xl": "1672px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
