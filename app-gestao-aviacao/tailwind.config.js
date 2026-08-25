/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base do sistema — Clean Dark Split
        bg: {
          DEFAULT: '#111827',   // fundo geral
          surface: '#1F2937',   // cards, inputs
        },
        brand: {
          DEFAULT: '#1E3A5F',   // painel esquerdo navy
          light: '#254875',     // hover do painel
        },
        primary: {
          DEFAULT: '#3B82F6',   // botão e links de ação
          hover: '#2563EB',     // hover do botão
          muted: '#1D4ED8',     // active
        },
        content: {
          DEFAULT: '#F9FAFB',   // texto principal
          muted: '#9CA3AF',     // texto secundário
          subtle: '#6B7280',    // placeholder
        },
        border: {
          DEFAULT: '#374151',   // bordas
          focus: '#3B82F6',     // borda ao focar input
        },
        feedback: {
          error: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
    },
  },
  plugins: [],
}
