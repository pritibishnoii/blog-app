/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',    // Indigo
        secondary: '#8B5CF6',  // Purple
        accent: '#10B981',     // Green (success/like states)
        background: '#0F0F17', // near-black
        foreground: '#F3F4F6', // text
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        content: '720px', // reading width, per UI/UX brief
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
