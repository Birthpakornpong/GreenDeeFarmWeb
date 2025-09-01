module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      'DEFAULT': '0.25rem',
      'md': '0.375rem',
      'lg': '0.5rem',
      'full': '9999px',
      'large': '12px',
      '50': '50px',
      '75': '75px',
      '100': '100px',
      'half': '50%'
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman',
    },
    extend: {
      colors: {
        blue: {
          primary: "#002169",
          sky: "#accbee",
          neon: "#00f2fe",
          secondary: "#3BBDFE",
          secondary_light: "#E8F4FA",
          "5f": "#5fcefe",
          "CA": "#cae1fc"
        },
        gray: {
          light: "#E8E8E9",
          text: "#777777",
          thin_light: "#f4f3f3",
          thin: "#c2c2c2",
          border: "#d4d7d7",
          link: "#666666"
        },
        black: {
          text: "#333333"
        },
        red: {
          default: "#fe3b1f"
        },
        orange: {
          default: "#df6436",
          light: "#f1a61a",
          secondary: "#EAC0A8",
          thin: "#f4f3ec"
        }
      },
      backgroundImage: {
        'bg1': "url('/assets/bg/bg1.svg')",
        'order-place': "url('/assets/images/order_place.webp')",
        'new': "url('/assets/bg/bg_new.jpeg')",
      },
      height: {
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
      }
    },
    fontSize: {
      'xss': '.625rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
}
