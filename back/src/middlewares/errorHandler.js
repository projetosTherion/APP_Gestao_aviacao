/**
 * Middleware global de tratamento de erros.
 * Deve ser registrado APÓS todas as rotas no index.js.
 *
 * Padrão de uso:
 *   app.use(errorHandler);
 */
function errorHandler(err, req, res, next) {
  // Erros de validação do Zod
<<<<<<< HEAD
  // Zod v4 expõe os problemas em `err.issues` (em v3 era `err.errors`).
  // Mantemos os dois por segurança, com issues tendo prioridade.
  if (err.name === "ZodError") {
    const problemas = err.issues || err.errors || [];
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: problemas.map((e) => ({
=======
  if (err.name === "ZodError") {
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: err.errors.map((e) => ({
>>>>>>> 640d4eac854215cabfbaecbed7044e41d6a1ff7f
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
