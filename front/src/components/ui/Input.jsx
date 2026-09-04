import { forwardRef, useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

/**
 * Input
 * Campo de formulário com label, ícone opcional, toggle de senha e mensagem de erro.
 *
 * Props:
 * - label: string
 * - id: string (obrigatório para acessibilidade)
 * - error: string | undefined
 * - icon: ReactNode (ícone à esquerda)
 * - type: string (default: 'text')
 * - Demais props nativas do <input>
 */
const Input = forwardRef(function Input(
  { label, id, error, icon, type = 'text', className = '', ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-content-muted"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Ícone esquerdo */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-content-subtle pointer-events-none">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          className={`
            w-full bg-bg-surface border rounded-lg text-sm text-content
            placeholder:text-content-subtle
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : 'pl-3.5'}
            ${isPassword ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${error
              ? 'border-feedback-error focus:ring-feedback-error focus:border-feedback-error'
              : 'border-border'
            }
            ${className}
          `}
          {...rest}
        />

        {/* Toggle visibilidade da senha */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-xs text-feedback-error flex items-center gap-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
