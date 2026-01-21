import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/auth': 'http://localhost:8082',
            '/game': 'http://localhost:8082',
            '/admin': 'http://localhost:8082',
            '/locations': 'http://localhost:8082',
            '/users': 'http://localhost:8082',
        }
    }
})