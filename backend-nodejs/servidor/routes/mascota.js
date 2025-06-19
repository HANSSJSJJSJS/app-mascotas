const express = require("express")
const router = express.Router()
const { executeQuery } = require("../DB/conexion")

// GET /api/mascotas/:propietarioId - Obtener mascotas de un propietario
router.get("/:propietarioId", async (req, res) => {
  try {
    const { propietarioId } = req.params;

    // Consulta SQL para obtener las mascotas de un propietario específico
    const mascotas = await executeQuery(
      `
      SELECT 
        cod_mas as id,
        nom_mas as nombre,
        especie as tipo,
        raza,
        edad,
        genero,
        peso,
        color,
        vacunado,
        esterilizado,
        foto
      FROM mascotas
      WHERE id_pro = ? AND activo = true
      ORDER BY nom_mas
    `,
      [propietarioId],
    );

    if (mascotas.length === 0) {
      return res.json([]); // Devuelve array vacío, no error
    }

    res.json(mascotas);
  } catch (error) {
    console.error("Error fetching mascotas:", error);
    res.status(500).json({ error: "Error al obtener las mascotas" });
  }
})

module.exports = router
