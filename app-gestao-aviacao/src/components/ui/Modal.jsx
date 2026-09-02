import { useEffect } from "react";
import "./Modal.css";

/**
 * Modal genérico reutilizável.
 * Usado por todos os módulos (Serviços, Clientes, Pedidos).
 *
 * Props:
 *   aberto     boolean  — controla visibilidade
 *   onFechar   fn       — callback ao fechar
 *   titulo     string   — título do header
 *   children   ReactNode
 */
export default function Modal({ aberto, onFechar, titulo, children }) {
  // Bloqueia scroll do body enquanto modal está aberto
  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  // Fecha ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onFechar();
    };
    if (aberto) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar} role="dialog" aria-modal="true">
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        aria-labelledby="modal-titulo"
      >
        <div className="modal-header">
          <h2 id="modal-titulo" className="modal-titulo">{titulo}</h2>
          <button
            type="button"
            className="modal-fechar"
            onClick={onFechar}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
