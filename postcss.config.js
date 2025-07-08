// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ NEW plugin name (required for Tailwind v4+)
    autoprefixer: {},
  },
};
