/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050816',
        surface: '#0D1428',
        surface2: '#111A33',
        accent: '#00CFFF',
        blue: { DEFAULT: '#2F6BFF', deep: '#2563EB' },
        violet: { DEFAULT: '#7C3AED' },
        line: '#1E2A44',
        ink: '#F8FAFC',
        muted: '#94A3B8',
        ok: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00CFFF 0%, #2563EB 55%, #7C3AED 100%)',
        'btn-gradient': 'linear-gradient(135deg, #2F6BFF 0%, #00CFFF 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,207,255,0.25), 0 8px 40px -8px rgba(0,207,255,0.35)',
        card: '0 10px 40px -20px rgba(0,0,0,0.8)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        blink: { '50%': { opacity: 0 } },
        spin360: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-in': 'fade-in .6s ease both',
        'slide-up': 'slide-up .6s ease both',
        blink: 'blink 1s steps(1) infinite',
        spin360: 'spin360 18s linear infinite',
      },
    },
  },
  plugins: [],
}
