const express = require("express");
const router = express.Router();
const { executeQuery } = require("../DB/conexion");

// Crear un nuevo historial clínico
router.post("/", async (req, res) => {
  try {
    const { fecha, motivo, tratamiento, cod_mas, id_cita } = req.body;
    if (!fecha || !motivo || !tratamiento || !cod_mas) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Guardar historial
    const sql = `
      INSERT INTO historiales_medicos (fech_his, descrip_his, tratamiento, cod_mas)
      VALUES (?, ?, ?, ?)
    `;
    await executeQuery(sql, [fecha, motivo, tratamiento, cod_mas]);

    // Cambiar estado de la cita si se envió id_cita
    if (id_cita) {
      const sqlCita = `UPDATE citas SET estado = 'REALIZADA' WHERE id = ?`;
      await executeQuery(sqlCita, [id_cita]);
    }

    res.status(201).json({ message: "Historial guardado y cita actualizada" });
  } catch (error) {
    console.error("Error al guardar historial:", error);
    res.status(500).json({ error: "Error interno al guardar el historial" });
  }
});

// Obtener todos los historiales clínicos
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT 
        h.cod_his,
        h.cod_mas,
        h.fech_his,
        h.descrip_his,
        h.tratamiento,
        m.nom_mas,
        m.especie,
        m.raza,
        m.edad,
        m.peso,
        CONCAT(u.nombre, ' ', u.apellido) AS propietario,
        u.telefono
      FROM historiales_medicos h
      JOIN mascotas m ON h.cod_mas = m.cod_mas
      JOIN propietarios p ON m.id_pro = p.id_pro
      JOIN usuarios u ON p.id_pro = u.id_usuario
      ORDER BY h.fech_his DESC
    `;
    const historiales = await executeQuery(sql);
    res.json(historiales);
  } catch (error) {
    console.error("Error al obtener historiales:", error);
    res.status(500).json({ error: "Error interno al obtener historiales" });
  }
});

module.exports = router;