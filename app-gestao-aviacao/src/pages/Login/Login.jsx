import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LuMail, LuLock, LuCircleAlert, LuPlane } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import BrandingPanel from '../../components/ui/BrandingPanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [erroGeral, setErroGeral] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (dados) => {
    setErroGeral('');
    try {
      await login({ email: dados.email, senha: dados.senha });
      navigate('/configurar-empresa');
    } catch (err) {
      setErroGeral(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel de branding (esquerda) */}
      <BrandingPanel />

      {/* Formulário (direita) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-bg">
        <div className="w-full max-w-sm sm:max-w-md animate-slide-up">

          {/* Cabeçalho */}
          <div className="mb-8">
            {/* Logo visível só no mobile */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <LuPlane size={24} className="text-primary" aria-hidden="true" />
              <span className="text-lg font-bold text-content">AeroGestão</span>
            </div>

            <h2 className="text-2xl font-bold text-content">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-content-muted">
              Entre com suas credenciais para acessar o sistema.
            </p>
          </div>

          {/* Erro geral */}
          {erroGeral && (
            <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-feedback-error/30 bg-feedback-error/10 px-4 py-3 text-sm text-feedback-error animate-fade-in">
              <LuCircleAlert size={16} className="shrink-0" />
              <span>{erroGeral}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              id="login-email"
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<LuMail size={16} />}
              error={errors.email?.message}
              {...register('email', {
                required: 'E-mail é obrigatório.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Informe um e-mail válido.',
                },
              })}
            />

            <Input
              id="login-senha"
              label="Senha"
              type="password"
              placeholder="••••••••"
              icon={<LuLock size={16} />}
              error={errors.senha?.message}
              {...register('senha', {
                required: 'Senha é obrigatória.',
                minLength: { value: 6, message: 'Mínimo de 6 caracteres.' },
              })}
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              className="mt-2"
            >
              Entrar
            </Button>
          </form>

          {/* Link para cadastro */}
          <p className="mt-6 text-center text-sm text-content-muted">
            Não tem uma conta?{' '}
            <Link
              to="/cadastro"
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
