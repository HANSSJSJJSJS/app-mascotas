const express = require("express")
const router = express.Router()
const { executeQuery } = require("../DB/conexion")

// POST /api/citas - Crear una nueva cita
router.post("/", async (req, res) => {
  try {
    const { fecha, hora, idServicio, idVeterinario, idMascota, idPropietario, notas } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!fecha || !hora || !idServicio || !idVeterinario || !idMascota || !idPropietario) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar disponibilidad del veterinario en esa fecha y hora
    const citasExistentes = await executeQuery(
      `
      SELECT COUNT(*) as count
      FROM citas
      WHERE id_vet = ? AND fech_cit = ? AND hora = ? AND estado NOT IN ('CANCELADA')
    `,
      [idVeterinario, fecha, hora],
    );

    if (citasExistentes[0].count > 0) {
      return res.status(409).json({
        error: "El veterinario no está disponible en esa fecha y hora",
      });
    }

    // Insertar la nueva cita en la base de datos
    const result = await executeQuery(
      `
      INSERT INTO citas (fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, notas, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDIENTE')
    `,
      [fecha, hora, idServicio, idVeterinario, idMascota, idPropietario, notas || null],
    );

    res.status(201).json({
      message: "Cita agendada exitosamente",
      citaId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating cita:", error);
    res.status(500).json({ error: "Error al agendar la cita" });
  }
})

// GET /api/citas - Obtener citas (opcionalmente filtradas por propietario)
router.get("/", async (req, res) => {
  try {
    const { propietarioId } = req.query

    // Consulta SQL compleja que une múltiples tablas
    let query = `
      SELECT 
        c.cod_cit as id,
        c.fech_cit as fecha,
        c.hora,
        c.estado,
        c.notas,
        s.nom_ser as servicio,
        s.precio,
        CONCAT(u.nombre, ' ', u.apellido) as veterinario,
        m.nom_mas as mascota
      FROM citas c
      INNER JOIN servicios s ON c.cod_ser = s.cod_ser
      INNER JOIN veterinarios v ON c.id_vet = v.id_vet
      INNER JOIN usuarios u ON v.id_vet = u.id_usuario
      INNER JOIN mascotas m ON c.cod_mas = m.cod_mas
    `

    const params = []

    // Filtrar por propietario si se proporciona el parámetro
    if (propietarioId) {
      query += " WHERE c.id_pro = ?"
      params.push(propietarioId)
    }

    query += " ORDER BY c.fech_cit DESC, c.hora DESC"

    const citas = await executeQuery(query, params)
    res.json(citas)
  } catch (error) {
    console.error("Error fetching citas:", error)
    res.status(500).json({ error: "Error al obtener las citas" })
  }
})

module.exports = router
