import { useState } from 'react';
import {
  login as serviceLogin,
  cadastrar as serviceCadastrar,
  logout as serviceLogout,
  getSessaoSalva,
} from '../services/authService';
import { AuthContext } from './authContextObject';

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [sessaoInicial] = useState(() => getSessaoSalva());
  const [user, setUser] = useState(sessaoInicial?.user ?? null);
  const [token, setToken] = useState(sessaoInicial?.token ?? null);
  const isLoading = false;

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
