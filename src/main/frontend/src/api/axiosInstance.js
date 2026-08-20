import axios from "axios";

const api = axios.create({
  baseURL: "/api", // vite.config.js 프록시 설정에 의해 http://localhost:8080/api 로 요청 전달
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
