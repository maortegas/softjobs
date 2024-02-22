const { createUser, loginUser, selectUser } = require("../controllers/usuario");
const {
  validatePostMiddleware,
  validateLoginMiddleware,
  validateGetMiddleware,
} = require("../middlewares/usuario");
const router = require("express").Router();

router.get("/usuarios", validateGetMiddleware, selectUser);
router.post("/usuarios", validatePostMiddleware, createUser);
router.post("/login", validateLoginMiddleware, loginUser);

router.use("*", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

module.exports = router;
