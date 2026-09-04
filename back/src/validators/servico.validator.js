const { z } = require("zod");

// ─── Schema de criação ────────────────────────────────────────────────────────
const criarServicoSchema = z.object({
  nome: z
<<<<<<< HEAD
    .string({
      error: (issue) =>
        issue.input === undefined ? "Nome é obrigatório" : "Nome deve ser um texto",
    })
=======
    .string({ required_error: "Nome é obrigatório" })
>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
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
<<<<<<< HEAD
    .number({
      error: (issue) =>
        issue.input === undefined ? "Preço é obrigatório" : "Preço deve ser um número",
    })
=======
    .number({ required_error: "Preço é obrigatório", invalid_type_error: "Preço deve ser um número" })
>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
    .positive("Preço deve ser maior que zero")
    .multipleOf(0.01, "Preço deve ter no máximo 2 casas decimais"),
});

// ─── Schema de atualização ────────────────────────────────────────────────────
// Todos os campos são opcionais no PUT (substitui apenas os enviados)
const atualizarServicoSchema = criarServicoSchema.partial();

// ─── Schema de toggle de ativo ────────────────────────────────────────────────
const toggleAtivoSchema = z.object({
<<<<<<< HEAD
  ativo: z.boolean({
    error: "Campo 'ativo' é obrigatório e deve ser boolean",
  }),
=======
  ativo: z.boolean({ required_error: "Campo 'ativo' é obrigatório e deve ser boolean" }),
>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
});

module.exports = {
  criarServicoSchema,
  atualizarServicoSchema,
  toggleAtivoSchema,
};
