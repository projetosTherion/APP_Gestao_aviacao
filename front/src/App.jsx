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
import ServicosPage from './pages/Servicos/ServicosPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route element={<RotaProtegida />}>
            <Route element={<AppLayout />}>
              <Route path="/configurar-empresa" element={<ConfigEmpresa />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<ClienteForm />} />
              <Route path="/clientes/:id" element={<ClienteDetalhe />} />
              <Route path="/clientes/:id/editar" element={<ClienteForm />} />
              <Route path="/servicos" element={<ServicosPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
