const express = require("express")
const router = express.Router()
const { executeQuery } = require("../DB/conexion")

// GET /api/servicios - Obtener todos los servicios
router.get("/", async (req, res) => {
  try {
    const servicios = await executeQuery(`
      SELECT 
        cod_ser as id,
        nom_ser as nombre,
        descrip_ser as descripcion,
        precio
      FROM servicios
      ORDER BY cod_ser
    `)

    res.json(servicios)
  } catch (error) {
    console.error("Error fetching servicios:", error)
    res.status(500).json({ error: "Error al obtener los servicios" })
  }
})

module.exports = router
