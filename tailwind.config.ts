import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        primary: ['var(--font-crimson-pro)', 'serif'],
        base: ['var(--font-albert-sans)', 'sans-serif'],
        code: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        'display-1': ['48px', {
          lineHeight: '1.1',
          fontWeight: '700',
        }],
        'display-2': ['42px', {
          lineHeight: '1.2',
          fontWeight: '700',
        }],
        'display-3': ['36px', {
          lineHeight: '1.2',
          fontWeight: '700',
        }],
        'h1': ['30px', {
          lineHeight: '1.2',
          fontWeight: '700',
        }],
        'h2': ['27px', {
          lineHeight: '1.2',
          fontWeight: '700',
        }],
        'h3': ['24px', {
          lineHeight: '1.3',
          fontWeight: '700',
        }],
        'h4': ['21px', {
          lineHeight: '1.3',
          fontWeight: '700',
        }],
        'h5': ['18px', {
          lineHeight: '1.4',
          fontWeight: '700',
        }],
        'body-lg': ['18px', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
        'body-base': ['16px', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
        'body-sm': ['14px', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
        'caption-1': ['16px', {
          lineHeight: '1.4',
          fontWeight: '700',
        }],
        'caption-2': ['14px', {
          lineHeight: '1.4',
          fontWeight: '700',
        }],
        'code-1': ['16px', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
        'code-2': ['14px', {
          lineHeight: '1.5',
          fontWeight: '400',
        }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config

export default config
