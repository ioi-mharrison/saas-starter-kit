module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  daisyui: {
    themes: [
      'corporate', 
      'black',
      {
        pulse: {
          "primary": "#2563eb",          // Blue-600
          "secondary": "#059669",        // Emerald-600  
          "accent": "#7c3aed",          // Violet-600
          "neutral": "#374151",         // Gray-700
          "base-100": "#ffffff",        // White
          "base-200": "#f9fafb",        // Gray-50
          "base-300": "#e5e7eb",        // Gray-200
          "info": "#0ea5e9",           // Sky-500
          "success": "#10b981",         // Emerald-500
          "warning": "#f59e0b",         // Amber-500
          "error": "#ef4444",           // Red-500
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
