import { Outlet, NavLink } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-marca">
          <span className="sidebar-logo">✈️</span>
          <span className="sidebar-nome">Therion</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/servicos"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link--ativo" : ""}`
            }
            id="nav-servicos"
          >
            🛠️ Serviços
          </NavLink>
          {/* Sprint 3 — adicionar:
          <NavLink to="/clientes" className={...}>👤 Clientes</NavLink>
          <NavLink to="/pedidos"  className={...}>📋 Pedidos</NavLink>
          */}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
