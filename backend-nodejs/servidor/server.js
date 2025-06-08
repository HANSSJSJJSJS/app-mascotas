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
// ==              RUTA DE VERIFICACIÓN DE ESTADO                 ==
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
    // AÑADIDO: Se comprueba también que el usuario esté activo para poder iniciar sesión
    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ? AND estado = 1", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas o usuario inactivo." });
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
        const { 
            tipo_documento, numeroId, genero, fechaNacimiento, nombre, 
            apellido, telefono, ciudad, direccion, email, password 
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        // AÑADIDO: Se inserta el estado por defecto como 1 (Activo)
        const sql = `
            INSERT INTO usuarios (
                tipo_documento, numeroid, genero, fecha_nacimiento, nombre, 
                apellido, telefono, ciudad, direccion, email, password_hash,
                id_rol, id_tipo, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 1, 1)
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
    res.status(500).json({ message: "Error al obtener estadísticas." });
  }
});

// MODIFICADO: Se seleccionan todos los campos de usuarios (u.*) para tenerlos disponibles en la edición
app.get("/api/admin/users", async (req, res) => {
  try {
    const sql = `
        SELECT 
            u.*,
            r.rol AS nombre_rol, 
            tp.tipo AS tipo_persona
        FROM usuarios u
        LEFT JOIN rol r ON u.id_rol = r.id_rol
        LEFT JOIN tipo_persona tp ON u.id_tipo = tp.id_tipo
        ORDER BY u.id_usuario DESC;
    `;
    const [users] = await pool.query(sql);
    res.json(users);
  } catch (error) {
    console.error("Error en GET /api/admin/users:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});


app.post("/api/admin/users", async (req, res) => {
  console.log('Recibida petición para crear usuario:', req.body);
  const connection = await pool.getConnection();
  try {
    const {
        nombre, apellido, email, tipo_documento, numeroid, genero, 
        fecha_nacimiento, telefono, ciudad, direccion, 
        id_rol, id_tipo, contrasena 
    } = req.body;

    if (!nombre || !apellido || !email || !contrasena || !id_rol || !id_tipo) {
        connection.release();
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios." });
    }
    
    await connection.beginTransaction();

    const [existingUser] = await connection.query("SELECT id_usuario FROM usuarios WHERE email = ?", [email]);
    if (existingUser.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(409).json({ success: false, message: "El correo electrónico ya está registrado." });
    }
    
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = `
      INSERT INTO usuarios (
        nombre, apellido, email, tipo_documento, numeroid, genero, fecha_nacimiento, 
        telefono, ciudad, direccion, password_hash, id_rol, id_tipo, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
    
    const values = [
        nombre, apellido, email, tipo_documento, numeroid, genero,
        fecha_nacimiento, telefono || null, ciudad, direccion,
        hashedPassword, id_rol, id_tipo
    ];
    
    const [result] = await connection.query(query, values);
    const userId = result.insertId;
    
    if (parseInt(id_tipo, 10) === 1) {
        await connection.query('INSERT IGNORE INTO propietarios (id_pro) VALUES (?)', [userId]);
    } else if (parseInt(id_tipo, 10) === 2 || parseInt(id_tipo, 10) === 3) {
        await connection.query('INSERT IGNORE INTO veterinarios (id_vet, especialidad, horario) VALUES (?, "General", "N/A")', [userId]);
    } else if (parseInt(id_tipo, 10) === 4) {
        await connection.query('INSERT IGNORE INTO administradores (id_admin, cargo, fecha_ingreso) VALUES (?, "Cargo por definir", CURDATE())', [userId]);
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


app.put("/api/admin/users/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nombre, apellido, email, tipo_documento, numeroid, genero, 
        fecha_nacimiento, telefono, ciudad, direccion, 
        id_rol, id_tipo, contrasena, estado 
    } = req.body;

    if (!nombre || !apellido || !email || !id_rol || !id_tipo) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    try {
        let hashedPassword = null;
        if (contrasena) {
            hashedPassword = await bcrypt.hash(contrasena, 10);
        }

        let sql = `
            UPDATE usuarios SET
                nombre = ?, apellido = ?, email = ?, tipo_documento = ?, numeroid = ?,
                genero = ?, fecha_nacimiento = ?, telefono = ?, ciudad = ?, direccion = ?,
                id_rol = ?, id_tipo = ?, estado = ?
                ${hashedPassword ? ', password_hash = ?' : ''}
            WHERE id_usuario = ?`;
        
        const values = [
            nombre, apellido, email, tipo_documento, numeroid, genero,
            fecha_nacimiento, telefono || null, ciudad, direccion,
            id_rol, id_tipo, estado,
        ];

        if (hashedPassword) {
            values.push(hashedPassword);
        }
        values.push(id);

        await pool.query(sql, values.filter(v => v !== undefined));
        
        res.json({ success: true, message: 'Usuario actualizado exitosamente' });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo electrónico o el documento ya pertenecen a otro usuario.' });
        }
        res.status(500).json({ message: "Error en el servidor al actualizar el usuario." });
    }
});


// ===== CORRECCIÓN DE LA RUTA DELETE =====
app.delete("/api/admin/users/:id", async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      const [users] = await connection.query("SELECT id_tipo FROM usuarios WHERE id_usuario = ?", [id]);
      if (users.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      const { id_tipo } = users[0];
  
      // Se usan los nombres de columna correctos para las tablas hijas
      if (id_tipo === 1) {
        await connection.query("DELETE FROM propietarios WHERE id_pro = ?", [id]);
      } else if (id_tipo === 2 || id_tipo === 3) {
        await connection.query("DELETE FROM veterinarios WHERE id_vet = ?", [id]);
      } else if (id_tipo === 4) {
        await connection.query("DELETE FROM administradores WHERE id_admin = ?", [id]);
      }
      
      await connection.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
  
      await connection.commit();
      res.json({ success: true, message: "Usuario eliminado exitosamente" });
  
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error al eliminar usuario:", error);
      res.status(500).json({ success: false, message: "Error al eliminar el usuario." });
    } finally {
      if (connection) connection.release();
    }
});


app.get("/api/admin/roles", async (req, res) => {
  try {
    const [roles] = await pool.query("SELECT id_rol, rol FROM rol ORDER BY id_rol");
    const formattedRoles = roles.map(r => ({ id_rol: r.id_rol, nombre_rol: r.rol }));
    res.json(formattedRoles);
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
// ==              RUTAS DE GESTIÓN DE ROLES (FUNCIONAL)         ==
// =================================================================

// --- OBTENER TODOS LOS ROLES CON DATOS ADICIONALES (CORREGIDO) ---
app.get("/api/admin/gestion-roles", async (req, res) => {
  try {
    // 1. Obtener todos los usuarios y roles de la base de datos
    const [users] = await pool.query("SELECT id_rol FROM usuarios");
    
    // CORRECCIÓN: Se eliminó la columna "fecha_creacion" de la consulta SQL
    const [rolesFromDB] = await pool.query("SELECT id_rol, rol FROM rol ORDER BY id_rol ASC");

    // 2. Contar cuántos usuarios tiene cada rol
    const userCounts = users.reduce((acc, user) => {
      acc[user.id_rol] = (acc[user.id_rol] || 0) + 1;
      return acc;
    }, {});

    // 3. Datos estáticos para mantener tu diseño (descripciones y permisos)
    const rolesInfo = {
      'Administrador': {
        descripcion: "Acceso completo al sistema, gestión de usuarios, roles y configuración general.",
        permisos: ["Gestionar usuarios", "Gestionar roles", "Ver reportes", "Configurar sistema"],
        tipo: "administrador",
      },
      'Veterinario': {
        descripcion: "Acceso a gestión de citas, historiales clínicos y consultas médicas.",
        permisos: ["Gestionar citas", "Ver historiales", "Crear consultas", "Gestionar pacientes"],
        tipo: "veterinario",
      },
      'Propietario': {
        descripcion: "Acceso limitado para agendar citas y ver información de sus mascotas.",
        permisos: ["Agendar citas", "Ver mascotas", "Ver historial propio"],
        tipo: "propietario",
      }
    };

    // 4. Combinar los datos de la DB con los datos estáticos y el conteo
    const rolesCompletos = rolesFromDB.map(rol => {
      const info = rolesInfo[rol.rol] || {
          descripcion: 'Rol personalizado sin descripción.',
          permisos: ['Permisos básicos'],
          tipo: 'personalizado'
      };
      return {
        id: rol.id_rol,
        nombre: rol.rol,
        estado: "Activo",
        usuariosCount: userCounts[rol.id_rol] || 0,
        // CORRECCIÓN: Se usa la fecha actual como dato de relleno ya que no existe en la DB
        fechaCreacion: new Date().toISOString().split('T')[0], 
        ...info,
      };
    });

    res.json(rolesCompletos);
  } catch (error) {
    console.error("Error en GET /api/admin/gestion-roles:", error);
    res.status(500).json({ message: "Error al obtener los roles." });
  }
});


// --- CREAR UN NUEVO ROL ---
app.post("/api/admin/gestion-roles", async (req, res) => {
  try {
    const { rol } = req.body;
    if (!rol || rol.trim() === '') {
      return res.status(400).json({ message: "El nombre del rol es obligatorio." });
    }

    const [existing] = await pool.query("SELECT id_rol FROM rol WHERE rol = ?", [rol]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Ya existe un rol con ese nombre." });
    }

    const [result] = await pool.query("INSERT INTO rol (rol) VALUES (?)", [rol]);
    res.status(201).json({ success: true, message: 'Rol creado exitosamente', insertedId: result.insertId });
  } catch (error) {
    console.error("Error en POST /api/admin/gestion-roles:", error);
    res.status(500).json({ message: "Error en el servidor al crear el rol." });
  }
});

// --- ACTUALIZAR UN ROL ---
app.put("/api/admin/gestion-roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!rol || rol.trim() === '') {
      return res.status(400).json({ message: "El nombre del rol es obligatorio." });
    }

    const [existing] = await pool.query("SELECT id_rol FROM rol WHERE rol = ? AND id_rol != ?", [rol, id]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Ya existe otro rol con ese nombre." });
    }

    const [result] = await pool.query("UPDATE rol SET rol = ? WHERE id_rol = ?", [rol, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rol no encontrado." });
    }
    res.json({ success: true, message: 'Rol actualizado exitosamente' });
  } catch (error) {
    console.error("Error en PUT /api/admin/gestion-roles/:id:", error);
    res.status(500).json({ message: "Error en el servidor al actualizar el rol." });
  }
});

// --- ELIMINAR UN ROL ---
app.delete("/api/admin/gestion-roles/:id", async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [users] = await connection.query("SELECT COUNT(*) AS count FROM usuarios WHERE id_rol = ?", [id]);
    if (users[0].count > 0) {
      await connection.rollback();
      return res.status(409).json({ message: `No se puede eliminar el rol porque está asignado a ${users[0].count} usuario(s).` });
    }
    
    const [result] = await connection.query("DELETE FROM rol WHERE id_rol = ?", [id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Rol no encontrado." });
    }

    await connection.commit();
    res.json({ success: true, message: "Rol eliminado exitosamente" });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error al eliminar rol:", error);
    res.status(500).json({ success: false, message: "Error al eliminar el rol." });
  } finally {
    if (connection) connection.release();
  }
});


// =================================================================
// ==              RUTAS DE GESTIÓN DE SERVICIOS                 ==
// =================================================================

// --- OBTENER TODOS LOS SERVICIOS ---
app.get("/api/admin/servicios", async (req, res) => {
  try {
    // Agregamos una columna "estado" y "categoria" para que coincida con tu frontend
    const [servicios] = await pool.query("SELECT *, 'Activo' as estado, 'Consulta' as categoria FROM servicios ORDER BY cod_ser ASC");
    res.json(servicios);
  } catch (error) {
    console.error("Error en GET /api/admin/servicios:", error);
    res.status(500).json({ message: "Error al obtener los servicios." });
  }
});

// --- CREAR UN NUEVO SERVICIO ---
app.post("/api/admin/servicios", async (req, res) => {
  try {
    const { nom_ser, descrip_ser, precio } = req.body;
    if (!nom_ser || !precio) {
      return res.status(400).json({ message: "El nombre y el precio del servicio son obligatorios." });
    }

    const sql = "INSERT INTO servicios (nom_ser, descrip_ser, precio) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [nom_ser, descrip_ser || null, precio]);

    res.status(201).json({ success: true, message: 'Servicio creado exitosamente', insertedId: result.insertId });
  } catch (error) {
    console.error("Error en POST /api/admin/servicios:", error);
    res.status(500).json({ message: "Error en el servidor al crear el servicio." });
  }
});

// --- ACTUALIZAR UN SERVICIO ---
app.put("/api/admin/servicios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom_ser, descrip_ser, precio } = req.body;

    if (!nom_ser || !precio) {
        return res.status(400).json({ message: "El nombre y el precio del servicio son obligatorios." });
    }

    const sql = "UPDATE servicios SET nom_ser = ?, descrip_ser = ?, precio = ? WHERE cod_ser = ?";
    const [result] = await pool.query(sql, [nom_ser, descrip_ser || null, precio, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Servicio no encontrado." });
    }
    res.json({ success: true, message: 'Servicio actualizado exitosamente' });
  } catch (error) {
    console.error(`Error en PUT /api/admin/servicios/${req.params.id}:`, error);
    res.status(500).json({ message: "Error en el servidor al actualizar el servicio." });
  }
});

// --- ELIMINAR UN SERVICIO ---
app.delete("/api/admin/servicios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [citas] = await pool.query("SELECT COUNT(*) AS count FROM citas WHERE cod_ser = ?", [id]);
    if (citas[0].count > 0) {
      return res.status(409).json({ message: `No se puede eliminar el servicio porque está asignado a ${citas[0].count} cita(s).` });
    }

    const [result] = await pool.query("DELETE FROM servicios WHERE cod_ser = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Servicio no encontrado." });
    }

    res.json({ success: true, message: "Servicio eliminado exitosamente" });
  } catch (error) {
    console.error(`Error en DELETE /api/admin/servicios/${id}:`, error);
    res.status(500).json({ success: false, message: "Error al eliminar el servicio." });
  }
});

// =================================================================
// ==                        INICIO DEL SERVIDOR                    ==
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