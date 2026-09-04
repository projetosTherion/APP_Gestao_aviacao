/**
 * Button
 * Botão reutilizável com variantes e estado de loading.
 *
 * Props:
 * - variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * - loading: boolean
 * - fullWidth: boolean
 * - type: 'button' | 'submit' | 'reset'
 * - children, onClick, disabled, className (pass-through)
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-primary hover:bg-primary-hover active:bg-primary-muted text-white focus:ring-primary px-4 py-2.5',
    secondary:
      'bg-bg-surface hover:bg-border text-content border border-border focus:ring-border px-4 py-2.5',
    ghost:
      'text-content-muted hover:text-content hover:bg-bg-surface focus:ring-border px-3 py-2',
    danger:
      'bg-feedback-error hover:bg-red-600 text-white focus:ring-feedback-error px-4 py-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>Aguarde...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
