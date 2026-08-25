import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RotaProtegida from './routes/RotaProtegida';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import ConfigEmpresa from './pages/ConfigEmpresa/ConfigEmpresa';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Rotas protegidas */}
          <Route element={<RotaProtegida />}>
            <Route path="/configurar-empresa" element={<ConfigEmpresa />} />
          </Route>

          {/* Redirect raiz */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
