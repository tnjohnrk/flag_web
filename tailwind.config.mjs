/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "300px",
      sm: "640px",
      md: "768px",
      lg: "1080px",
      xl: "1280px",
      ["2xl"]: "1530px"
    },
    extend: {
      colors: {
        'flag-navy': 'var(--flag-navy)',
        'flag-deep-navy': 'var(--flag-deep-navy)',
        'flag-blue': 'var(--flag-blue)',
        'flag-yellow': 'var(--flag-yellow)',
        'flag-orange': 'var(--flag-orange)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        border: 'var(--border)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
};
