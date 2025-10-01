/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Helvetica"', "sans-serif"],
      },
      boxShadow: {
        'gray': '4px 0px 16px 0px rgba(0, 0, 0, 0.08)',
        'upper-shadow': '0px -4px 16px 0px rgba(0, 0, 0, 0.08)',
      },
      borderColor: {
        'gray': 'rgba(209, 207, 207, 1)',
      },
      textColor: {
        'gray': 'rgba(105, 105, 105, 1)',
        'activity-name-checkout-page': 'rgba(33, 33, 33, 0.75)',
        '#626262': 'rgba(98, 98, 98, 1)',
        'activity-description': 'rgba(105, 105, 105, 1)' 
      },
      backgroundColor: {
        'discountStrip': 'rgba(26, 172, 109, 1)',
        'mint-green': 'rgba(173, 235, 179, 1)',
        'coins': 'rgba(141, 255, 163, 1)'
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
