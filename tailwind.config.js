// tailwind.config.js
// module.exports = {
//   darkMode: 'class',
//   // ...rest
// }

// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Onest', 'sans-serif'],
        script: ['Style Script', 'cursive'],
      },
    },
  },
  plugins: [],
};