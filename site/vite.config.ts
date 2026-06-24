import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://server:8080',
                changeOrigin: true,
            },
        },
    },
    envDir: '..',
});
