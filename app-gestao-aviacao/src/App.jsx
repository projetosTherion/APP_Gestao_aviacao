import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './routes/RotaProtegida';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import ConfigEmpresa from './pages/ConfigEmpresa/ConfigEmpresa';
import Clientes from './pages/Clientes/Clientes';
import ClienteForm from './pages/Clientes/ClienteForm';
import ClienteDetalhe from './pages/Clientes/ClienteDetalhe';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas (com sidebar/topbar do AppLayout) */}
          <Route element={<RotaProtegida />}>
            <Route element={<AppLayout />}>
              <Route path="/configurar-empresa" element={<ConfigEmpresa />} />

              {/* Clientes (Dupla 1 - Sprint 2) */}
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<ClienteForm />} />
              <Route path="/clientes/:id" element={<ClienteDetalhe />} />
              <Route path="/clientes/:id/editar" element={<ClienteForm />} />
            </Route>
          </Route>

          {/* Redirect raiz */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
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
