import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8080',
      '/tours': 'http://localhost:8080',
      '/bookings': 'http://localhost:8080',
      '/clients': 'http://localhost:8080',
      '/payments': 'http://localhost:8080',
      '/hotels': 'http://localhost:8080',
      '/admin': 'http://localhost:8080'
    }
  }
});
