import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name:'main',
          root: './src/main',
          environment: 'node',
          setupFiles: ['./tests/vitest.setup.ts']
        }
      }
    ]
  }
});