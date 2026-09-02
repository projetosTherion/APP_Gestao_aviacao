const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

function gerarToken(usuarioId) {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const usuario = await Usuario.create({ nome, email, senha });

    res.status(201).json({
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
      token: gerarToken(usuario._id),
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ erro: "E-mail ou senha inválidos." });
    }

    res.json({
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email },
      token: gerarToken(usuario._id),
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao autenticar." });
  }
};
