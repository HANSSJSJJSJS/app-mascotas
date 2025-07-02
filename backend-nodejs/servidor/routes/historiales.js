const express = require('express');
const router = express.Router();
const { pool } = require('../DB/conexion'); // ✅ Corrección aquí

// Obtener todos los historiales médicos
router.get('/historiales', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        h.cod_his, h.fech_his, h.descrip_his, h.tratamiento, h.cod_mas,
        m.nom_mas, m.especie, m.raza, m.edad, m.peso,
        u.nombre AS propietario, u.telefono
      FROM historiales_medicos h
      JOIN mascotas m ON h.cod_mas = m.cod_mas
      JOIN propietarios p ON m.id_pro = p.id_pro
      JOIN usuarios u ON p.id_pro = u.id_usuario
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener historiales:", error);
    res.status(500).json({ error: 'Error al obtener historiales' });
  }
});

// Insertar nuevo historial
router.post('/historiales', async (req, res) => {
  const { fech_his, descrip_his, tratamiento, cod_mas } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO historiales_medicos (fech_his, descrip_his, tratamiento, cod_mas) 
       VALUES (?, ?, ?, ?)`,
      [fech_his, descrip_his, tratamiento, cod_mas]
    );
    res.status(201).json({ message: 'Historial creado', id: result.insertId });
  } catch (error) {
    console.error("❌ Error al crear historial:", error);
    res.status(500).json({ error: 'Error al insertar historial' });
  }
});

module.exports = router;
