const express = require("express");
const router = express.Router();
const { executeQuery } = require("../DB/conexion");

// Endpoint para contar consultas pendientes
router.get("/consultas-pendientes", async (req, res) => {
  try {
    const [result] = await executeQuery(`
      SELECT COUNT(*) AS total FROM citas WHERE estado = 'PENDIENTE'
    `);
    res.json({ total: result.total });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener consultas pendientes" });
  }
});

module.exports = router;