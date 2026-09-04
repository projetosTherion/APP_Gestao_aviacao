import { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./ServicoForm.css";

/**
 * Formulário compartilhado entre criação e edição de Serviço.
 *
 * Props:
 *   servicoInicial  object|null  — se preenchido, entra em modo edição
 *   onSubmit        fn           — async (dados) => void
 *   onCancelar      fn
 *   carregando      boolean
 *   erro            string|null
 */
export default function ServicoForm({
  servicoInicial = null,
  onSubmit,
  onCancelar,
  carregando = false,
  erro = null,
}) {
  const modoEdicao = servicoInicial !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: "",
      descricao: "",
      preco: "",
    },
  });

  // Preenche o formulário ao abrir em modo edição
  useEffect(() => {
    if (servicoInicial) {
      reset({
        nome: servicoInicial.nome ?? "",
        descricao: servicoInicial.descricao ?? "",
        preco: servicoInicial.preco != null ? String(servicoInicial.preco) : "",
      });
    } else {
      reset({ nome: "", descricao: "", preco: "" });
    }
  }, [servicoInicial, reset]);

  // Converte preco de string para number antes de enviar
  const handleFormSubmit = (dados) => {
    onSubmit({
      ...dados,
      preco: parseFloat(dados.preco),
      descricao: dados.descricao || null,
    });
  };

  return (
    <form className="servico-form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {/* Nome */}
      <div className="form-group">
        <label htmlFor="servico-nome" className="form-label">
          Nome <span className="form-obrigatorio">*</span>
        </label>
        <input
          id="servico-nome"
          type="text"
          className={`form-input ${errors.nome ? "form-input--erro" : ""}`}
          placeholder="Ex: Revisão de motor"
          autoComplete="off"
          {...register("nome", {
            required: "Nome é obrigatório",
            minLength: { value: 2, message: "Mínimo de 2 caracteres" },
            maxLength: { value: 100, message: "Máximo de 100 caracteres" },
          })}
        />
        {errors.nome && (
          <span className="form-erro-msg">{errors.nome.message}</span>
        )}
      </div>

      {/* Descrição */}
      <div className="form-group">
        <label htmlFor="servico-descricao" className="form-label">
          Descrição
        </label>
        <textarea
          id="servico-descricao"
          className={`form-input form-textarea ${errors.descricao ? "form-input--erro" : ""}`}
          placeholder="Descreva o serviço (opcional)"
          rows={3}
          {...register("descricao", {
            maxLength: { value: 500, message: "Máximo de 500 caracteres" },
          })}
        />
        {errors.descricao && (
          <span className="form-erro-msg">{errors.descricao.message}</span>
        )}
      </div>

      {/* Preço */}
      <div className="form-group">
        <label htmlFor="servico-preco" className="form-label">
          Preço (R$) <span className="form-obrigatorio">*</span>
        </label>
        <input
          id="servico-preco"
          type="number"
          step="0.01"
          min="0.01"
          className={`form-input ${errors.preco ? "form-input--erro" : ""}`}
          placeholder="0,00"
          {...register("preco", {
            required: "Preço é obrigatório",
            min: { value: 0.01, message: "Preço deve ser maior que zero" },
            validate: (v) =>
              !isNaN(parseFloat(v)) || "Informe um valor numérico válido",
          })}
        />
        {errors.preco && (
          <span className="form-erro-msg">{errors.preco.message}</span>
        )}
      </div>

      {/* Erro global da API */}
      {erro && <p className="form-erro-global">{erro}</p>}

      {/* Ações */}
      <div className="form-acoes">
        <button
          type="button"
          className="btn btn-secundario"
          onClick={onCancelar}
          disabled={carregando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primario"
          disabled={carregando}
          id="btn-salvar-servico"
        >
          {carregando ? "Salvando…" : modoEdicao ? "Salvar alterações" : "Criar serviço"}
        </button>
      </div>
    </form>
  );
}
