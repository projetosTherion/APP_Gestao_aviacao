import { LuCircleCheck, LuCircleAlert, LuInfo, LuX } from 'react-icons/lu';

/**
 * Alert
 * Mensagem de feedback inline (sucesso, erro ou informação).
 *
 * Props:
 * - tipo: 'sucesso' | 'erro' | 'info'
 * - children: conteúdo da mensagem
 * - onClose: se informado, exibe botão de fechar
 * - className: pass-through
 */
const estilos = {
  sucesso: {
    classes: 'border-feedback-success/30 bg-feedback-success/10 text-feedback-success',
    Icone: LuCircleCheck,
  },
  erro: {
    classes: 'border-feedback-error/30 bg-feedback-error/10 text-feedback-error',
    Icone: LuCircleAlert,
  },
  info: {
    classes: 'border-primary/30 bg-primary/10 text-primary',
    Icone: LuInfo,
  },
};

export default function Alert({ tipo = 'info', children, onClose, className = '' }) {
  const { classes, Icone } = estilos[tipo] || estilos.info;

  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm animate-fade-in ${classes} ${className}`}
    >
      <Icone size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fechar aviso"
        >
          <LuX size={14} />
        </button>
      )}
    </div>
  );
}
