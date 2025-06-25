const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { pool } = require("../DB/conexion");

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/propietarios");
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

module.exports = router;