import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 TensorFlow.js 相关库分离
          'tensorflow': ['@tensorflow/tfjs'],
          'face-api': ['face-api.js'],
          'body-segmentation': ['@tensorflow-models/body-segmentation'],
          // React 相关
          'react-vendor': ['react', 'react-dom'],
          // 工具库
          'utils': ['lucide-react', 'html-to-image', 'clsx', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // 提高警告阈值
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', 'face-api.js'],
  },
})
