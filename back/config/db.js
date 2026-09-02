const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    // process.exit(1); // Comentado temporariamente para não derrubar o app (pois usamos Postgres para Serviços)
  }
}

module.exports = connectDB;
