import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    
    server: {
        host: '0.0.0.0',  // ⚠️ WAŻNE: pozwala dostęp z zewnątrz kontenera
        port: 3000,  // Jeden port dla HTTP i HTTPS
        
        // Hot reload dla Dockera (Windows/Mac)
        watch: {
            usePolling: true
        },
        
        // HTTPS DEV server (opcjonalnie - używa tych samych certów co backend)
        https: process.env.VITE_USE_HTTPS === 'true' ? {
            key: fs.readFileSync(path.resolve(__dirname, './ssl/key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, './ssl/cert.pem'))
        } : undefined,
        
        // Proxy API (jeśli chcesz używać relatywnych URLi)
        proxy: {
            '/api': {
                target: 'http://nginx:80',  // Nazwa serwisu Docker (dla SSR/Vite server)
                changeOrigin: true,
                secure: false
            }
        }
    },
    
    // Build optimization
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild'
    }
});