import { useEffect } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';
import Button from './Button';

/**
 * ConfirmDialog
 * Modal de confirmação para ações destrutivas.
 *
 * Props:
 * - aberto: boolean
 * - titulo: string
 * - descricao: ReactNode
 * - textoConfirmar: string (default: 'Confirmar')
 * - carregando: boolean (desabilita botões e mostra loading)
 * - onConfirmar: () => void
 * - onCancelar: () => void
 */
export default function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  carregando = false,
  onConfirmar,
  onCancelar,
}) {
  // Fecha com ESC
  useEffect(() => {
    if (!aberto) return undefined;
    const aoTeclar = (e) => {
      if (e.key === 'Escape' && !carregando) onCancelar?.();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto, carregando, onCancelar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in"
      onClick={() => !carregando && onCancelar?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-titulo"
        className="w-full max-w-md rounded-xl border border-border bg-bg-surface p-6 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-feedback-error/10 flex items-center justify-center shrink-0">
            <LuTriangleAlert size={18} className="text-feedback-error" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 id="confirm-dialog-titulo" className="text-base font-semibold text-content">
              {titulo}
            </h2>
            <div className="mt-1.5 text-sm text-content-muted leading-relaxed">{descricao}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="secondary" onClick={onCancelar} disabled={carregando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirmar} loading={carregando}>
            {textoConfirmar}
          </Button>
        </div>
      </div>
    </div>
  );
}
