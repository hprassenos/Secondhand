import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          50: '#faf8f3',
          100: '#f5f0e6',
          200: '#e8ddc7',
          300: '#d9c6a3',
          400: '#c9ad7f',
          500: '#b8935b',
          600: '#a47b47',
          700: '#86643a',
          800: '#6d5232',
          900: '#5a442b',
        },
      },
    },
  },
  plugins: [],
}
export default config
