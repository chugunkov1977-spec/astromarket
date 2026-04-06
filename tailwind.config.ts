import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основная палитра — глубокий мистический
        primary: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#dcceff',
          300: '#c3a6ff',
          400: '#a571ff',
          500: '#8b3dff',
          600: '#7c1fff',
          700: '#6d10eb',
          800: '#5b0fc5',
          900: '#4b0fa1',
          950: '#2d0070',
        },
        // Акцент — золотой/янтарный
        accent: {
          50: '#fffbeb',
          100: '#fff3c6',
          200: '#ffe588',
          300: '#ffd24a',
          400: '#ffbf20',
          500: '#f99b07',
          600: '#dd7302',
          700: '#b75006',
          800: '#943d0c',
          900: '#7a330d',
          950: '#461902',
        },
        // Тёмный фон
        dark: {
          50: '#f6f6f9',
          100: '#ededf1',
          200: '#d7d7e0',
          300: '#b4b4c5',
          400: '#8b8ba5',
          500: '#6d6d8a',
          600: '#575772',
          700: '#47475d',
          800: '#3d3d4f',
          900: '#1e1e2f',
          950: '#0f0f1a',
        },
        // Мистический фиолетовый
        mystic: {
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#9333ea',
          600: '#7e22ce',
          700: '#6b21a8',
          800: '#581c87',
          900: '#3b0764',
        },
        // Золотой
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Космический
        cosmic: {
          500: '#6366f1',
          600: '#4f46e5',
          900: '#1e1b4b',
        },
        // Ночной
        night: {
          950: '#0a0614',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Nunito', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mystic': 'linear-gradient(135deg, #0f0f1a 0%, #1e1035 50%, #0f0f1a 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(139,61,255,0.08) 0%, rgba(255,191,32,0.04) 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f99b07 0%, #ffd24a 50%, #f99b07 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139,61,255,0.3)',
        'glow-gold': '0 0 20px rgba(249,155,7,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.12)',
        'card-hover': '0 8px 40px rgba(139,61,255,0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'card-appear': 'card-appear 0.5s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,61,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(139,61,255,0.6)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'card-appear': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
