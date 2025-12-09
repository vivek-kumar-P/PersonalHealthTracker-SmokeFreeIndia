import type { Config } from "tailwindcss"

const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(0 0% 8.5%)",
        card: "hsl(0 0% 100%)",
        "card-foreground": "hsl(0 0% 8.5%)",
        primary: "hsl(160 84% 40%)",
        "primary-foreground": "hsl(0 0% 100%)",
        secondary: "hsl(0 0% 96.1%)",
        "secondary-foreground": "hsl(0 0% 10%)",
        muted: "hsl(0 0% 96.1%)",
        "muted-foreground": "hsl(0 0% 45.1%)",
        accent: "hsl(0 0% 96.1%)",
        "accent-foreground": "hsl(0 0% 10%)",
        destructive: "hsl(0 84% 60%)",
        "destructive-foreground": "hsl(0 0% 98%)",
        border: "hsl(0 0% 89.5%)",
        input: "hsl(0 0% 89.5%)",
        ring: "hsl(160 84% 40%)",
        emerald: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#145231",
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "calc(0.625rem - 2px)",
        sm: "calc(0.625rem - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
