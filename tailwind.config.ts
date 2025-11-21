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
        // Primary Brand Colors
        empire: {
          green: '#496D4B',      // Dark Green - Main accent
          gold: '#A39871',       // Gold - Secondary accent
          black: '#2A2A2A',      // Text/Strong contrast
        },
        // Neutral & Background Colors
        cream: {
          50: '#F8F8F4',         // Primary background
          100: '#F5F5EC',        // Alternate background
          200: '#E0E0DB',        // Light grey - cards/dividers
          300: '#D4D4CE',        // Subtle dividers
          400: '#8C8C85',        // Medium grey - secondary text
          500: '#7A7A72',        // Borders
        },
        // Complementary Accents
        accent: {
          teal: '#3B7A77',       // Deep teal - hover states
          rust: '#B86F5D',       // Earthy rust - alerts/highlights
        },
        // Keep vintage as alias for backwards compatibility
        vintage: {
          50: '#F8F8F4',
          100: '#F5F5EC',
          200: '#E0E0DB',
          300: '#D4D4CE',
          400: '#8C8C85',
          500: '#7A7A72',
          600: '#496D4B',        // Primary green
          700: '#3d5b3f',        // Darker green
          800: '#2A2A2A',        // Near black
          900: '#1a1a1a',        // Black
        },
      },
    },
  },
  plugins: [],
}
export default config
