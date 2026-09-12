import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ночная lofi-палитра PhysicsLab. Значения — единый источник для всех
        // утилит bg-space-* / text-nova-*, поэтому смена тут двигает весь сайт.
        space: {
          950: '#080E1A', // --background-deep
          925: '#0C1120',
          900: '#11162A', // --surface-primary
          850: '#171C35', // --surface-secondary
          800: '#1F2547',
          700: '#2C3358',
        },
        nova: {
          cyan: '#6EE7FF', // --physics-cyan: только графики/траектории/значения
          'cyan-20': 'rgba(110,231,255,0.20)',
          'cyan-10': 'rgba(110,231,255,0.10)',
          'cyan-05': 'rgba(110,231,255,0.05)',
          blue: '#9A8CFF', // светлая лаванда: ссылки, активная навигация, hover действия
          indigo: '#7856FA', // --action-primary: WCAG AA с белым текстом
          'indigo-20': 'rgba(120,86,250,0.20)',
          'indigo-10': 'rgba(120,86,250,0.10)',
          gold: '#FFB86C', // --ambient-warm: ламповый свет, мягкие рекомендации
          'gold-20': 'rgba(255,184,108,0.20)',
          'gold-10': 'rgba(255,184,108,0.10)',
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
        // Никаких больших неоновых «подушек». Тени — направленные и тихие;
        // основная кнопка выделяется цветом и контрастом, а не размытым ореолом.
        'cyan-glow': '0 0 18px rgba(110,231,255,0.16)',
        'indigo-glow': '0 8px 20px rgba(120,86,250,0.28)',
        'ember-glow': '0 0 20px rgba(255,184,108,0.20)',
        'card': '0 20px 44px rgba(4,7,16,0.42), inset 0 1px 0 rgba(255,255,255,0.03)',
        'lamp': '0 -2px 60px 6px rgba(255,184,108,0.10)',
      },
    },
  },
}

export default config
