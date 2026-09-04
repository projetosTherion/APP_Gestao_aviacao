import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  LuArrowLeft, LuUser, LuHash, LuPhone, LuMail, LuMapPin, LuSave,
} from 'react-icons/lu';
import { obterCliente, criarCliente, atualizarCliente } from '../../services/clientesService';
import {
  mascaraDocumento, mascaraTelefone, somenteDigitos,
} from '../../utils/mascaras';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

/**
 * ClienteForm — criação e edição de cliente (mesmo formulário).
 * Rotas: /clientes/novo  |  /clientes/:id/editar
 */
export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [carregando, setCarregando] = useState(editando);
  const [erroGeral, setErroGeral] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nome: '', documento: '', email: '', telefone: '',
      logradouro: '', numero: '', cidade: '', estado: '',
    },
  });

  // Carrega dados no modo edição
  useEffect(() => {
    if (!editando) return;
    let ativo = true;
    obterCliente(id)
      .then((c) => {
        if (!ativo) return;
        setNomeCliente(c.nome);
        reset({
          nome: c.nome || '',
          documento: mascaraDocumento(c.documento || ''),
          email: c.email || '',
          telefone: mascaraTelefone(c.telefone || ''),
          logradouro: c.logradouro || '',
          numero: c.numero || '',
          cidade: c.cidade || '',
          estado: c.estado || '',
        });
      })
      .catch((e) => ativo && setErroGeral(e.message))
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, [editando, id, reset]);

  const onSubmit = async (dados) => {
    setErroGeral('');
    const payload = {
      nome: dados.nome.trim(),
      documento: somenteDigitos(dados.documento),
      email: dados.email.trim(),
      telefone: somenteDigitos(dados.telefone),
      logradouro: dados.logradouro.trim(),
      numero: dados.numero.trim(),
      cidade: dados.cidade.trim(),
      estado: dados.estado,
    };

    try {
      if (editando) {
        const atualizado = await atualizarCliente(id, payload);
        navigate(`/clientes/${atualizado.id}`, {
          state: { toast: { tipo: 'sucesso', msg: 'Cliente atualizado com sucesso!' } },
        });
      } else {
        const criado = await criarCliente(payload);
        navigate('/clientes', {
          state: { toast: { tipo: 'sucesso', msg: `Cliente "${criado.nome}" cadastrado com sucesso!` } },
        });
      }
    } catch (e) {
      // 409 = CPF/CNPJ já cadastrado → marca no campo
      if (e.status === 409 && /CPF|CNPJ/i.test(e.message)) {
        setError('documento', { type: 'server', message: e.message });
      } else {
        setErroGeral(e.message);
      }
    }
  };

  if (carregando) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10">
      {/* Voltar */}
      <Link
        to={editando ? `/clientes/${id}` : '/clientes'}
        className="inline-flex items-center gap-1.5 text-sm text-content-muted hover:text-content transition-colors mb-6"
      >
        <LuArrowLeft size={15} aria-hidden="true" />
        {editando ? 'Voltar para o cliente' : 'Voltar para clientes'}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-content">
          {editando ? 'Editar cliente' : 'Novo cliente'}
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          {editando
            ? <>Alterando os dados de <span className="text-content font-medium">{nomeCliente}</span>.</>
            : 'Apenas nome e CPF/CNPJ são obrigatórios. Os demais dados aparecem nos documentos.'}
        </p>
      </div>

      {erroGeral && (
        <Alert tipo="erro" onClose={() => setErroGeral('')} className="mb-6">
          {erroGeral}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        {/* Identificação */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Identificação
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              id="cliente-nome"
              label="Nome / Razão social *"
              placeholder="Ex: AeroTaxi Brasil Ltda"
              icon={<LuUser size={16} />}
              autoFocus={!editando}
              error={errors.nome?.message}
              {...register('nome', {
                required: 'Nome é obrigatório.',
                validate: (v) => v.trim().length >= 2 || 'Mínimo de 2 caracteres.',
                maxLength: { value: 160, message: 'Máximo de 160 caracteres.' },
              })}
            />
            <Input
              id="cliente-documento"
              label="CPF ou CNPJ *"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              icon={<LuHash size={16} />}
              inputMode="numeric"
              error={errors.documento?.message}
              {...register('documento', {
                required: 'CPF/CNPJ é obrigatório.',
                onChange: (e) => { e.target.value = mascaraDocumento(e.target.value); },
                validate: (v) => {
                  const n = somenteDigitos(v).length;
                  return n === 11 || n === 14 || 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).';
                },
              })}
            />
          </div>
        </section>

        {/* Contato */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Contato
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="cliente-email"
              label="E-mail"
              type="email"
              placeholder="contato@cliente.com"
              icon={<LuMail size={16} />}
              error={errors.email?.message}
              {...register('email', {
                validate: (v) =>
                  !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'E-mail inválido.',
              })}
            />
            <Input
              id="cliente-telefone"
              label="Telefone"
              placeholder="(00) 00000-0000"
              icon={<LuPhone size={16} />}
              inputMode="tel"
              error={errors.telefone?.message}
              {...register('telefone', {
                onChange: (e) => { e.target.value = mascaraTelefone(e.target.value); },
                validate: (v) => {
                  const n = somenteDigitos(v).length;
                  return n === 0 || n === 10 || n === 11 || 'Informe DDD + número.';
                },
              })}
            />
          </div>
        </section>

        {/* Endereço */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Endereço
          </h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  id="cliente-logradouro"
                  label="Logradouro"
                  placeholder="Rua, Av., etc."
                  icon={<LuMapPin size={16} />}
                  error={errors.logradouro?.message}
                  {...register('logradouro', {
                    maxLength: { value: 160, message: 'Máximo de 160 caracteres.' },
                  })}
                />
              </div>
              <Input
                id="cliente-numero"
                label="Número"
                placeholder="123"
                error={errors.numero?.message}
                {...register('numero', {
                  maxLength: { value: 20, message: 'Máximo de 20 caracteres.' },
                })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  id="cliente-cidade"
                  label="Cidade"
                  placeholder="São Paulo"
                  error={errors.cidade?.message}
                  {...register('cidade', {
                    maxLength: { value: 100, message: 'Máximo de 100 caracteres.' },
                  })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cliente-estado" className="text-sm font-medium text-content-muted">
                  Estado (UF)
                </label>
                <select
                  id="cliente-estado"
                  className={`w-full bg-bg-surface border rounded-lg text-sm text-content px-3.5 py-2.5 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                    ${errors.estado ? 'border-feedback-error' : 'border-border'}`}
                  {...register('estado')}
                >
                  <option value="">—</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
                {errors.estado && (
                  <p className="text-xs text-feedback-error">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Ações */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(editando ? `/clientes/${id}` : '/clientes')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting} className="sm:min-w-40">
            <LuSave size={15} aria-hidden="true" />
            {editando ? 'Salvar alterações' : 'Cadastrar cliente'}
          </Button>
        </div>
      </form>
    </div>
  );
}
