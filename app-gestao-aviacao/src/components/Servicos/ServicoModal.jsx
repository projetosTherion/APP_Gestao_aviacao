import { useState, useCallback } from "react";
import Modal from "../ui/Modal";
import ServicoForm from "./ServicoForm";
import { criarServico, atualizarServico } from "../../services/servicos.api";

/**
 * Modal orquestrador de Serviço.
 * Gerencia estado de loading/erro e delega ao ServicoForm.
 *
 * Props:
 *   aberto           boolean
 *   onFechar         fn
 *   servicoEdicao    object|null — se null, cria novo; se preenchido, edita
 *   onSalvo          fn(servico) — callback após salvar com sucesso
 */
export default function ServicoModal({
  aberto,
  onFechar,
  servicoEdicao = null,
  onSalvo,
}) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const modoEdicao = servicoEdicao !== null;

  const handleSubmit = useCallback(
    async (dados) => {
      setCarregando(true);
      setErro(null);
      try {
        let servico;
        if (modoEdicao) {
          servico = await atualizarServico(servicoEdicao.id, dados);
        } else {
          servico = await criarServico(dados);
        }
        onSalvo(servico);
        onFechar();
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    },
    [modoEdicao, servicoEdicao, onSalvo, onFechar]
  );

  const handleFechar = () => {
    if (!carregando) {
      setErro(null);
      onFechar();
    }
  };

  return (
    <Modal
      aberto={aberto}
      onFechar={handleFechar}
      titulo={modoEdicao ? "Editar serviço" : "Novo serviço"}
    >
      <ServicoForm
        servicoInicial={servicoEdicao}
        onSubmit={handleSubmit}
        onCancelar={handleFechar}
        carregando={carregando}
        erro={erro}
      />
    </Modal>
  );
}
