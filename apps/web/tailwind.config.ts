import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#0B0F17',
          900: '#0F1623',
          800: '#141E2E',
          700: '#1E293B',
        },
        nova: {
          cyan: '#00E0FF',
          'cyan-20': 'rgba(0,224,255,0.20)',
          'cyan-10': 'rgba(0,224,255,0.10)',
          'cyan-05': 'rgba(0,224,255,0.05)',
          blue: '#2D9CFF',
          gold: '#D4AF37',
          'gold-20': 'rgba(212,175,55,0.20)',
          'gold-10': 'rgba(212,175,55,0.10)',
          ember: '#FF7A45',
          'ember-20': 'rgba(255,122,69,0.20)',
          'ember-10': 'rgba(255,122,69,0.10)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        option: '11px',
        badge: '6px',
        full: '9999px',
      },
      boxShadow: {
        'cyan-glow': '0 0 22px rgba(0,224,255,0.25)',
        'gold-glow': '0 0 22px rgba(212,175,55,0.25)',
        'ember-glow': '0 0 22px rgba(255,122,69,0.28)',
        'card': '0 4px 40px rgba(0,0,0,0.45)',
      },
    },
  },
}

export default config
