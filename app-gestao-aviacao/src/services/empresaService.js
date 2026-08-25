/**
 * empresaService.js
 * Camada de serviço de configuração da empresa.
 * Mock com localStorage — trocar implementação quando o backend estiver pronto.
 */

const STORAGE_KEY_EMPRESA = '@aerogestao:empresa';

const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

/**
 * Busca os dados da empresa configurada.
 * @returns {object | null} dados da empresa ou null se não configurada
 */
export const getEmpresa = async () => {
  await delay(300);
  const raw = localStorage.getItem(STORAGE_KEY_EMPRESA);
  return raw ? JSON.parse(raw) : null;
};

/**
 * Salva os dados da empresa.
 * @param {{
 *   nome: string,
 *   slogan: string,
 *   cnpj: string,
 *   telefone: string,
 *   email: string,
 *   logradouro: string,
 *   numero: string,
 *   cidade: string,
 *   estado: string,
 *   logoBase64: string | null,
 * }} dados
 * @returns {{ sucesso: boolean }}
 */
export const salvarEmpresa = async (dados) => {
  await delay();
  const empresa = {
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_EMPRESA, JSON.stringify(empresa));
  return { sucesso: true };
};
