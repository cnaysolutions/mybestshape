/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: '#f0ebe0',
        ink: '#0a0a0a',
        red: '#d32027',
        'red-light': '#e8575c',
        'red-dark': '#9a161b',
        yellow: '#f5c518',
        'yellow-light': '#f8d75e',
        'yellow-dark': '#b8920f',
        blue: '#1c4fb5',
        'blue-light': '#4a7ad4',
        'blue-dark': '#0f3478',
        'gray-100': '#e8e3d8',
        'gray-200': '#d4cfc4',
        'gray-300': '#b0ab9f',
        'gray-400': '#7a756b',
        'gray-500': '#4a4640',
      },
      fontFamily: {
        display: ['"Josefin Sans"', '"Century Gothic"', '"Futura"', 'sans-serif'],
        sketch: ['"Caveat"', 'cursive'],
        body: ['"Helvetica Neue"', '"Arial"', 'sans-serif'],
        mono: ['"Courier New"', '"Courier"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
        '9': '96px',
        '10': '128px',
      },
    },
  },
  plugins: [],
}
