import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#07081E',
          925: '#0A0B25',
          900: '#10112E',
          850: '#17183A',
          800: '#202047',
          700: '#343060',
        },
        nova: {
          cyan: '#79D9EE',
          'cyan-20': 'rgba(121,217,238,0.20)',
          'cyan-10': 'rgba(121,217,238,0.10)',
          'cyan-05': 'rgba(121,217,238,0.05)',
          blue: '#8D83F4',
          indigo: '#6558D8',
          'indigo-20': 'rgba(101,88,216,0.20)',
          'indigo-10': 'rgba(101,88,216,0.10)',
          gold: '#E8B66D',
          'gold-20': 'rgba(232,182,109,0.20)',
          'gold-10': 'rgba(232,182,109,0.10)',
          pink: '#E079C7',
          'pink-20': 'rgba(224,121,199,0.20)',
          'pink-10': 'rgba(224,121,199,0.10)',
          ember: '#F39A82',
          'ember-20': 'rgba(243,154,130,0.20)',
          'ember-10': 'rgba(243,154,130,0.10)',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        display: ['var(--font-unbounded)', 'var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        option: '11px',
        badge: '8px',
        full: '9999px',
      },
      boxShadow: {
        'cyan-glow': '0 0 24px rgba(121,217,238,0.22)',
        'indigo-glow': '0 12px 30px rgba(101,88,216,0.28)',
        'pink-glow': '0 0 28px rgba(224,121,199,0.22)',
        'ember-glow': '0 0 24px rgba(243,154,130,0.24)',
        'card': '0 18px 48px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.035)',
      },
    },
  },
}

export default config
