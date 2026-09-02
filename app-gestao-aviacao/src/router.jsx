import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ServicosPage from "./pages/Servicos/ServicosPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Redireciona raiz para /servicos
      { index: true, element: <ServicosPage /> },
      { path: "servicos", element: <ServicosPage /> },
      // Sprint 3 — adicionar aqui:
      // { path: "clientes", element: <ClientesPage /> },
      // { path: "pedidos",  element: <PedidosPage /> },
    ],
  },
]);

export default router;
