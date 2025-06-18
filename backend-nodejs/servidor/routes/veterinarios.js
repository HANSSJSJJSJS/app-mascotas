const express = require("express")
const router = express.Router()
const { executeQuery } = require("../DB/conexion")

// GET /api/veterinarios - Obtener todos los veterinarios activos
router.get("/", async (req, res) => {
  try {
    // Consulta SQL que une las tablas veterinarios y usuarios
    const veterinarios = await executeQuery(`
      SELECT 
        v.id_vet as id,
        CONCAT(u.nombre, ' ', u.apellido) as nombre,
        v.especialidad,
        v.horario
      FROM veterinarios v
      INNER JOIN usuarios u ON v.id_vet = u.id_usuario
      WHERE u.estado = 1
      ORDER BY u.nombre, u.apellido
    `)

    res.json(veterinarios)
  } catch (error) {
    console.error("Error fetching veterinarios:", error)
    res.status(500).json({ error: "Error al obtener los veterinarios" })
  }
})

module.exports = router
