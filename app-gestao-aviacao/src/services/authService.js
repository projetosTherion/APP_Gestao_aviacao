/**
 * authService.js
 * Camada de serviço de autenticação.
 * Por enquanto usa localStorage como mock do backend.
 * Quando a API da Dupla 1 estiver pronta, só trocar a implementação aqui.
 */

const STORAGE_KEY_USERS = '@aerogestao:users';
const STORAGE_KEY_TOKEN = '@aerogestao:token';
const STORAGE_KEY_USER  = '@aerogestao:user';

// Simula delay de rede
const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

/**
 * Retorna todos os usuários cadastrados no mock
 */
const getUsers = () => {
  const raw = localStorage.getItem(STORAGE_KEY_USERS);
  return raw ? JSON.parse(raw) : [];
};

/**
 * Gera um token mock simples
 */
const generateToken = (userId) => `mock-token-${userId}-${Date.now()}`;

const semSenha = (user) =>
  Object.fromEntries(Object.entries(user).filter(([chave]) => chave !== 'senha'));

// ─────────────────────────────────────────────
// API pública do service
// ─────────────────────────────────────────────

/**
 * Cadastra um novo usuário.
 * @param {{ nome: string, email: string, senha: string }} dados
 * @returns {{ user: object, token: string }}
 * @throws {Error} se o e-mail já estiver cadastrado
 */
export const cadastrar = async ({ nome, email, senha }) => {
  await delay();

  const users = getUsers();
  const jaExiste = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (jaExiste) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const novoUser = {
    id: crypto.randomUUID(),
    nome,
    email: email.toLowerCase(),
    senha, // Em produção: NUNCA guardar senha em texto puro. Mock apenas.
    criadoEm: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, novoUser]));

  const token = generateToken(novoUser.id);
  const userSemSenha = semSenha(novoUser);

  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSemSenha));

  return { user: userSemSenha, token };
};

/**
 * Autentica um usuário existente.
 * @param {{ email: string, senha: string }} credenciais
 * @returns {{ user: object, token: string }}
 * @throws {Error} se as credenciais forem inválidas
 */
export const login = async ({ email, senha }) => {
  await delay();

  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  );

  if (!user) {
    throw new Error('E-mail ou senha incorretos.');
  }

  const token = generateToken(user.id);
  const userSemSenha = semSenha(user);

  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSemSenha));

  return { user: userSemSenha, token };
};

/**
 * Remove a sessão atual do storage.
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_USER);
};

/**
 * Retorna a sessão salva, se existir.
 * Usado para persistir login após reload.
 * @returns {{ user: object, token: string } | null}
 */
export const getSessaoSalva = () => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  const userRaw = localStorage.getItem(STORAGE_KEY_USER);

  if (!token || !userRaw) return null;

  return { user: JSON.parse(userRaw), token };
};
