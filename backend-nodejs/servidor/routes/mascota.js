// ...existing code...
const express = require("express")
const router = express.Router()
const { executeQuery } = require("../DB/conexion")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configuración de Multer para guardar imágenes en /uploads/mascotas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads", "mascotas");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "mascota-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});



// GET /api/mascotas - Obtener todas las mascotas (admin/vet)
router.get("/", async (req, res) => {
  try {
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
        foto,
        id_pro,
        notas,
        ultima_visita,
        proxima_cita,
        activo,
        p.nombre as nombre_propietario,
        p.apellido as apellido_propietario,
        p.telefono,
        p.email,
        p.direccion
      FROM mascotas m
      LEFT JOIN propietarios p ON m.id_pro = p.id_pro
      ORDER BY nom_mas
    `
    );
    res.json(mascotas);
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({ error: "Error al obtener las mascotas" });
  }
});

// GET /api/mascotas/:propietarioId - Obtener mascotas de un propietario
router.get("/:propietarioId", async (req, res) => {
  try {
    const { propietarioId } = req.params;
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
});

// PUT /api/mascotas/:id - Actualizar foto de la mascota
// Asegúrate de que esta ruta coincide con la del frontend
router.put("/:id/foto", upload.single("foto"), async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("Archivo recibido:", req.file); // Debug
    console.log("Cuerpo de la petición:", req.body); // Debug
    
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ninguna imagen" });
    }

    // Verifica si el archivo se guardó en la ruta correcta (igual que Multer)
    const filePath = path.join(__dirname, "..", "uploads", "mascotas", req.file.filename); // <--- CORREGIDO
    const fileExists = fs.existsSync(filePath);
    
    console.log("Archivo guardado en:", filePath);
    console.log("¿El archivo existe?", fileExists);
    
    if (!fileExists) {
      return res.status(500).json({ error: "Error al guardar el archivo" });
    }

    // Actualiza la base de datos
    const result = await executeQuery(
      "UPDATE mascotas SET foto = ? WHERE cod_mas = ?",
      [req.file.filename, id]
    );

    console.log("Resultado de la actualización:", result); // Debug
    
    const baseUrl = req.protocol + '://' + req.get('host');
    // Devuelve el nombre del archivo y la URL para que el frontend lo use (formato consistente)
    res.json({ 
      success: true, 
      foto: req.file.filename,
      fotoUrl: `/uploads/mascotas/${req.file.filename}`,
      fotoUrlAbs: `${baseUrl}/uploads/mascotas/${req.file.filename}`
    });
    
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ 
      error: "Error al actualizar la foto",
      details: error.message 
    });
  }
});

module.exports = router
