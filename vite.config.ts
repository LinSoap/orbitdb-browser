import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({

    server: {
    https: {
      key: fs.readFileSync(path.resolve("/home/linsoap", 'localhost.key')),
      cert: fs.readFileSync(path.resolve("/home/linsoap", 'localhost.crt')),
    },
    host: '0.0.0.0', // 确保服务器可以通过IP地址访问
  },
  plugins: [react()],
})
