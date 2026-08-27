import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://100.88.187.37:8081", // 스프링 부트 서버 포트
        changeOrigin: true,
      },
    },
  },
});
