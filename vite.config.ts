import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/components": path.resolve(__dirname, "./components"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/hooks": path.resolve(__dirname, "./hooks"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/src": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react'
            if (id.includes('recharts') || id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-charts'
            if (id.includes('lucide-react') || id.includes('@radix-ui')) return 'vendor-ui'
            if (id.includes('embla-carousel-react') || id.includes('react-day-picker')) return 'vendor-carousel'
            return 'vendor'
          }
        },
      },
    },
  },
})
