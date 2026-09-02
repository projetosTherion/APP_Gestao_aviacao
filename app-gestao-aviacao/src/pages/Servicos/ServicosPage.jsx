import { useState, useEffect, useCallback } from "react";
import { BadgeAtivo as Badge } from "../../components/ui/Badge";
import ServicoModal from "../../components/Servicos/ServicoModal";
import {
  listarServicos,
  toggleAtivo,
} from "../../services/servicos.api";
import "./ServicosPage.css";

export default function ServicosPage() {
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Filtros
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [busca, setBusca] = useState("");

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoEdicao, setServicoEdicao] = useState(null);

  // ── Buscar serviços ──────────────────────────────────────────────────────────
  const fetchServicos = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const params = {};
      if (filtroAtivo !== "todos") params.ativo = filtroAtivo === "ativos";
      if (busca.trim()) params.busca = busca.trim();

      const dados = await listarServicos(params);
      setServicos(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [filtroAtivo, busca]);

  useEffect(() => {
    fetchServicos();
  }, [fetchServicos]);

  // ── Abrir modal para criar ───────────────────────────────────────────────────
  const abrirCriar = () => {
    setServicoEdicao(null);
    setModalAberto(true);
  };

  // ── Abrir modal para editar ──────────────────────────────────────────────────
  const abrirEditar = (servico) => {
    setServicoEdicao(servico);
    setModalAberto(true);
  };

  // ── Após salvar no modal, atualiza a lista ───────────────────────────────────
  const handleSalvo = (servicoSalvo) => {
    setServicos((prev) => {
      const jaExiste = prev.find((s) => s.id === servicoSalvo.id);
      if (jaExiste) {
        return prev.map((s) => (s.id === servicoSalvo.id ? servicoSalvo : s));
      }
      return [servicoSalvo, ...prev];
    });
  };

  // ── Alternar status ativo ────────────────────────────────────────────────────
  const handleToggleAtivo = async (servico) => {
    try {
      const atualizado = await toggleAtivo(servico.id, !servico.ativo);
      setServicos((prev) =>
        prev.map((s) => (s.id === atualizado.id ? atualizado : s))
      );
    } catch (err) {
      alert(`Erro ao atualizar status: ${err.message}`);
    }
  };

  // ── Formatar preço ───────────────────────────────────────────────────────────
  const formatarPreco = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="page">
      {/* Header da página */}
      <div className="page-header">
        <div>
          <h1 className="page-titulo">Serviços</h1>
          <p className="page-subtitulo">Gerencie os serviços oferecidos</p>
        </div>
        <button
          id="btn-novo-servico"
          className="btn btn-primario"
          onClick={abrirCriar}
        >
          + Novo serviço
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="filtros">
        <input
          id="busca-servico"
          type="search"
          className="form-input filtro-busca"
          placeholder="Buscar por nome…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="filtro-tabs">
          {[
            { valor: "todos", label: "Todos" },
            { valor: "ativos", label: "Ativos" },
            { valor: "inativos", label: "Inativos" },
          ].map((tab) => (
            <button
              key={tab.valor}
              className={`filtro-tab ${filtroAtivo === tab.valor ? "filtro-tab--ativo" : ""}`}
              onClick={() => setFiltroAtivo(tab.valor)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estado de erro */}
      {erro && (
        <div className="estado-erro">
          <p>⚠️ {erro}</p>
          <button className="btn btn-secundario" onClick={fetchServicos}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Estado de carregando */}
      {carregando && (
        <div className="estado-loading">
          <div className="spinner" />
          <p>Carregando serviços…</p>
        </div>
      )}

      {/* Tabela */}
      {!carregando && !erro && servicos.length > 0 && (
        <div className="tabela-wrapper">
          <table className="tabela" id="tabela-servicos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th className="col-preco">Preço</th>
                <th className="col-status">Status</th>
                <th className="col-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico.id} className={!servico.ativo ? "row-inativo" : ""}>
                  <td className="td-nome">{servico.nome}</td>
                  <td className="td-descricao">
                    {servico.descricao ?? <span className="sem-descricao">—</span>}
                  </td>
                  <td className="col-preco td-preco">{formatarPreco(servico.preco)}</td>
                  <td className="col-status">
                    <Badge ativo={servico.ativo} />
                  </td>
                  <td className="col-acoes">
                    <div className="acoes">
                      <button
                        className="btn-acao btn-acao--editar"
                        onClick={() => abrirEditar(servico)}
                        title="Editar"
                        aria-label={`Editar ${servico.nome}`}
                        id={`btn-editar-${servico.id}`}
                      >
                        ✏️
                      </button>
                      <button
                        className={`btn-acao ${servico.ativo ? "btn-acao--desativar" : "btn-acao--ativar"}`}
                        onClick={() => handleToggleAtivo(servico)}
                        title={servico.ativo ? "Desativar" : "Ativar"}
                        aria-label={`${servico.ativo ? "Desativar" : "Ativar"} ${servico.nome}`}
                        id={`btn-toggle-${servico.id}`}
                      >
                        {servico.ativo ? "🔴" : "🟢"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Estado vazio */}
      {!carregando && !erro && servicos.length === 0 && (
        <div className="estado-vazio">
          <div className="estado-vazio-icone">🛠️</div>
          <h2>Nenhum serviço encontrado</h2>
          <p>
            {busca || filtroAtivo !== "todos"
              ? "Tente ajustar os filtros de busca."
              : "Comece cadastrando o primeiro serviço."}
          </p>
          {!busca && filtroAtivo === "todos" && (
            <button className="btn btn-primario" onClick={abrirCriar}>
              + Criar primeiro serviço
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <ServicoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        servicoEdicao={servicoEdicao}
        onSalvo={handleSalvo}
      />
    </div>
  );
}
