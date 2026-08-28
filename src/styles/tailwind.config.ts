import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary - Vibrant Yellow
        primary: '#deed00',
        'on-primary': '#2f3300',
        'primary-container': '#deed00',
        'on-primary-container': '#626900',
        'primary-fixed': '#deed00',
        'primary-fixed-dim': '#c3d000',
        'on-primary-fixed': '#1b1d00',
        'on-primary-fixed-variant': '#454a00',

        // Secondary - Deep Navy
        secondary: '#bfc5e4',
        'on-secondary': '#292f48',
        'secondary-container': '#424862',
        'on-secondary-container': '#b1b7d6',
        'secondary-fixed': '#dce1ff',
        'secondary-fixed-dim': '#bfc5e4',
        'on-secondary-fixed': '#141a32',
        'on-secondary-fixed-variant': '#3f465f',

        // Tertiary - Midnight Blue
        tertiary: '#ffffff',
        'on-tertiary': '#262f4c',
        'tertiary-container': '#dbe1ff',
        'on-tertiary-container': '#5a6383',
        'tertiary-fixed': '#dbe1ff',
        'tertiary-fixed-dim': '#bdc5e9',
        'on-tertiary-fixed': '#111a36',
        'on-tertiary-fixed-variant': '#3d4664',

        // Surface - Tonal Layers
        surface: '#111317',
        'surface-dim': '#111317',
        'surface-bright': '#37393d',
        'surface-container-lowest': '#0c0e12',
        'surface-container-low': '#1a1c1f',
        'surface-container': '#1e2023',
        'surface-container-high': '#282a2e',
        'surface-container-highest': '#333539',
        'on-surface': '#e2e2e7',
        'on-surface-variant': '#c8c8ab',
        'surface-variant': '#333539',
        'surface-tint': '#c3d000',

        // Inverse
        'inverse-surface': '#e2e2e7',
        'inverse-on-surface': '#2e3034',
        'inverse-primary': '#5c6300',

        // Outline & Background
        outline: '#929277',
        'outline-variant': '#474832',
        background: '#111317',
        'on-background': '#e2e2e7',

        // Status Colors
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',

        // Success (Electric Green)
        success: '#1fc437',
        'on-success': '#000000',
      },

      fontFamily: {
        'display-metrics': ['Anybody', 'sans-serif'],
        'headline-lg': ['Anybody', 'sans-serif'],
        'headline-lg-mobile': ['Anybody', 'sans-serif'],
        'headline-md': ['Anybody', 'sans-serif'],
        'body-lg': ['Lexend', 'sans-serif'],
        'body-md': ['Lexend', 'sans-serif'],
        'label-caps': ['Space Grotesk', 'sans-serif'],
        'stats-value': ['Space Grotesk', 'sans-serif'],
      },

      fontSize: {
        'display-metrics': ['64px', { lineHeight: '64px', letterSpacing: '-0.04em', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.1em', fontWeight: '700' }],
        'stats-value': ['20px', { lineHeight: '24px', fontWeight: '600' }],
      },

      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },

      spacing: {
        base: '4px',
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        gutter: '16px',
        'margin-mobile': '20px',
      },

      boxShadow: {
        'glow-primary': '0 0 16px rgba(222, 237, 0, 0.3)',
        'glow-primary-strong': '0 0 24px rgba(222, 237, 0, 0.5)',
        'glow-secondary': '0 0 12px rgba(191, 197, 228, 0.2)',
      },
    },
  },
  plugins: [],
}

export default config
