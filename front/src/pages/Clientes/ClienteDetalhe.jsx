import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  LuArrowLeft, LuPencil, LuTrash2, LuMail, LuPhone, LuMapPin, LuHash,
  LuClipboardList, LuCalendar,
} from 'react-icons/lu';
import {
  obterCliente, listarPedidosDoCliente, excluirCliente,
} from '../../services/clientesService';
import {
  formatarDocumento, formatarTelefone, tipoDocumento, formatarMoeda, formatarData,
} from '../../utils/mascaras';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Badge, { BadgeStatusPedido } from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

/**
 * ClienteDetalhe — dados do cliente + histórico de pedidos vinculados.
 * Rota: /clientes/:id
 */
export default function ClienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [cliente, setCliente] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroPedidos, setErroPedidos] = useState('');
  const [toast, setToast] = useState(location.state?.toast ?? null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (location.state?.toast) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // AppLayout remonta a página a cada rota, então o estado inicial já está limpo.
  useEffect(() => {
    let ativo = true;

    Promise.allSettled([obterCliente(id), listarPedidosDoCliente(id)])
      .then(([resCliente, resPedidos]) => {
        if (!ativo) return;
        if (resCliente.status === 'fulfilled') {
          setCliente(resCliente.value);
        } else {
          setErro(resCliente.reason?.message || 'Erro ao carregar cliente.');
        }
        if (resPedidos.status === 'fulfilled') {
          setPedidos(resPedidos.value);
        } else if (resCliente.status === 'fulfilled') {
          setErroPedidos(resPedidos.reason?.message || 'Erro ao carregar pedidos.');
        }
      })
      .finally(() => ativo && setCarregando(false));

    return () => { ativo = false; };
  }, [id]);

  const confirmarExclusao = async () => {
    setExcluindo(true);
    try {
      await excluirCliente(id);
      navigate('/clientes', {
        state: { toast: { tipo: 'sucesso', msg: `Cliente "${cliente.nome}" removido.` } },
      });
    } catch (e) {
      setConfirmandoExclusao(false);
      setToast({ tipo: 'erro', msg: e.message });
    } finally {
      setExcluindo(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (erro || !cliente) {
    return (
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-8 py-10">
        <Alert tipo="erro">{erro || 'Cliente não encontrado.'}</Alert>
        <Link to="/clientes" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-4">
          <LuArrowLeft size={15} aria-hidden="true" />
          Voltar para clientes
        </Link>
      </div>
    );
  }

  const endereco = [
    [cliente.logradouro, cliente.numero].filter(Boolean).join(', '),
    [cliente.cidade, cliente.estado].filter(Boolean).join(' / '),
  ].filter(Boolean).join(' — ');

  const totalPedidos = pedidos.reduce((soma, p) => soma + (Number(p.total) || 0), 0);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-10">
      <Link
        to="/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-content-muted hover:text-content transition-colors mb-6"
      >
        <LuArrowLeft size={15} aria-hidden="true" />
        Voltar para clientes
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-content break-words">{cliente.nome}</h1>
            <Badge>{tipoDocumento(cliente.documento)}</Badge>
          </div>
          <p className="mt-1 text-sm text-content-muted tabular-nums">
            {formatarDocumento(cliente.documento)}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" onClick={() => navigate(`/clientes/${id}/editar`)} className="flex-1 sm:flex-none">
            <LuPencil size={15} aria-hidden="true" />
            Editar
          </Button>
          <Button variant="danger" onClick={() => setConfirmandoExclusao(true)} className="flex-1 sm:flex-none">
            <LuTrash2 size={15} aria-hidden="true" />
            Excluir
          </Button>
        </div>
      </div>

      {toast && (
        <Alert tipo={toast.tipo} onClose={() => setToast(null)} className="mb-6">
          {toast.msg}
        </Alert>
      )}

      {/* Dados */}
      <section className="rounded-xl border border-border bg-bg-surface p-5 sm:p-6 mb-8">
        <h2 className="text-sm font-semibold text-content uppercase tracking-wider mb-4 pb-2 border-b border-border">
          Dados do cliente
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <ItemDado Icone={LuHash} rotulo={tipoDocumento(cliente.documento)} valor={formatarDocumento(cliente.documento)} mono />
          <ItemDado Icone={LuMail} rotulo="E-mail" valor={cliente.email || '—'} />
          <ItemDado Icone={LuPhone} rotulo="Telefone" valor={formatarTelefone(cliente.telefone)} mono />
          <ItemDado Icone={LuMapPin} rotulo="Endereço" valor={endereco || '—'} />
          <ItemDado Icone={LuCalendar} rotulo="Cadastrado em" valor={formatarData(cliente.criado_em)} />
          <ItemDado Icone={LuCalendar} rotulo="Última atualização" valor={formatarData(cliente.atualizado_em)} />
        </dl>
      </section>

      {/* Histórico de pedidos */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-border">
          <h2 className="text-sm font-semibold text-content uppercase tracking-wider flex items-center gap-2">
            <LuClipboardList size={16} className="text-primary" aria-hidden="true" />
            Histórico de pedidos
          </h2>
          {pedidos.length > 0 && (
            <p className="text-xs text-content-subtle">
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} · total {formatarMoeda(totalPedidos)}
            </p>
          )}
        </div>

        {erroPedidos ? (
          <Alert tipo="erro">{erroPedidos}</Alert>
        ) : pedidos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-bg-surface/50 py-10 px-6 text-center">
            <p className="text-sm text-content-muted">
              Este cliente ainda não possui pedidos. Os pedidos criados para ele aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-content-subtle border-b border-border">
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 font-semibold">Descrição</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pedidos.map((p) => (
                    <tr key={p.id} className="hover:bg-bg/40 transition-colors">
                      <td className="px-5 py-3.5 text-content-muted whitespace-nowrap tabular-nums">
                        {formatarData(p.criado_em)}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-content">{p.observacoes || 'Pedido sem observações'}</p>
                        <p className="text-xs text-content-subtle mt-0.5">
                          {p.itens?.length || 0} {p.itens?.length === 1 ? 'serviço' : 'serviços'}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <BadgeStatusPedido status={p.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-content whitespace-nowrap tabular-nums">
                        {formatarMoeda(p.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog
        aberto={confirmandoExclusao}
        titulo="Excluir cliente"
        descricao={
          <>
            Tem certeza que deseja excluir <strong className="text-content">{cliente.nome}</strong>?
            Esta ação não pode ser desfeita.
            {pedidos.length > 0 && (
              <> Este cliente possui {pedidos.length} {pedidos.length === 1 ? 'pedido vinculado' : 'pedidos vinculados'}, então a exclusão será bloqueada.</>
            )}
          </>
        }
        textoConfirmar="Excluir"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </div>
  );
}

function ItemDado({ Icone, rotulo, valor, mono = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center shrink-0">
        <Icone size={15} className="text-content-subtle" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs text-content-subtle">{rotulo}</dt>
        <dd className={`text-content break-words ${mono ? 'tabular-nums' : ''}`}>{valor}</dd>
      </div>
    </div>
  );
}
