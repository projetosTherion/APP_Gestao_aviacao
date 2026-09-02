const mongoose = require("mongoose");

function calcularDigito(cnpjParcial, pesos) {
  const soma = cnpjParcial
    .split("")
    .reduce((acc, digito, i) => acc + Number(digito) * pesos[i], 0);
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function validarCnpj(valor) {
  const cnpj = (valor || "").replace(/\D/g, "");

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false; // rejeita tudo igual (00000000000000 etc.)

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digito1 = calcularDigito(cnpj.slice(0, 12), pesos1);
  const digito2 = calcularDigito(cnpj.slice(0, 12) + digito1, pesos2);

  return cnpj.endsWith(`${digito1}${digito2}`);
}

const empresaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    slogan: { type: String },
    logo: { type: String }, // caminho público, ex: "/uploads/logo-1234567.png"
    cnpj: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validarCnpj,
        message: (props) => `${props.value} não é um CNPJ válido.`,
      },
    },
    contato: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "E-mail de contato inválido."],
      },
      telefone: {
        type: String,
        required: true,
        match: [/^\d{10,11}$/, "Telefone deve ter DDD + número (10 ou 11 dígitos)."],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Empresa", empresaSchema);
