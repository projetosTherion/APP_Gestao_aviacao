import { createContext } from 'react';

// Objeto de contexto puro, sem componentes — mora em arquivo próprio para não
// quebrar o Fast Refresh (regra react-refresh/only-export-components), já que
// AuthContext.jsx exporta o componente AuthProvider e useAuth.js exporta o hook.
export const AuthContext = createContext(null);
