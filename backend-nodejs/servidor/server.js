// =================================================================
// ==                      PET-UNIVERSE SERVER                    ==
// =================================================================
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// --- Configuración de la Base de Datos ---
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Ajusta tu contraseña aquí si tienes una
  database: "mascotas_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// --- Rutas de Autenticación ---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      const { password_hash, ...userWithoutPassword } = user;
      res.json({ success: true, message: "Inicio de sesión exitoso", user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// =================================================================
// ==                RUTAS DEL PANEL DE ADMINISTRADOR             ==
// =================================================================

app.get("/api/admin/stats", async (req, res) => {
  try {
    const [usersCount] = await pool.query("SELECT COUNT(*) AS count FROM usuarios");
    const [rolesCount] = await pool.query("SELECT COUNT(*) AS count FROM rol");
    const [servicesCount] = await pool.query("SELECT COUNT(*) AS count FROM servicios");
    res.json({
      users: usersCount[0].count,
      roles: rolesCount[0].count,
      services: servicesCount[0].count,
    });
  } catch (error) {
    console.error("Error en /api/admin/stats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas del servidor." });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const [results] = await pool.query("CALL sp_leer_usuarios()");
    res.json(results);
  } catch (error) {
    console.error("Error en GET /api/admin/users:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});

// --- RUTA PARA CREAR UN NUEVO USUARIO (CORREGIDA) ---
app.post("/api/admin/users", async (req, res) => {
  console.log('Recibida petición para crear usuario:', req.body);
  const connection = await pool.getConnection();
  try {
    const {
        nombre, apellido, email, tipo_documento, numeroid, genero, 
        fecha_nacimiento, telefono, ciudad, direccion, 
        id_rol, id_tipo, contrasena 
    } = req.body;

    // CORRECCIÓN CLAVE: La validación ahora comprueba si la contraseña NO existe.
    if (!nombre || !apellido || !email || !contrasena || !id_rol || !id_tipo) {
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
    }

    const [existingUser] = await connection.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "El correo electrónico ya está registrado." });
    }
    
    await connection.beginTransaction();
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // CORRECCIÓN FINAL: La columna de contraseña en la BD es 'password_hash'
    const query = `
      INSERT INTO usuarios (
        nombre, apellido, email, tipo_documento, numeroid, genero, fecha_nacimiento, 
        telefono, ciudad, direccion, password_hash, id_rol, id_tipo, fecha_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`;
    
    const values = [
        nombre, apellido, email, tipo_documento, numeroid, genero,
        fecha_nacimiento, telefono, ciudad, direccion,
        hashedPassword, id_rol, id_tipo
    ];
    
    const [result] = await connection.query(query, values);
    const userId = result.insertId;
    
    if (parseInt(id_tipo, 10) === 1) { // 1 es Invitado/Tutor
        await connection.query('INSERT INTO propietarios (id_usuario) VALUES (?)', [userId]);
    } else if (parseInt(id_tipo, 10) === 2 || parseInt(id_tipo, 10) === 3) { // 2 es Medico, 3 es Auxiliar
        await connection.query('INSERT INTO veterinario (id_usuario) VALUES (?)', [userId]);
    }

    await connection.commit();
    res.status(201).json({ message: 'Usuario creado exitosamente', id: userId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error en el servidor al crear el usuario." });
  } finally {
    if (connection) connection.release();
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("CALL sp_eliminar_usuario(?)", [id]);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario." });
    }
});

app.get("/api/admin/roles", async (req, res) => {
  try {
    const [results] = await pool.query("CALL sp_leer_roles()");
    res.json(results);
  } catch (error) {
    console.error("Error en GET /api/admin/roles:", error);
    res.status(500).json({ message: "Error al obtener roles." });
  }
});

// --- NUEVA RUTA: Gestión de Tipos de Persona ---
app.get("/api/admin/person-types", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT id_tipo, tipo FROM tipo_persona ORDER BY id_tipo");
    res.json(results);
  } catch (error) {
    console.error("Error en GET /api/admin/person-types:", error);
    res.status(500).json({ message: "Error al obtener los tipos de persona." });
  }
});

// =================================================================
// ==                      INICIO DEL SERVIDOR                    ==
// =================================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log("-----------------------------------------");
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    await pool.query("SELECT 1");
    console.log("✅ Conexión a la base de datos verificada.");
  } catch (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err.message);
  }
  console.log("-----------------------------------------");
});
