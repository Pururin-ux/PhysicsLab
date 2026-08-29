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
        // Семантические токены: компоненты обязаны использовать их вместо
        // случайных white/NN. Интенсивность текста: strong > base > muted >
        // soft > faint. Значения faint/soft — всё ещё контрастные на #0B0F17.
        ink: {
          strong: 'rgba(255,255,255,0.96)',
          base: 'rgba(244,247,250,0.86)',
          muted: 'rgba(238,243,248,0.72)',
          soft: 'rgba(232,238,245,0.62)',
          faint: 'rgba(226,233,241,0.52)',
        },
        line: {
          subtle: 'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.18)',
        },
        surface: {
          1: 'rgba(255,255,255,0.022)',
          2: 'rgba(255,255,255,0.045)',
          3: 'rgba(255,255,255,0.075)',
          panel: 'rgba(15,22,35,0.72)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Единая шкала вместо text-[NNpx] по всему проекту.
        'display-sm': ['1.75rem', { lineHeight: '1.14', letterSpacing: '-0.015em' }],
        'display-md': ['2.125rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-lg': ['2.625rem', { lineHeight: '1.06', letterSpacing: '-0.022em' }],
        'title-md': ['1.375rem', { lineHeight: '1.22', letterSpacing: '-0.01em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.14em' }],
        caption: ['0.75rem', { lineHeight: '1.45' }],
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
        'panel': '0 1px 0 rgba(255,255,255,0.035) inset, 0 18px 46px rgba(0,0,0,0.38)',
      },
      maxWidth: {
        // Длина строки для читаемого текста.
        measure: '68ch',
      },
    },
  },
}

export default config
