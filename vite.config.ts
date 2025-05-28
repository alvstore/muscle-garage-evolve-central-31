import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  
  return {
    server: {
      host: "::",
      port: 8000,
      proxy: {
        '/api/proxy/hikvision': {
          target: 'http://localhost:54321/functions/v1/hikvision-proxy',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/proxy\/hikvision/, '')
        }
      },
      // Enable HMR with explicit host for WSL or remote connections
      hmr: {
        host: 'localhost',
        port: 8000,
      },
    },
    plugins: [
      react({
        // Enable React Refresh
        devTools: isDev,
        // Configure SWC for better development experience
        ...(isDev && {
          jsxImportSource: '@emotion/react',
          devTools: true,
        }),
      }),
      isDev && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Add source maps in development for better debugging
    build: {
      sourcemap: isDev,
    },
    // Enable environment variables
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
