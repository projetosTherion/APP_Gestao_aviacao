import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RotaProtegida
 * Verifica se o usuário está autenticado antes de renderizar a rota.
 * - Autenticado → renderiza a página (via <Outlet />)
 * - Não autenticado → redireciona para /login
 * - Carregando sessão → mostra tela em branco (evita flash de redirect)
 */
export default function RotaProtegida() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
