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
import ServicosPage from './pages/Servicos/ServicosPage';

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

              {/* Serviços (Sprint 2 — Therion) */}
              <Route path="/servicos" element={<ServicosPage />} />
            </Route>
          </Route>

          {/* Redirect raiz */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
