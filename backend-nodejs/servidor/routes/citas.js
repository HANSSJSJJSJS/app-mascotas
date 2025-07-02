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
        prop.nombre AS prop_nombre,
        prop.apellido AS prop_apellido,
        prop.telefono AS prop_telefono,
        prop.ciudad AS prop_ciudad,
        prop.barrio AS prop_barrio,
        prop.direccion AS prop_direccion,
        prop.email AS prop_email,
        m.nom_mas as mascota
      FROM citas c
      INNER JOIN servicios s ON c.cod_ser = s.cod_ser
      INNER JOIN veterinarios v ON c.id_vet = v.id_vet
      INNER JOIN usuarios u ON v.id_vet = u.id_usuario
      INNER JOIN mascotas m ON c.cod_mas = m.cod_mas
      INNER JOIN usuarios prop ON m.id_pro = prop.id_usuario
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
    console.log(error)
    console.error("Error fetching citas:", error)
    res.status(500).json({ error: "Error al obtener las citas" })
  }
})

router.get("/registrar", async (req, res) => {
  const body = req.body

  try {
    // Consulta SQL compleja que une múltiples tablas
    let query = `
      INSERT INTO citas ( fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas )
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);
    `

    const params = [
      body.mascota,
      body.propietario,
      body.fecha,
      body.hora,
      body.tipo,
      body.prioridad,
      body.motivo,
      body.tipoMascota,
      body.raza,
      body.telefono,
      body.email
    ]

    const citas = await executeQuery(query, params)
    res.json(citas)
  } catch (error) {
    console.log(error)
    console.error("Error fetching citas:", error)
    res.status(500).json({ error: "Error al obtener las citas" })
  }
})

// PUT /api/citas/:id - Actualizar el estado de una cita
router.put('/:id', async (req, res) => {
  try {
    const citaId = req.params.id;
    const { estado } = req.body;
    if (!estado) {
      return res.status(400).json({ error: 'El estado es requerido' });
    }

    // Si se intenta cancelar, validar la ventana de 24 horas
    if (estado === 'CANCELADA') {
      // Obtener la cita actual
      const [cita] = await executeQuery(
        'SELECT estado, fech_cit, hora FROM citas WHERE cod_cit = ?',
        [citaId]
      );
      if (!cita) {
        return res.status(404).json({ error: 'Cita no encontrada' });
      }
      // Solo aplica la restricción si la cita está confirmada
      if (cita.estado === 'CONFIRMADA') {
        // Combinar fecha y hora de la cita
        const citaDateTime = new Date(`${cita.fech_cit}T${cita.hora}`);
        const now = new Date();
        const diffMs = citaDateTime - now;
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours < 24) {
          return res.status(403).json({ error: 'Solo puedes cancelar una cita confirmada hasta 24 horas antes.' });
        }
      }
    }

    const result = await executeQuery(
      'UPDATE citas SET estado = ? WHERE cod_cit = ?',
      [estado, citaId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.json({ message: 'Estado de la cita actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
});

module.exports = router
