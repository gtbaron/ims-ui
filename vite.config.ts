import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import flowbiteReact from 'flowbite-react/plugin/vite';
import path from 'path';

export default defineConfig({
    plugins: [react(), tailwind(), flowbiteReact()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        host: '0.0.0.0',   // ok for local too; needed for containers/WSL/LAN
        port: 5173,
        strictPort: true,
        hmr: {
            protocol: 'ws',  // change to 'wss' only if you serve the dev page over HTTPS
            host: 'localhost', // if you open via http://localhost:5173
            // If you open via a LAN IP (e.g., http://192.168.1.50:5173), set host to that IP
            // host: '192.168.1.50',
            clientPort: 5173, // set to the public port if you’re forwarding differently
        },
        watch: {
            usePolling: true, // helps on Docker/WSL/networked filesystems
            interval: 200
        }
    }
})