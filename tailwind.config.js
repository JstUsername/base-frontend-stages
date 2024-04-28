/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/*.html'],
  theme: {
    fontFamily: {
      roboto_regular : ["roboto_regular", "sans-serif"],
      roboto_medium : ["roboto_medium", "sans-serif"],
    },
    extend: {
      colors: {
        'blue' : '#5095EC',
        'black' : '#505050',
        'second_tx' : '#8F8F8F',
        'grey' : '#D3D8DE',
        'bg' : '#F1F1F1',
        'bg_2' : '#FAFAFA',
      },
    },
  },
  plugins: [],
}

