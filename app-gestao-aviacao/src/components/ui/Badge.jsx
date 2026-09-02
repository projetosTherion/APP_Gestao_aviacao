/**
 * Badge
 * Etiqueta pequena para status/categorias.
 *
 * Props:
 * - variant: 'neutral' | 'info' | 'success' | 'warning' | 'error'
 */
const variants = {
  neutral: 'bg-border/60 text-content-muted',
  info: 'bg-primary/15 text-primary',
  success: 'bg-feedback-success/15 text-feedback-success',
  warning: 'bg-feedback-warning/15 text-feedback-warning',
  error: 'bg-feedback-error/15 text-feedback-error',
};

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

/** Mapeia o status de pedido (pendente | aprovado | concluido) para o Badge. */
export function BadgeStatusPedido({ status }) {
  const mapa = {
    pendente: { variant: 'warning', label: 'Pendente' },
    aprovado: { variant: 'info', label: 'Aprovado' },
    concluido: { variant: 'success', label: 'Concluído' },
  };
  const { variant, label } = mapa[status] || { variant: 'neutral', label: status || '—' };
  return <Badge variant={variant}>{label}</Badge>;
}
 * Badge de status — reutilizável em todos os módulos.
 *
 * Props:
 * - variant: 'neutral' | 'info' | 'success' | 'warning' | 'error'
 * - children: conteúdo do badge
 *
 * Uso rápido para status ativo/inativo:
 * - <BadgeAtivo ativo={true} />
 */

const variants = {
  neutral: 'bg-border/60 text-content-muted',
  info: 'bg-primary/15 text-primary',
  success: 'bg-feedback-success/15 text-feedback-success',
  warning: 'bg-feedback-warning/15 text-feedback-warning',
  error: 'bg-feedback-error/15 text-feedback-error',
};

export default function Badge({ variant = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

/** Mapeia o status de pedido (pendente | aprovado | concluido) para o Badge. */
export function BadgeStatusPedido({ status }) {
  const mapa = {
    pendente: { variant: 'warning', label: 'Pendente' },
    aprovado: { variant: 'info', label: 'Aprovado' },
    concluido: { variant: 'success', label: 'Concluído' },
  };
  const { variant, label } = mapa[status] || { variant: 'neutral', label: status || '—' };
  return <Badge variant={variant}>{label}</Badge>;
}

/** Badge simples de ativo/inativo — usado pelo módulo Serviços. */
export function BadgeAtivo({ ativo }) {
  return (
    <span className={`badge ${ativo ? 'badge-ativo' : 'badge-inativo'}`}>
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  );
}
