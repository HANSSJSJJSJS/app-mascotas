const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool } = require("../DB/conexion");

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Siempre usa la raíz del proyecto, sin importar desde dónde ejecutes
    const projectRoot = path.resolve(__dirname, '../../..');
    const uploadPath = path.join(projectRoot, 'backend-nodejs', 'uploads', 'propietarios');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const propietarioId = req.params.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `propietario-${propietarioId}-${timestamp}${ext}`);
  },
});
const upload = multer({ storage });

// Ruta para subir imagen de propietario
router.post("/:id/imagen", upload.single("imagen"), async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido:", id);
    console.log("Archivo recibido:", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se subió ninguna imagen" });
    }

    // Verifica si el usuario existe antes de actualizar
    const [users] = await pool.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Verifica si el archivo se guardó en la ruta correcta (igual que Multer)
    const filePath = path.resolve(__dirname, "../../uploads/propietarios", req.file.filename);
    const fileExists = fs.existsSync(filePath);
    console.log("Archivo guardado en:", filePath);
    console.log("¿El archivo existe?", fileExists);
    if (!fileExists) {
      return res.status(500).json({ success: false, message: "Error al guardar el archivo" });
    }

    // Guarda el nombre del archivo en la base de datos
    const [result] = await pool.query(
      "UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?",
      [req.file.filename, id]
    );
    console.log("Resultado de la actualización:", result);

    res.json({
      success: true,
      message: "Imagen subida correctamente",
      foto_perfil: `/uploads/propietarios/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ success: false, message: "Error al subir la imagen", error: error.message });
  }
});

// Actualizar datos y foto del propietario
router.put("/:id", upload.single("imagen"), async (req, res) => {
  try {
    const { id } = req.params;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      telefono = "",
      email = "",
      direccion = "",
      ciudad = "",
      barrio = "",
      nombre = "",
      apellido = "",
      tipo_documento = "",
      numeroid = "",
      genero = "",
      fecha_nacimiento = "",
    } = req.body;

    // Construye el query dinámicamente
    let query = "UPDATE usuarios SET telefono=?, email=?, direccion=?, ciudad=?, barrio=?";
    let params = [telefono, email, direccion, ciudad, barrio];

    if (req.file) {
      query += ", foto_perfil=?";
      params.push(req.file.filename);
    }
    query += " WHERE id_usuario=?";
    params.push(id);

    await pool.query(query, params);

    res.json({
      success: true,
      message: "Datos actualizados correctamente",
      foto_perfil: req.file ? `/uploads/propietarios/${req.file.filename}` : undefined,
    });
  } catch (error) {
    console.error("Error al actualizar propietario:", error);
    res.status(500).json({ success: false, message: "Error al actualizar propietario", error: error.message, sql: error.sqlMessage });
  }
});
// Endpoint para obtener citas del propietario
router.get("/:id/citas", async (req, res) => {
  try {
    const { id } = req.params

    const [citas] = await pool.query(
      `
      SELECT 
        c.*,
        m.nom_mas as nombre_mascota,
        s.nom_ser as nombre_servicio,
        CONCAT(u.nombre, ' ', u.apellido) as nombre_veterinario
      FROM citas c
      LEFT JOIN mascotas m ON c.cod_cit = m.cod_mas
      LEFT JOIN servicios s ON c.cod_cit = s.cod_ser
      LEFT JOIN usuarios u ON c.id_vet = u.id_usuario
      WHERE c.id_pro = ?
      ORDER BY c.fech_cit DESC, c.hora DESC
    `,
      [id],
    )

    res.json(citas)
  } catch (error) {
    console.error("Error al obtener citas:", error)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  }
})

// Endpoint para actualizar datos del usuario
router.put("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { tipo_documento, numeroid, genero, fecha_nacimiento, nombre, apellido, telefono, ciudad, barrio, direccion, email } =
      req.body

    const [result] = await pool.query(
      `
      UPDATE usuarios SET
        tipo_documento = ?,
        numeroid = ?,
        genero = ?,
        fecha_nacimiento = ?,
        nombre = ?,
        apellido = ?,
        telefono = ?,
        ciudad = ?,
        barrio = ?,
        direccion = ?,
        email = ?
      WHERE id_usuario = ?
    `,
      [tipo_documento, numeroid, genero, fecha_nacimiento, nombre, apellido, telefono, ciudad,barrio, direccion, email, id],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" })
    }

    res.json({ success: true, message: "Datos actualizados correctamente" })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  }
})


module.exports = router;