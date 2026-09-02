const { z } = require("zod");

// ─── Schema de criação ────────────────────────────────────────────────────────
const criarServicoSchema = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),

  descricao: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .trim()
    .optional()
    .nullable(),

  preco: z
    .number({ required_error: "Preço é obrigatório", invalid_type_error: "Preço deve ser um número" })
    .positive("Preço deve ser maior que zero")
    .multipleOf(0.01, "Preço deve ter no máximo 2 casas decimais"),
});

// ─── Schema de atualização ────────────────────────────────────────────────────
// Todos os campos são opcionais no PUT (substitui apenas os enviados)
const atualizarServicoSchema = criarServicoSchema.partial();

// ─── Schema de toggle de ativo ────────────────────────────────────────────────
const toggleAtivoSchema = z.object({
  ativo: z.boolean({ required_error: "Campo 'ativo' é obrigatório e deve ser boolean" }),
});

module.exports = {
  criarServicoSchema,
  atualizarServicoSchema,
  toggleAtivoSchema,
};
