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

// GET /api/veterinarios/:id - Obtener datos de un veterinario por su ID
router.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const [veterinario] = await executeQuery(
      `
      SELECT 
        v.id_vet as id,
        u.nombre,
        u.apellido,
        u.email,
        u.telefono,
        v.especialidad,
        v.horario
      FROM veterinarios v
      INNER JOIN usuarios u ON v.id_vet = u.id_usuario
      WHERE v.id_vet = ?
      LIMIT 1
    `,
      [id]
    )

    if (!veterinario) {
      return res.status(404).json({ error: "Veterinario no encontrado" })
    }

    res.json(veterinario)
  } catch (error) {
    console.error("Error fetching veterinario:", error)
    res.status(500).json({ error: "Error al obtener el veterinario" })
  }
})

module.exports = router
