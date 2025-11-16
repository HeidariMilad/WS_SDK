import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: {
      '@frontend-ui-command-sdk/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
      '@frontend-ui-command-sdk/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
