const express = require("express");
const router = express.Router();
const empresaController = require("../controllers/empresaController");
const upload = require("../middleware/upload");
const protegerRota = require("../middleware/auth");

router.get("/empresa", protegerRota, empresaController.buscar);
router.put("/empresa", protegerRota, upload.single("logo"), empresaController.atualizar);

module.exports = router;
