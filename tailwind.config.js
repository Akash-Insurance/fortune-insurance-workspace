/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fortune: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#bae0fd',
          500: '#1e50a2',
          600: '#1a438a',
          700: '#163670',
          800: '#1e3a8a',
          900: '#0f172a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
    },
  },
  plugins: [],
};
