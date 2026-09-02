const { PrismaClient } = require("@prisma/client");

// Singleton — evita múltiplas instâncias em desenvolvimento com hot-reload
const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

module.exports = prisma;
