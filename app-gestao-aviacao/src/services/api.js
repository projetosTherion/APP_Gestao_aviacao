/**
 * api.js
 * Cliente HTTP mínimo para o backend Express.
 * - Base URL vem de VITE_API_URL (fallback: http://localhost:4000).
 * - Envia o token da sessão em Authorization quando existir (pronto para a
 *   autenticação real da Dupla 1 no backend).
 * - Erros da API ({ sucesso: false, erro }) viram ApiError com `status`.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const STORAGE_KEY_TOKEN = '@aerogestao:token';

export class ApiError extends Error {
  constructor(mensagem, status, payload) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function request(caminho, { method = 'GET', body, params } = {}) {
  const url = new URL(`${BASE_URL}${caminho}`);
  if (params) {
    Object.entries(params).forEach(([chave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== '') {
        url.searchParams.set(chave, valor);
      }
    });
  }

  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (token) headers.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
      0
    );
  }

  let payload = null;
  const texto = await resposta.text();
  if (texto) {
    try {
      payload = JSON.parse(texto);
    } catch {
      payload = null;
    }
  }

  if (!resposta.ok || (payload && payload.sucesso === false)) {
    const mensagem = payload?.erro || `Erro ${resposta.status} ao comunicar com o servidor.`;
    throw new ApiError(mensagem, resposta.status, payload);
  }

  return payload;
}

export const api = {
  get: (caminho, params) => request(caminho, { params }),
  post: (caminho, body) => request(caminho, { method: 'POST', body }),
  put: (caminho, body) => request(caminho, { method: 'PUT', body }),
  patch: (caminho, body) => request(caminho, { method: 'PATCH', body }),
  delete: (caminho) => request(caminho, { method: 'DELETE' }),
};
