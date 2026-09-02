import axios from "axios";

// Instância centralizada do axios — todos os módulos usam esta
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de resposta — trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extrai a mensagem de erro do backend ou usa fallback
    const mensagem =
      error.response?.data?.erro ??
      error.response?.data?.message ??
      "Erro de conexão com o servidor";

    return Promise.reject(new Error(mensagem));
  }
);

export default api;
