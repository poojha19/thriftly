import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env variables regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'background.js'),
      name: 'background',
      fileName: 'background',
      formats: ['es'] // ES module format
    },
    rollupOptions: {
      // We want to bundle everything, so no external dependencies.
    },
    // Disable minification for easier debugging.
    minify: false,
  },
  // Define global constants for environment variables
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
  },
  };
});
