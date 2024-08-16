import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { svgrComponent } from 'vite-plugin-svgr-component';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgrComponent()],
});
