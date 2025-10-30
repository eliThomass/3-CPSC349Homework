import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = '/3-CPSC349Homework/'; 

export default defineConfig({
  // This sets the base public path for all assets (CSS, JS) when running in production mode (for GitHub Pages).
  base: process.env.NODE_ENV === 'production' ? repoName : '/',
  plugins: [react()],
});
