/**
 * Middleware global de tratamento de erros.
 * Deve ser registrado APÓS todas as rotas no index.js.
 *
 * Padrão de uso:
 *   app.use(errorHandler);
 */
function errorHandler(err, req, res, next) {
  // Erros de validação do Zod
  if (err.name === "ZodError") {
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: err.errors.map((e) => ({
        campo: e.path.join("."),
        mensagem: e.message,
      })),
    });
  }

  // Erros do Prisma — registro não encontrado
  if (err.code === "P2025") {
    return res.status(404).json({ erro: "Registro não encontrado" });
  }

  // Erros do Prisma — violação de unique constraint
  if (err.code === "P2002") {
    const campo = err.meta?.target?.join(", ") ?? "campo";
    return res.status(409).json({
      erro: `Já existe um registro com este valor no campo: ${campo}`,
    });
  }

  // Erros genéricos
  console.error("[errorHandler]", err);
  return res.status(err.statusCode ?? 500).json({
    erro: err.message ?? "Erro interno do servidor",
  });
}

module.exports = errorHandler;
