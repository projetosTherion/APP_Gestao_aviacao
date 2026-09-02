import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LuBuilding2, LuPhone, LuMail, LuMapPin, LuImage,
  LuSave, LuCircleCheck, LuCircleAlert, LuHash
} from 'react-icons/lu';
import { getEmpresa, salvarEmpresa } from '../../services/empresaService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// ─────────────────────────────────────────────
// Funções de máscara
// ─────────────────────────────────────────────
const mascaraCNPJ = (v = '') =>
  v.replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

const mascaraTelefone = (v = '') =>
  v.replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');

// ─────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────
/**
 * ConfigEmpresa — dados da empresa usados nos documentos.
 * Renderizada dentro do AppLayout (sidebar/topbar ficam lá).
 */
export default function ConfigEmpresa() {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState(null); // { tipo: 'sucesso' | 'erro', msg: string }
  const [carregando, setCarregando] = useState(true);
  const inputFileRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Carrega dados salvos ao montar
  useEffect(() => {
    getEmpresa().then((dados) => {
      if (dados) {
        setValue('nome', dados.nome || '');
        setValue('slogan', dados.slogan || '');
        setValue('cnpj', dados.cnpj || '');
        setValue('telefone', dados.telefone || '');
        setValue('emailContato', dados.emailContato || '');
        setValue('logradouro', dados.logradouro || '');
        setValue('numero', dados.numero || '');
        setValue('cidade', dados.cidade || '');
        setValue('estado', dados.estado || '');
        if (dados.logoBase64) {
          setLogoPreview(dados.logoBase64);
          setLogoBase64(dados.logoBase64);
        }
      }
    }).finally(() => setCarregando(false));
  }, [setValue]);

  // Exibe toast por 4 segundos
  const mostrarToast = (tipo, msg) => {
    setToast({ tipo, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Upload de logo
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      mostrarToast('erro', 'Selecione um arquivo de imagem válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result);
      setLogoBase64(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (dados) => {
    setSalvando(true);
    try {
      await salvarEmpresa({ ...dados, logoBase64 });
      mostrarToast('sucesso', 'Dados da empresa salvos com sucesso!');
    } catch {
      mostrarToast('erro', 'Erro ao salvar. Tente novamente.');
    } finally {
      setSalvando(false);
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

      {/* Header da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-content">Dados da empresa</h1>
        <p className="mt-1 text-sm text-content-muted">
          Essas informações aparecem em todos os documentos gerados (orçamentos, faturas e ordens de serviço).
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mb-6 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm animate-fade-in ${
          toast.tipo === 'sucesso'
            ? 'border-feedback-success/30 bg-feedback-success/10 text-feedback-success'
            : 'border-feedback-error/30 bg-feedback-error/10 text-feedback-error'
        }`}>
          {toast.tipo === 'sucesso'
            ? <LuCircleCheck size={16} className="shrink-0" />
            : <LuCircleAlert size={16} className="shrink-0" />
          }
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">

        {/* Seção: Logo */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Logo da empresa
          </h2>
          <div className="flex items-center gap-5">
            {/* Preview */}
            <div
              className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-bg-surface overflow-hidden shrink-0 cursor-pointer hover:border-primary transition-colors"
              onClick={() => inputFileRef.current?.click()}
              role="button"
              aria-label="Selecionar logo da empresa"
            >
              {logoPreview
                ? <img src={logoPreview} alt="Logo da empresa" className="w-full h-full object-contain" />
                : <LuImage size={24} className="text-content-subtle" />
              }
            </div>

            <div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputFileRef.current?.click()}
              >
                <LuImage size={15} />
                {logoPreview ? 'Trocar logo' : 'Enviar logo'}
              </Button>
              <p className="mt-1.5 text-xs text-content-subtle">
                PNG, JPG ou SVG. Aparecerá nos documentos PDF.
              </p>
              {logoPreview && (
                <button
                  type="button"
                  onClick={() => { setLogoPreview(null); setLogoBase64(null); }}
                  className="mt-1 text-xs text-feedback-error hover:underline"
                >
                  Remover logo
                </button>
              )}
            </div>

            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
              aria-label="Upload de logo"
            />
          </div>
        </section>

        {/* Seção: Identificação */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Identificação
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              id="empresa-nome"
              label="Nome da empresa"
              placeholder="Ex: Aviação Therion Ltda."
              icon={<LuBuilding2 size={16} />}
              error={errors.nome?.message}
              {...register('nome', { required: 'Nome da empresa é obrigatório.' })}
            />
            <Input
              id="empresa-slogan"
              label="Slogan"
              placeholder="Ex: Excelência em serviços de aviação"
              error={errors.slogan?.message}
              {...register('slogan')}
            />
            <Input
              id="empresa-cnpj"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              icon={<LuHash size={16} />}
              error={errors.cnpj?.message}
              {...register('cnpj', {
                required: 'CNPJ é obrigatório.',
                onChange: (e) => {
                  e.target.value = mascaraCNPJ(e.target.value);
                },
                validate: (v) =>
                  v.replace(/\D/g, '').length === 14 || 'CNPJ inválido.',
              })}
            />
          </div>
        </section>

        {/* Seção: Contato */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Contato
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              id="empresa-telefone"
              label="Telefone"
              placeholder="(00) 00000-0000"
              icon={<LuPhone size={16} />}
              error={errors.telefone?.message}
              {...register('telefone', {
                required: 'Telefone é obrigatório.',
                onChange: (e) => {
                  e.target.value = mascaraTelefone(e.target.value);
                },
              })}
            />
            <Input
              id="empresa-email"
              label="E-mail de contato"
              type="email"
              placeholder="contato@empresa.com"
              icon={<LuMail size={16} />}
              error={errors.emailContato?.message}
              {...register('emailContato', {
                required: 'E-mail de contato é obrigatório.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'E-mail inválido.',
                },
              })}
            />
          </div>
        </section>

        {/* Seção: Endereço */}
        <section>
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
            Endereço
          </h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="col-span-2">
                <Input
                  id="empresa-logradouro"
                  label="Logradouro"
                  placeholder="Rua, Av., etc."
                  icon={<LuMapPin size={16} />}
                  error={errors.logradouro?.message}
                  {...register('logradouro', { required: 'Logradouro é obrigatório.' })}
                />
              </div>
              <Input
                id="empresa-numero"
                label="Número"
                placeholder="123"
                error={errors.numero?.message}
                {...register('numero', { required: 'Número é obrigatório.' })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="empresa-cidade"
                label="Cidade"
                placeholder="São Paulo"
                error={errors.cidade?.message}
                {...register('cidade', { required: 'Cidade é obrigatória.' })}
              />
              <Input
                id="empresa-estado"
                label="Estado (UF)"
                placeholder="SP"
                error={errors.estado?.message}
                {...register('estado', {
                  required: 'Estado é obrigatório.',
                  maxLength: { value: 2, message: 'Use a sigla (ex: SP).' },
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase().slice(0, 2);
                  },
                })}
              />
            </div>
          </div>
        </section>

        {/* Botão salvar */}
        <div className="flex justify-center sm:justify-end pb-4">
          <Button type="submit" loading={salvando} className="w-full sm:w-auto sm:min-w-32">
            <LuSave size={15} />
            Salvar dados
          </Button>
        </div>

      </form>
    </div>
  );
}
