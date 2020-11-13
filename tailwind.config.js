const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = defaultTheme.fontFamily;
fontFamily['sans'] = [
  'Roboto', // <-- Roboto is a default sans font now
  'system-ui'// <-- you may provide more font fallbacks here
];

module.exports = {
  purge: [],
  theme: {
    fontFamily: fontFamily, 
    extend: {
        width: theme => ({
          "w-18": "4.5rem"
        }),
        height: theme => ({
          "screen/2": "50vh",
          "screen/1.25": "calc(100vh / 1.25)",
        }),
      },
  },
  variants: {},
  plugins: [],
};