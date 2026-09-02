import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LuUser, LuMail, LuLock, LuCircleAlert, LuPlane } from 'react-icons/lu';
import { useAuth } from '../../context/useAuth';
import BrandingPanel from '../../components/ui/BrandingPanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Cadastro() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();
  const [erroGeral, setErroGeral] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (dados) => {
    setErroGeral('');
    try {
      await cadastrar({ nome: dados.nome, email: dados.email, senha: dados.senha });
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

            <h2 className="text-2xl font-bold text-content">Criar sua conta</h2>
            <p className="mt-1 text-sm text-content-muted">
              Preencha os dados para começar a usar o sistema.
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
              id="cadastro-nome"
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              icon={<LuUser size={16} />}
              error={errors.nome?.message}
              {...register('nome', {
                required: 'Nome é obrigatório.',
                minLength: { value: 2, message: 'Mínimo de 2 caracteres.' },
              })}
            />

            <Input
              id="cadastro-email"
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
              id="cadastro-senha"
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              icon={<LuLock size={16} />}
              error={errors.senha?.message}
              {...register('senha', {
                required: 'Senha é obrigatória.',
                minLength: { value: 6, message: 'Mínimo de 6 caracteres.' },
              })}
            />

            <Input
              id="cadastro-confirmar-senha"
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              icon={<LuLock size={16} />}
              error={errors.confirmarSenha?.message}
              {...register('confirmarSenha', {
                required: 'Confirme sua senha.',
                validate: (val) =>
                  val === getValues('senha') || 'As senhas não coincidem.',
              })}
            />

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              className="mt-2"
            >
              Criar conta
            </Button>
          </form>

          {/* Link para login */}
          <p className="mt-6 text-center text-sm text-content-muted">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
