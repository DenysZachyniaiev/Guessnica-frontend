import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Any request starting with /auth, /game, or /admin 
            // will be redirected to the backend
            '/auth': 'http://localhost:8080',
            '/game': 'http://localhost:8080',
            '/admin': 'http://localhost:8080',
            '/locations': 'http://localhost:8080',
            '/users': 'http://localhost:8080',
        }
    }
})