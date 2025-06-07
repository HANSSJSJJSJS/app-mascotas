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
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678", // Tu contraseña
  database: "mascotas_db",
  port: 3309,          // Tu puerto
});

// =================================================================
// ==               RUTA DE VERIFICACIÓN DE ESTADO                ==
// =================================================================
app.get("/health", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ success: true, database: true, message: "Servidor y base de datos están activos." });
  } catch (error) {
    console.error("Error en health check:", error);
    res.status(500).json({ success: false, database: false, message: "No se pudo conectar a la base de datos." });
  }
});

// =================================================================
// ==            RUTAS PÚBLICAS (Adaptadas y Funcionales)         ==
// =================================================================

// --- RUTA DE LOGIN ---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Intento de login con email: ${email}`);

    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas." });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordMatch) {
      const { password_hash, ...userWithoutPassword } = user;
      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: userWithoutPassword,
      });
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas." });
    }
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// --- RUTA DE REGISTRO ---
app.post('/registro', async (req, res) => {
    try {
        // CORRECCIÓN FINAL: Se usan los nombres en camelCase que envía el frontend
        const { 
            tipo_documento, numeroId, genero, fechaNacimiento, nombre, 
            apellido, telefono, ciudad, direccion, email, password 
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO usuarios (
                tipo_documento, numeroid, genero, fecha_nacimiento, nombre, 
                apellido, telefono, ciudad, direccion, email, password_hash,
                id_rol, id_tipo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 1)
        `;

        const values = [
            tipo_documento, numeroId, genero, fechaNacimiento, nombre,
            apellido, telefono, ciudad, direccion, email, hashedPassword
        ];

        await pool.query(sql, values);

        res.json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error("Error en /registro:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo electrónico o el documento ya están registrados.' });
        }
        if (err.code === 'ER_BAD_NULL_ERROR') {
            return res.status(400).json({ message: `Hubo un problema con los datos enviados: ${err.sqlMessage}` });
        }
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// =================================================================
// ==              RUTAS DEL PANEL DE ADMINISTRADOR               ==
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
    res.status(500).json({ message: "Error al obtener estadísticas." });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const [results] = await pool.query("CALL sp_leer_usuarios()");
    res.json(results[0]);
  } catch (error) {
    console.error("Error en GET /api/admin/users:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});

app.post("/api/admin/users", async (req, res) => {
  console.log('Recibida petición para crear usuario:', req.body);
  const connection = await pool.getConnection();
  try {
    // Para esta ruta, los nombres sí vienen en snake_case desde el formulario del admin
    const {
        nombre, apellido, email, tipo_documento, numeroid, genero, 
        fecha_nacimiento, telefono, ciudad, direccion, 
        id_rol, id_tipo, contrasena 
    } = req.body;

    if (!nombre || !apellido || !email || !contrasena || !id_rol || !id_tipo) {
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
    }

    const [existingUser] = await connection.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "El correo electrónico ya está registrado." });
    }
    
    await connection.beginTransaction();
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO usuarios (
        nombre, apellido, email, tipo_documento, numeroid, genero, fecha_nacimiento, 
        telefono, ciudad, direccion, password_hash, id_rol, id_tipo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        nombre, apellido, email, tipo_documento, numeroid, genero,
        fecha_nacimiento, telefono || null, ciudad, direccion,
        hashedPassword, id_rol, id_tipo
    ];
    
    const [result] = await connection.query(query, values);
    const userId = result.insertId;
    
    if (parseInt(id_tipo, 10) === 1) {
        await connection.query('INSERT INTO propietarios (id_pro) VALUES (?)', [userId]);
    } else if (parseInt(id_tipo, 10) === 2 || parseInt(id_tipo, 10) === 3) {
        await connection.query('INSERT INTO veterinarios (id_vet, especialidad, horario) VALUES (?, "General", "N/A")', [userId]);
    } else if (parseInt(id_tipo, 10) === 4) {
        await connection.query('INSERT INTO administradores (id_admin, cargo, fecha_ingreso) VALUES (?, "Cargo por definir", CURDATE())', [userId]);
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
    res.json(results[0]);
  } catch (error) {
    console.error("Error en GET /api/admin/roles:", error);
    res.status(500).json({ message: "Error al obtener roles." });
  }
});

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log("-----------------------------------------");
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a la base de datos verificada.");
    connection.release();
  } catch (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err.message);
  }
  console.log("-----------------------------------------");
});