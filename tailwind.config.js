/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      container: {
        center: true,
        padding: '0.75rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1024px',
          '2xl': '1024px',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-circular-primary': 'radial-gradient(circle at 20% 50%, rgba(37, 52, 63, 0.15) 0%, transparent 50%)',
        'gradient-circular-secondary': 'radial-gradient(circle at 80% 80%, rgba(191, 201, 209, 0.15) 0%, transparent 50%)',
        'gradient-circular-accent': 'radial-gradient(circle at 50% 0%, rgba(255, 155, 81, 0.1) 0%, transparent 60%)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          // Brand / UI accents
          "primary": "#25343F",
          "primary-content": "#EAEFEF",

          "secondary": "#BFC9D1",
          "secondary-content": "#25343F",

          "accent": "#FF9B51",
          "accent-content": "#25343F",

          // Background layers
          "base-100": "#EAEFEF",   // Page background
          "base-200": "#DDE5E5",   // Sections
          "base-300": "#BFC9D1",   // Cards

          // Text
          "base-content": "#25343F",

          // Neutral
          "neutral": "#25343F",
          "neutral-content": "#EAEFEF",

          // Status colors (harmonized)
          "info": "#4A90A4",
          "success": "#4CAF7A",
          "warning": "#FF9B51",
          "error": "#D9534F",
        },

        dark: {
          // Brand / UI accents
          "primary": "#22C55E",
          "primary-content": "#0A0A0A",

          "secondary": "#16A34A",
          "secondary-content": "#F0FDF4",

          "accent": "#4ADE80",
          "accent-content": "#0A0A0A",

          // Background layers - Jet Black
          "base-100": "#0F0F0F",   // Page background (jet black)
          "base-200": "#1A1A1A",   // Sections
          "base-300": "#262626",   // Cards

          // Text
          "base-content": "#F5F5F5",

          // Neutral
          "neutral": "#1A1A1A",
          "neutral-content": "#E5E5E5",

          // Status colors (green accents)
          "info": "#06B6D4",
          "success": "#22C55E",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  },
}
