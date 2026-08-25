import { createContext, useContext, useEffect, useState } from 'react';
import {
  login as serviceLogin,
  cadastrar as serviceCadastrar,
  logout as serviceLogout,
  getSessaoSalva,
} from '../services/authService';

// ─────────────────────────────────────────────
// Contexto
// ─────────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // começa true para checar sessão salva

  // Ao montar, verifica se há sessão salva no localStorage
  useEffect(() => {
    const sessao = getSessaoSalva();
    if (sessao) {
      setUser(sessao.user);
      setToken(sessao.token);
    }
    setIsLoading(false);
  }, []);

  /**
   * Autentica o usuário.
   * @param {{ email: string, senha: string }} credenciais
   */
  const login = async (credenciais) => {
    const resultado = await serviceLogin(credenciais);
    setUser(resultado.user);
    setToken(resultado.token);
    return resultado;
  };

  /**
   * Cadastra um novo usuário e já faz login automático.
   * @param {{ nome: string, email: string, senha: string }} dados
   */
  const cadastrar = async (dados) => {
    const resultado = await serviceCadastrar(dados);
    setUser(resultado.user);
    setToken(resultado.token);
    return resultado;
  };

  /**
   * Encerra a sessão atual.
   */
  const logout = () => {
    serviceLogout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    cadastrar,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook de consumo
// ─────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
