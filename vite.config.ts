
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This shims process.env so the browser doesn't crash when it sees it
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  }
});
