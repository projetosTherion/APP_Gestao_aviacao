import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LuPlane, LuUsers, LuBuilding2, LuUser, LuLogOut, LuMenu, LuX,
} from 'react-icons/lu';
import { useAuth } from '../../context/useAuth';
import Button from '../ui/Button';

/**
 * AppLayout
 * Casca da área autenticada: sidebar (desktop), topbar + drawer (mobile)
 * e área de conteúdo com scroll independente. As páginas são renderizadas
 * via <Outlet />.
 *
 * Para adicionar um módulo ao menu, inclua um item em SECOES_MENU.
 */
const SECOES_MENU = [
  {
    titulo: 'Cadastros',
    itens: [
      { to: '/clientes', label: 'Clientes', Icone: LuUsers },
    ],
  },
  {
    titulo: 'Configurações',
    itens: [
      { to: '/configurar-empresa', label: 'Dados da empresa', Icone: LuBuilding2 },
    ],
  },
];

function Logo({ tamanho = 22, textoClass = 'text-base' }) {
  return (
    <div className="flex items-center gap-2.5">
      <LuPlane size={tamanho} className="text-primary" aria-hidden="true" />
      <span className={`font-bold text-content ${textoClass}`}>AeroGestão</span>
    </div>
  );
}

function Navegacao({ aoNavegar }) {
  return (
    <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-6" aria-label="Navegação principal">
      {SECOES_MENU.map((secao) => (
        <div key={secao.titulo}>
          <p className="text-xs font-semibold text-content-subtle uppercase tracking-wider mb-3 px-2">
            {secao.titulo}
          </p>
          <ul className="flex flex-col gap-1">
            {secao.itens.map(({ to, label, Icone }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={aoNavegar}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-content-muted hover:text-content hover:bg-bg'
                    }`
                  }
                >
                  <Icone size={16} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function RodapeUsuario({ user, onLogout }) {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-3 mb-3 px-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <LuUser size={14} className="text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-content truncate">{user?.nome}</p>
          <p className="text-xs text-content-subtle truncate">{user?.email}</p>
        </div>
      </div>
      <Button variant="ghost" fullWidth onClick={onLogout} className="justify-start gap-2 text-content-subtle">
        <LuLogOut size={15} aria-hidden="true" />
        Sair
      </Button>
    </div>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const location = useLocation();

  const fecharMenu = () => setMenuAberto(false);

  return (
    <div className="h-screen bg-bg flex overflow-hidden">
      {/* ─── Sidebar desktop ─── */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-bg-surface border-r border-border flex-col h-screen">
        <div className="p-6 border-b border-border">
          <Logo />
        </div>
        <Navegacao />
        <RodapeUsuario user={user} onLogout={logout} />
      </aside>

      {/* ─── Drawer mobile ─── */}
      {menuAberto && (
        <div className="lg:hidden fixed inset-0 z-40 flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={fecharMenu} />
          <aside className="relative w-72 max-w-[85vw] h-full bg-bg-surface border-r border-border flex flex-col shadow-2xl">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <Logo tamanho={20} textoClass="text-sm" />
              <button
                type="button"
                onClick={fecharMenu}
                className="p-1.5 rounded-md text-content-subtle hover:text-content hover:bg-bg transition-colors"
                aria-label="Fechar menu"
              >
                <LuX size={18} />
              </button>
            </div>
            <Navegacao aoNavegar={fecharMenu} />
            <RodapeUsuario user={user} onLogout={logout} />
          </aside>
        </div>
      )}

      {/* ─── Conteúdo ─── */}
      <main className="flex-1 overflow-y-auto h-screen flex flex-col">
        {/* Topbar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-bg-surface border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              className="p-1.5 -ml-1.5 rounded-md text-content-muted hover:text-content hover:bg-bg transition-colors"
              aria-label="Abrir menu"
            >
              <LuMenu size={20} />
            </button>
            <Logo tamanho={20} textoClass="text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-content-subtle truncate max-w-[120px]">{user?.nome}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-content-subtle hover:text-content transition-colors px-2 py-1.5 rounded-md hover:bg-bg"
            >
              <LuLogOut size={14} aria-hidden="true" />
              Sair
            </button>
          </div>
        </header>

        {/* key força re-animação ao trocar de rota */}
        <div key={location.pathname} className="flex-1 flex flex-col animate-slide-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
