const Empresa = require("../models/Empresa");

// Empresa é singleton: sempre lê/atualiza o único documento existente (upsert cria se não existir)
exports.atualizar = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (req.file) {
      dados.logo = req.file.path;
    }

    const empresa = await Empresa.findOneAndUpdate({}, dados, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.json(empresa);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.buscar = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({});
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar empresa." });
  }
};
