import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LuUsers, LuPlus, LuSearch, LuPencil, LuTrash2, LuEye, LuUserPlus,
} from 'react-icons/lu';
import { listarClientes, excluirCliente } from '../../services/clientesService';
import { formatarDocumento, formatarTelefone, tipoDocumento } from '../../utils/mascaras';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const DEBOUNCE_MS = 300;

/**
 * Clientes — listagem com busca, acesso ao detalhe, edição e exclusão.
 * Rota: /clientes
 */
export default function Clientes() {
  const navigate = useNavigate();
  const location = useLocation();

  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState(location.state?.toast ?? null);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  // Limpa o state da navegação para o toast não reaparecer em refresh/voltar
  useEffect(() => {
    if (location.state?.toast) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // Toast desaparece sozinho
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const carregar = useCallback(async (termo) => {
    setErro('');
    try {
      const lista = await listarClientes({ busca: termo });
      setClientes(lista);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => carregar(busca.trim()), busca ? DEBOUNCE_MS : 0);
    return () => clearTimeout(timer);
  }, [busca, carregar]);

  const confirmarExclusao = async () => {
    if (!clienteParaExcluir) return;
    setExcluindo(true);
    try {
      await excluirCliente(clienteParaExcluir.id);
      setClientes((atual) => atual.filter((c) => c.id !== clienteParaExcluir.id));
      setToast({ tipo: 'sucesso', msg: `Cliente "${clienteParaExcluir.nome}" removido.` });
      setClienteParaExcluir(null);
    } catch (e) {
      setClienteParaExcluir(null);
      setToast({ tipo: 'erro', msg: e.message });
    } finally {
      setExcluindo(false);
    }
  };

  const listaVazia = !carregando && clientes.length === 0;

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-content flex items-center gap-2.5">
            <LuUsers size={22} className="text-primary" aria-hidden="true" />
            Clientes
          </h1>
          <p className="mt-1 text-sm text-content-muted">
            Pessoas e empresas para quem você presta serviços. Aparecem nos pedidos e documentos.
          </p>
        </div>
        <Button onClick={() => navigate('/clientes/novo')} className="w-full sm:w-auto shrink-0">
          <LuPlus size={16} aria-hidden="true" />
          Novo cliente
        </Button>
      </div>

      {toast && (
        <Alert tipo={toast.tipo} onClose={() => setToast(null)} className="mb-6">
          {toast.msg}
        </Alert>
      )}

      {/* Busca */}
      <div className="mb-5 max-w-md">
        <Input
          id="clientes-busca"
          type="search"
          placeholder="Buscar por nome, CPF/CNPJ ou e-mail"
          icon={<LuSearch size={16} />}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar clientes"
        />
      </div>

      {erro && (
        <Alert tipo="erro" className="mb-5">
          {erro}{' '}
          <button
            type="button"
            onClick={() => { setCarregando(true); carregar(busca.trim()); }}
            className="underline font-medium hover:opacity-80"
          >
            Tentar novamente
          </button>
        </Alert>
      )}

      {/* Conteúdo */}
      {carregando ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      ) : listaVazia ? (
        <EstadoVazio comBusca={Boolean(busca.trim())} />
      ) : (
        <>
          <p className="text-xs text-content-subtle mb-3">
            {clientes.length} {clientes.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
          </p>

          {/* Tabela (sm+) */}
          <div className="hidden sm:block rounded-xl border border-border bg-bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-content-subtle border-b border-border">
                    <th className="px-5 py-3 font-semibold">Cliente</th>
                    <th className="px-5 py-3 font-semibold">Documento</th>
                    <th className="px-5 py-3 font-semibold">Telefone</th>
                    <th className="px-5 py-3 font-semibold">Cidade</th>
                    <th className="px-5 py-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clientes.map((c) => (
                    <tr key={c.id} className="hover:bg-bg/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/clientes/${c.id}`} className="font-medium text-content hover:text-primary transition-colors">
                          {c.nome}
                        </Link>
                        {c.email && <p className="text-xs text-content-subtle mt-0.5">{c.email}</p>}
                      </td>
                      <td className="px-5 py-3.5 text-content-muted whitespace-nowrap">
                        <span className="tabular-nums">{formatarDocumento(c.documento)}</span>
                        <Badge className="ml-2">{tipoDocumento(c.documento)}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-content-muted whitespace-nowrap tabular-nums">
                        {formatarTelefone(c.telefone)}
                      </td>
                      <td className="px-5 py-3.5 text-content-muted">
                        {c.cidade ? `${c.cidade}${c.estado ? ` / ${c.estado}` : ''}` : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <AcoesCliente cliente={c} onExcluir={setClienteParaExcluir} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards (mobile) */}
          <ul className="sm:hidden flex flex-col gap-3">
            {clientes.map((c) => (
              <li key={c.id} className="rounded-xl border border-border bg-bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/clientes/${c.id}`} className="font-medium text-content hover:text-primary transition-colors block truncate">
                      {c.nome}
                    </Link>
                    <p className="text-xs text-content-subtle mt-0.5 tabular-nums">
                      {tipoDocumento(c.documento)} {formatarDocumento(c.documento)}
                    </p>
                  </div>
                  <AcoesCliente cliente={c} onExcluir={setClienteParaExcluir} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-content-subtle">Telefone</dt>
                    <dd className="text-content-muted tabular-nums">{formatarTelefone(c.telefone)}</dd>
                  </div>
                  <div>
                    <dt className="text-content-subtle">Cidade</dt>
                    <dd className="text-content-muted">
                      {c.cidade ? `${c.cidade}${c.estado ? ` / ${c.estado}` : ''}` : '—'}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmDialog
        aberto={Boolean(clienteParaExcluir)}
        titulo="Excluir cliente"
        descricao={
          <>
            Tem certeza que deseja excluir <strong className="text-content">{clienteParaExcluir?.nome}</strong>?
            Esta ação não pode ser desfeita. Clientes com pedidos vinculados não podem ser excluídos.
          </>
        }
        textoConfirmar="Excluir"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setClienteParaExcluir(null)}
      />
    </div>
  );
}

function AcoesCliente({ cliente, onExcluir }) {
  const base = 'p-2 rounded-md transition-colors';
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={`/clientes/${cliente.id}`}
        className={`${base} text-content-subtle hover:text-content hover:bg-bg`}
        aria-label={`Ver detalhes de ${cliente.nome}`}
        title="Ver detalhes"
      >
        <LuEye size={16} />
      </Link>
      <Link
        to={`/clientes/${cliente.id}/editar`}
        className={`${base} text-content-subtle hover:text-primary hover:bg-primary/10`}
        aria-label={`Editar ${cliente.nome}`}
        title="Editar"
      >
        <LuPencil size={16} />
      </Link>
      <button
        type="button"
        onClick={() => onExcluir(cliente)}
        className={`${base} text-content-subtle hover:text-feedback-error hover:bg-feedback-error/10`}
        aria-label={`Excluir ${cliente.nome}`}
        title="Excluir"
      >
        <LuTrash2 size={16} />
      </button>
    </div>
  );
}

function EstadoVazio({ comBusca }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-bg-surface/50 py-16 px-6 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <LuUserPlus size={22} className="text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-base font-semibold text-content">
        {comBusca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
      </h2>
      <p className="mt-1 text-sm text-content-muted max-w-sm mx-auto">
        {comBusca
          ? 'Tente outro nome, CPF/CNPJ ou e-mail.'
          : 'Cadastre o primeiro cliente para começar a criar pedidos e documentos.'}
      </p>
      {!comBusca && (
        <Link to="/clientes/novo" className="inline-block mt-5">
          <Button type="button">
            <LuPlus size={16} aria-hidden="true" />
            Cadastrar cliente
          </Button>
        </Link>
      )}
    </div>
  );
}
