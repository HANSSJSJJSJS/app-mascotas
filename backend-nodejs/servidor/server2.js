const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const bcrypt = require("bcrypt")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const serviciosRoutes = require("./routes/servicios")
const mascotaRoutes = require("./routes/mascota")
const citasRoutes = require("./routes/citas")
const VeterinarioRoutes = require("./routes/veterinarios")
const historialRoutes = require('./routes/historiales');

const propietarioRoutes = require("./routes/propietario");

const app = express()
app.use(express.json())
app.use(cors())
app.use("/api/servicios", serviciosRoutes)
app.use("/api/mascotas", mascotaRoutes)
app.use("/api/citas", citasRoutes)
app.use("/api/veterinarios", VeterinarioRoutes)
app.use('/api', historialRoutes)
app.use("/api/propietario", propietarioRoutes);
// Sirve archivos estáticos desde backend-nodejs/uploads (no desde servidor/uploads)
// CORRECCIÓN: Usar path.join para mayor robustez y log explícito
const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));


// Configuración de la conexión a MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "moybe_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

// Configuración de Multer para la carga de imágenes en carpeta /uploads/mascotas
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads", "mascotas");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "mascota-" + uniqueSuffix + path.extname(file.originalname))
  },
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false)
  }
}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})


// Endpoint para obtener datos del usuario (agregar a tu servidor)
app.get("/api/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params

    const [users] = await pool.query(
      `
      SELECT 
        u.*,
        r.rol,
        tp.tipo as tipo_persona
      FROM usuarios u 
      LEFT JOIN rol r ON u.id_rol = r.id_rol 
      LEFT JOIN tipo_persona tp ON u.id_tipo = tp.id_tipo 
      WHERE u.id_usuario = ?
    `,
      [id],
    )

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" })
    }

    const user = users[0]

    // Verificar si es propietario
    if (user.id_rol === 3) {
      const [propietario] = await pool.query("SELECT * FROM propietarios WHERE id_pro = ?", [id])

      if (propietario.length > 0) {
        user.esPropietario = true
      }
    }

    res.json(user)
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  }
})



// Endpoint para obtener citas del propietario
app.get("/api/propietario/:id/citas", async (req, res) => {
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
app.put("/api/usuario/:id", async (req, res) => {
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

// Endpoint para logout (opcional)
app.post("/logout", async (req, res) => {
  try {
    // Aquí puedes agregar lógica adicional como invalidar tokens si los usas
    res.json({ success: true, message: "Sesión cerrada correctamente" })
  } catch (error) {
    console.error("Error en logout:", error)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  }
})  


// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
  let connection
  try {
    connection = await pool.getConnection()
    console.log("✅ Conexión a la base de datos establecida correctamente")

    // Verificar si las tablas existen
    const [tables] = await connection.query("SHOW TABLES")
    console.log("Tablas en la base de datos:", tables.map((t) => Object.values(t)[0]).join(", "))

    // Verificar si hay datos en las tablas rol y tipo_persona
    const [roles] = await connection.query("SELECT * FROM rol")
    console.log("Roles disponibles:", roles.length)

    const [tipos] = await connection.query("SELECT * FROM tipo_persona")
    console.log("Tipos de persona disponibles:", tipos.length)

    return true
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error)
    return false
  } finally {
    if (connection) connection.release()
  }
}

// Ruta de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Intento de login con email:", email);

    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    console.log("Resultados de la consulta:", users);

    if (users.length === 0) {
      console.log("Email no encontrado");
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    const user = users[0];
    console.log("Usuario encontrado. Hash almacenado:", user.password_hash);
    
    // Comparación de contraseña con logging
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    console.log("Resultado de bcrypt.compare:", passwordMatch);

    if (passwordMatch) {
      console.log("Contraseña válida");
      res.json({ success: true, message: "Inicio de sesión exitoso", user });
    } else {
      console.log("Contraseña inválida");
      res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error completo en el login:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Ruta de registro de propietarios
app.post("/registro", async (req, res) => {
  let connection
  try {
    console.log("📝 Iniciando registro de propietario")
    // No logueamos los datos recibidos para evitar exponer información sensible

    connection = await pool.getConnection()
    console.log("✅ Conexión obtenida")

    const {
      tipoDocumento,
      numeroId,
      genero,
      fechaNacimiento,
      telefono,
      nombre,
      apellido,
      ciudad,
      barrio,
      direccion,
      email,
      password,
    } = req.body

    // Verificar si el email ya existe
    console.log("Verificando si el email ya existe")
    const [emailResults] = await connection.query("SELECT * FROM usuarios WHERE email = ?", [email])
    if (emailResults.length > 0) {
      console.log("❌ Email ya registrado")
      return res.status(400).json({ success: false, message: "El email ya está registrado" })
    }
    console.log("✅ Email disponible")

    // Verificar si el documento ya existe
    console.log("Verificando si el documento ya existe")
    const [docResults] = await connection.query("SELECT * FROM usuarios WHERE numeroid = ?", [numeroId])
    if (docResults.length > 0) {
      console.log("❌ Número de documento ya registrado")
      return res.status(400).json({ success: false, message: "El número de documento ya está registrado" })
    }
    console.log("✅ Documento disponible")

    // Encriptar la contraseña
    console.log("Encriptando contraseña")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("✅ Contraseña encriptada")

    // Iniciar transacción
    console.log("Iniciando transacción")
    await connection.beginTransaction()
    console.log("✅ Transacción iniciada")

    try {
      // Insertar en la tabla usuarios
      console.log("Insertando en la tabla usuarios")
      const insertUserQuery = `
        INSERT INTO usuarios (
          tipo_documento, 
          numeroid, 
          genero, 
          fecha_nacimiento, 
          nombre, 
          apellido, 
          telefono, 
          ciudad, 
          barrio,
          direccion, 
          email, 
          password_hash,
          id_tipo,
          id_rol
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const userValues = [
        tipoDocumento,
        numeroId,
        genero,
        fechaNacimiento,
        nombre,
        apellido,
        telefono,
        ciudad,
        barrio,
        direccion,
        email,
        hashedPassword,
        1, // id_tipo = 1 (propietario)
        3  // id_rol = 3 (Propietario)
      ]

      // No logueamos los valores para evitar exponer información sensible
      console.log("Ejecutando query de inserción de usuario")

      const [userResult] = await connection.query(insertUserQuery, userValues)

      console.log("✅ Usuario insertado con ID:", userResult.insertId)

      const userId = userResult.insertId

      // Insertar en la tabla propietarios
      console.log("Insertando en la tabla propietarios con id_usuario:", userId)
      const insertPropietarioQuery = "INSERT INTO propietarios (id_pro) VALUES (?)"
      await connection.query(insertPropietarioQuery, [userId])
      console.log("✅ Propietario insertado")

      // Confirmar transacción
      console.log("Confirmando transacción")
      await connection.commit()
      console.log("✅ Transacción confirmada")

      // Verificar que el usuario se haya insertado correctamente
      console.log("Verificando que el usuario se haya insertado correctamente")
      const [userCheck] = await connection.query("SELECT id_usuario FROM usuarios WHERE id_usuario = ?", [userId])
      console.log(
        "Resultado de la verificación:",
        userCheck.length > 0 ? "Usuario encontrado" : "Usuario no encontrado",
      )

      if (userCheck.length === 0) {
        console.log("❌ El usuario no se insertó correctamente a pesar de que la transacción fue exitosa")
        return res.status(500).json({
          success: false,
          message: "Error en el servidor: El usuario no se insertó correctamente",
        })
      }

      console.log("✅ Registro completado exitosamente")
      res.json({
        success: true,
        message: "Propietario registrado exitosamente",
        user: { id: userId, email, rol: "Propietario" },
      })
    } catch (error) {
      // Revertir transacción en caso de error
      console.log("❌ Error durante la transacción:", error.message)
      await connection.rollback()
      console.log("✅ Transacción revertida")
      throw error
    }
  } catch (error) {
    console.error("❌ Error en el registro:", error.message)

    // Verificar si es un error de restricción de clave foránea
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(500).json({
        success: false,
        message: "Error: No se pudo crear el registro porque falta una referencia en otra tabla",
        error: error.message,
      })
    }

    // Verificar si es un error de restricción de verificación (CHECK)
    if (error.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
      return res.status(500).json({
        success: false,
        message: "Error: Uno de los valores no cumple con las restricciones de la base de datos",
        error: error.message,
      })
    }

    res.status(500).json({
      success: false,
      message: "Error en el servidor al registrar el propietario",
      error: error.message,
    })
  } finally {
    if (connection) {
      connection.release()
      console.log("✅ Conexión liberada")
    }
  }
})


// =================================================================
// ==           INICIO DE RUTAS DEL PANEL DE ADMINISTRADOR        ==
// =================================================================

// --- Endpoint para obtener estadísticas del dashboard de administrador ---
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


// --- Endpoint para obtener todos los usuarios (gestión de usuarios) ---
app.get("/api/admin/users", async (req, res) => {
  try {
    const [users] = await pool.query("CALL sp_get_all_users()");
    res.json(users[0]);
  } catch (error) {
    console.error("Error en GET /api/admin/users:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});

// --- Endpoint para crear un nuevo usuario (gestión de usuarios) ---
app.post("/api/admin/users", async (req, res) => {
  try {
    const {
      nombre, apellido, email, tipo_documento, numeroid, genero,
      fecha_nacimiento, telefono, ciudad, barrio, direccion,
      id_rol, id_tipo, contrasena,
      modifying_user_id // <-- DATO NUEVO DEL FRONTEND
    } = req.body;

    if (!nombre || !apellido || !email || !contrasena || !id_rol || !id_tipo) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se ha identificado al usuario que realiza la operación." });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const [result] = await pool.query("CALL sp_create_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      nombre, apellido, email, tipo_documento, numeroid, genero,
      fecha_nacimiento, telefono, ciudad, barrio, direccion,
      id_rol, id_tipo, hashedPassword,
      modifying_user_id // <-- Se pasa el nuevo parámetro
    ]);

    const newUserId = result[0][0].id_usuario;
    res.status(201).json({ message: 'Usuario creado exitosamente', id: newUserId });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    const errorMessage = error.sqlState === '45000' ? error.sqlMessage : "Error en el servidor al crear el usuario.";
    const statusCode = error.sqlState === '45000' ? 409 : 500;
    res.status(statusCode).json({ message: errorMessage });
  }
});

// --- Endpoint para actualizar un usuario existente (gestión de usuarios) ---
app.put("/api/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre, apellido, email, tipo_documento, numeroid, genero,
      fecha_nacimiento, telefono, ciudad, direccion, barrio,
      id_rol, id_tipo, contrasena, estado,
      modifying_user_id // <-- DATO NUEVO DEL FRONTEND
    } = req.body;

    if (!nombre || !apellido || !email || !id_rol || !id_tipo) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se ha identificado al usuario que realiza la operación." });
    }

    let hashedPassword = null;
    if (contrasena) {
      hashedPassword = await bcrypt.hash(contrasena, 10);
    }

    await pool.query("CALL sp_update_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      id, nombre, apellido, email, tipo_documento, numeroid, genero,
      fecha_nacimiento, telefono, ciudad, barrio, direccion,
      id_rol, id_tipo, estado, hashedPassword,
      modifying_user_id // <-- Se pasa el nuevo parámetro
    ]);

    res.json({ success: true, message: 'Usuario actualizado exitosamente' });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El correo electrónico o el documento ya pertenecen a otro usuario.' });
    }
    res.status(500).json({ message: "Error en el servidor al actualizar el usuario." });
  }
});

// --- Endpoint para eliminar un usuario (gestión de usuarios) ---
app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { modifying_user_id } = req.body; // <-- DATO NUEVO DEL FRONTEND

    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se ha identificado al usuario que realiza la operación." });
    }

    await pool.query("CALL sp_delete_user(?, ?)", [
        id, 
        modifying_user_id // <-- Se pasa el nuevo parámetro
    ]);
    res.json({ success: true, message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ success: false, message: "Error al eliminar el usuario." });
  }
});

// --- Endpoint para obtener el historial de auditoría de un usuario ---
app.get("/api/admin/users/audit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [logs] = await pool.query("CALL sp_get_user_audit_log(?)", [id]);
    res.json(logs[0]);
  } catch (error) {
    console.error(`Error en GET /api/admin/users/audit/${id}:`, error);
    res.status(500).json({ message: "Error al obtener el historial del usuario." });
  }
});

// --- Endpoint para obtener la lista de roles (para formularios) ---
app.get("/api/admin/roles", async (req, res) => {
    try {
        const [roles] = await pool.query("CALL sp_get_roles_for_dropdown()");
        res.json(roles[0]);
    } catch (error) {
        console.error("Error en GET /api/admin/roles:", error);
        res.status(500).json({ message: "Error al obtener roles." });
    }
});

// --- Endpoint para obtener los tipos de persona (para formularios) ---
app.get("/api/admin/person-types", async (req, res) => {
    try {
        const [results] = await pool.query("CALL sp_get_person_types()");
        res.json(results[0]);
    } catch (error) {
        console.error("Error en GET /api/admin/person-types:", error);
        res.status(500).json({ message: "Error al obtener los tipos de persona." });
    }
});

// --- Endpoint para obtener todos los roles (gestión de roles) ---
app.get("/api/admin/gestion-roles", async (req, res) => {
    try {
        const [rolesFromDB] = await pool.query("CALL sp_get_roles_with_user_count()");

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

        const rolesCompletos = rolesFromDB[0].map(rol => {
            const info = rolesInfo[rol.rol] || {
                descripcion: 'Rol personalizado sin descripción.',
                permisos: ['Permisos básicos'],
                tipo: 'personalizado'
            };
            return {
                id: rol.id_rol,
                nombre: rol.rol,
                estado: "Activo",
                usuariosCount: rol.usuariosCount || 0,
                ...info,
            };
        });

        res.json(rolesCompletos);
    } catch (error) {
        console.error("Error en GET /api/admin/gestion-roles:", error);
        res.status(500).json({ message: "Error al obtener los roles." });
    }
});

// --- Endpoint para crear un nuevo rol (gestión de roles) ---
app.post("/api/admin/gestion-roles", async (req, res) => {
    try {
        const { rol } = req.body;
        if (!rol || rol.trim() === '') {
            return res.status(400).json({ message: "El nombre del rol es obligatorio." });
        }

        const [result] = await pool.query("CALL sp_create_role(?, @inserted_id)", [rol]);
        const [[{ inserted_id }]] = await pool.query("SELECT @inserted_id as inserted_id");
        
        res.status(201).json({ success: true, message: 'Rol creado exitosamente', insertedId: inserted_id });
    } catch (error) {
        console.error("Error en POST /api/admin/gestion-roles:", error);
        const errorMessage = error.sqlState === '45000' ? error.sqlMessage : "Error en el servidor al crear el rol.";
        const statusCode = error.sqlState === '45000' ? 409 : 500;
        res.status(statusCode).json({ message: errorMessage });
    }
});

// --- Endpoint para actualizar un rol (gestión de roles) ---
app.put("/api/admin/gestion-roles/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!rol || rol.trim() === '') {
            return res.status(400).json({ message: "El nombre del rol es obligatorio." });
        }

        await pool.query("CALL sp_update_role(?, ?)", [id, rol]);
        res.json({ success: true, message: 'Rol actualizado exitosamente' });
        
    } catch (error) {
        console.error("Error en PUT /api/admin/gestion-roles/:id:", error);
        const errorMessage = error.sqlState === '45000' ? error.sqlMessage : "Error en el servidor al actualizar el rol.";
        const statusCode = error.sqlState === '45000' ? 409 : 500;
        res.status(statusCode).json({ message: errorMessage });
    }
});

// --- Endpoint para eliminar un rol (gestión de roles) ---
app.delete("/api/admin/gestion-roles/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("CALL sp_delete_role(?)", [id]);
        res.json({ success: true, message: "Rol eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar rol:", error);
        const errorMessage = error.sqlState === '45000' ? error.sqlMessage : "Error al eliminar el rol.";
        const statusCode = error.sqlState === '45000' ? 409 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
});

// =================================================================
// ==               GESTIÓN DE SERVICIOS                          ==
// =================================================================

// --- Endpoint para obtener todos los servicios ---
app.get("/api/admin/servicios", async (req, res) => {
  try {
    const [servicios] = await pool.query("CALL Admin_MostrarServicios()");
    res.json(servicios[0]);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error en el servidor al obtener servicios", 
      error: error.message 
    });
  }
});

// --- Endpoint para crear un nuevo servicio ---
app.post("/api/admin/servicios", async (req, res) => {
    try {
        const { nom_ser, descrip_ser, precio, modifying_user_id } = req.body;
        if (!nom_ser || !precio) {
            return res.status(400).json({ message: "El nombre y el precio del servicio son obligatorios." });
        }
        if (!modifying_user_id) {
            return res.status(400).json({ message: "No se pudo identificar al usuario modificador." });
        }

        const [result] = await pool.query("CALL Admin_CrearServicio(?, ?, ?, ?)", [nom_ser, descrip_ser || null, precio, modifying_user_id]);

        res.status(201).json({ success: true, message: 'Servicio creado exitosamente', insertedId: result[0][0].cod_ser });
    } catch (error) {
        console.error("Error en POST /api/admin/servicios:", error);
        res.status(500).json({ message: "Error en el servidor al crear el servicio." });
    }
});

// --- Endpoint para actualizar un servicio ---
app.put("/api/admin/servicios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_ser, descrip_ser, precio, modifying_user_id } = req.body;

        if (!nom_ser || !precio) {
            return res.status(400).json({ message: "El nombre y el precio del servicio son obligatorios." });
        }
        if (!modifying_user_id) {
            return res.status(400).json({ message: "No se pudo identificar al usuario modificador." });
        }

        await pool.query("CALL Admin_ActualizarServicio(?, ?, ?, ?, ?)", [id, nom_ser, descrip_ser || null, precio, modifying_user_id]);

        res.json({ success: true, message: 'Servicio actualizado exitosamente' });
    } catch (error) {
        console.error(`Error en PUT /api/admin/servicios/${req.params.id}:`, error);
        res.status(500).json({ message: "Error en el servidor al actualizar el servicio." });
    }
});

// --- Endpoint para eliminar un servicio ---
app.delete("/api/admin/servicios/:id", async (req, res) => {
    const { id } = req.params;
    const { modifying_user_id } = req.body; // Se recibe el ID del usuario que elimina

    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se pudo identificar al usuario modificador." });
    }

    try {
        await pool.query("CALL Admin_EliminarServicio(?, ?)", [id, modifying_user_id]);
        res.json({ success: true, message: "Servicio eliminado exitosamente" });
    } catch (error) {
        const isForeignKeyError = error.sqlState === '45000';
        const message = isForeignKeyError
            ? error.sqlMessage
            : "Error al eliminar el servicio.";
        const statusCode = isForeignKeyError ? 409 : 500;

        console.error(`Error en DELETE /api/admin/servicios/${id}:`, error);
        res.status(statusCode).json({ success: false, message });
    }
});

// --- Endpoint para OBTENER la auditoría de un servicio específico ---
app.get("/api/admin/servicios/audit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [auditLog] = await pool.query("CALL Admin_MostrarAuditoriaServicio(?)", [id]);
    res.json(auditLog[0]);
  } catch (error) {
    console.error(`Error en GET /api/admin/servicios/audit/${req.params.id}:`, error);
    res.status(500).json({ message: "Error al obtener el historial de auditoría del servicio." });
  }
});

// =================================================================
// ==           FIN DE RUTAS DE GESTION DE SERVICIOS         ==
// =================================================================


// =================================================================
// ==           FIN DE RUTAS DEL PANEL DE ADMINISTRADOR           ==
// =================================================================

// =================================================================
// ==                    GESTIÓN DE CITAS                         ==
// =================================================================

// --- Endpoint para OBTENER TODAS las citas (para la tabla principal)---
app.get("/api/admin/citas", async (req, res) => {
  try {
    const [citas] = await pool.query("CALL Admin_MostrarTodasCitas()");
    res.json(citas[0]); 
  } catch (error) {
    console.error("Error en GET /api/admin/citas:", error);
    res.status(500).json({ message: "Error al obtener las citas." });
  }
});

// --- Endpoint para OBTENER DATOS para los formularios (selects) ---
app.get("/api/admin/citas-data", async (req, res) => {
  try {
    const [results] = await pool.query("CALL Admin_ObtenerDatosFormularioCitas()");
    const [propietarios, mascotas, veterinarios, servicios] = results;
    res.json({ propietarios, mascotas, veterinarios, servicios });
  } catch (error) {
    console.error("Error en GET /api/admin/citas-data:", error);
    res.status(500).json({ message: "Error al obtener datos para formularios de citas." });
  }
});

// --- Endpoint para CREAR una nueva cita ---
app.post("/api/admin/citas", async (req, res) => {
  try {
    const { fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas, modifying_user_id } = req.body;
    
    if (!fech_cit || !hora || !cod_ser || !id_vet || !cod_mas || !id_pro || !estado) {
      return res.status(400).json({ message: "Todos los campos son obligatorios, excepto las notas." });
    }
    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se pudo identificar al usuario modificador." });
    }
    
    const [result] = await pool.query(
      "CALL Admin_InsertarCita(?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas || null, modifying_user_id]
    );
    
    const insertedId = result[0][0].cod_cit;
    res.status(201).json({ success: true, message: 'Cita creada exitosamente', insertedId });

  } catch (error) {
    console.error("Error en POST /api/admin/citas:", error);
    res.status(500).json({ message: "Error en el servidor al crear la cita." });
  }
});

// --- Endpoint para ACTUALIZAR una cita ---
app.put("/api/admin/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas, modifying_user_id } = req.body;

    if (!fech_cit || !hora || !cod_ser || !id_vet || !cod_mas || !id_pro || !estado) {
      return res.status(400).json({ message: "Todos los campos son obligatorios, excepto las notas." });
    }
    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se pudo identificar al usuario modificador." });
    }

    await pool.query(
      "CALL Admin_ActualizarCita(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
      [id, fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas || null, modifying_user_id]
    );

    res.json({ success: true, message: 'Cita actualizada exitosamente' });

  } catch (error) {
    console.error(`Error en PUT /api/admin/citas/${req.params.id}:`, error);
    res.status(500).json({ message: "Error en el servidor al actualizar la cita." });
  }
});

// --- Endpoint para ELIMINAR una cita ---
app.delete("/api/admin/citas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { modifying_user_id } = req.body; 

    if (!modifying_user_id) {
        return res.status(400).json({ message: "No se pudo identificar al usuario modificador." });
    }

    await pool.query("CALL Admin_EliminarCita(?, ?)", [id, modifying_user_id]);
    
    res.json({ success: true, message: "Cita eliminada exitosamente" });

  } catch (error) {
    console.error(`Error en DELETE /api/admin/citas/${req.params.id}:`, error);
    res.status(500).json({ message: "Error al eliminar la cita." });
  }
});

// --- Endpoint para OBTENER las estadísticas de citas --- 
app.get("/api/admin/citas/stats", async (req, res) => {
  try {
    const [stats] = await pool.query("CALL Admin_ObtenerEstadisticasCitas()");
    res.json(stats[0][0]);
  } catch (error) {
    console.error("Error en GET /api/admin/citas/stats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas de citas." });
  }
});

// --- Endpoint para OBTENER la auditoría de una cita específica ---
app.get("/api/admin/citas/audit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [auditLog] = await pool.query("CALL Admin_MostrarAuditoriaCita(?)", [id]);
    res.json(auditLog[0]);
  } catch (error) {
    console.error(`Error en GET /api/admin/citas/audit/${req.params.id}:`, error);
    res.status(500).json({ message: "Error al obtener el historial de auditoría." });
  }
});

// =================================================================
// ==           FIN DE RUTAS DE GESTION DE CITAS           ==
// =================================================================


// Ruta para verificar el estado del servidor y la base de datos
app.get("/health", async (req, res) => {
  const dbConnected = await testDatabaseConnection()

  res.json({
    server: "running",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  })
})

// Iniciar servidor
const PORT = process.env.PORT || 3001
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)

  // Probar la conexión a la base de datos al iniciar
  await testDatabaseConnection()
})

// Ejecutar este script para ver si funciona
console.log("Servidor iniciado correctamente")

// Endpoint para obtener historiales médicos del propietario
app.get("/api/propietario/:id/historiales", async (req, res) => {
  try {
    const { id } = req.params;
    const [historiales] = await pool.query(
      "SELECT * FROM historiales_medicos WHERE cod_mas IN (SELECT cod_mas FROM mascotas WHERE id_pro = ?)",
      [id]
    );
    res.json(historiales);
  } catch (error) {
    console.error("Error al obtener historiales médicos:", error);
    res.status(500).json({ success: false, message: "Error en el servidor al obtener historiales médicos" });
  }
});

// Endpoint para obtener veterinarios
app.get("/api/veterinarios", async (req, res) => {
  try {
    const [veterinarios] = await pool.query(
      "SELECT u.id_usuario, u.nombre, u.apellido, v.especialidad, v.horario FROM veterinarios v JOIN usuarios u ON v.id_vet = u.id_usuario"
    );
    res.json(veterinarios);
  } catch (error) {
    console.error("Error al obtener veterinarios:", error);
    res.status(500).json({ success: false, message: "Error en el servidor al obtener veterinarios" });
  }
});

// GET /api/mascotas - Obtener todas las mascotas con información del propietario
app.get("/api/mascotas", async (req, res) => {
  try {
    const query = `
      SELECT 
        m.cod_mas,
        m.nom_mas,
        m.especie,
        m.raza,
        m.edad,
        m.genero,
        m.peso,
        m.color,
        m.notas,
        m.ultima_visita,
        m.proxima_cita,
        m.vacunado,
        m.esterilizado,
        m.activo,
        m.id_pro,
        m.foto,
        u.nombre as nombre_propietario,
        u.apellido as apellido_propietario,
        u.telefono,
        u.email,
        u.direccion
      FROM mascotas m
      LEFT JOIN propietarios p ON m.id_pro = p.id_pro
      LEFT JOIN usuarios u ON p.id_pro = u.id_usuario
      WHERE m.activo = 1
      ORDER BY m.nom_mas
    `;

    const [rows] = await pool.query(query); // Cambiado de db.execute a pool.query
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// Endpoint para registrar una nueva mascota
app.post("/api/mascotas", upload.single("foto"), async (req, res) => {
  let connection;
  try {
    console.log("📥 Registrando nueva mascota");
    console.log("➡️ Datos recibidos:", req.body);
    console.log("🖼️ Archivo:", req.file);

    const {
      nom_mas,
      especie,
      raza,
      edad,
      genero,
      peso,
      color,
      notas,
      vacunado,
      esterilizado,
      id_pro,
    } = req.body;

    // Validación básica
    if (!nom_mas || !especie || !raza || !edad || !genero || !peso || !color || !id_pro) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios",
      });
    }

    // Validar que id_pro sea un número
    if (!Number.isInteger(Number(id_pro))) {
      return res.status(400).json({
        success: false,
        message: "El ID del propietario debe ser un número válido",
      });
    }

    // Conectar a la base de datos
    connection = await pool.getConnection();

    // Validar que el propietario existe
    const [propietario] = await connection.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
      [id_pro]
    );
    if (propietario.length === 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: `No existe ningún propietario con ID ${id_pro}`,
      });
    }

    // Iniciar transacción
    await connection.beginTransaction();

    const fotoMascota = req.file ? req.file.filename : "default.jpg";

    const insertQuery = `
      INSERT INTO mascotas (
        nom_mas, especie, raza, edad, genero, peso,
        color, notas, vacunado, esterilizado, activo, id_pro, foto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nom_mas,
      especie,
      raza,
      parseFloat(edad),
      genero,
      parseFloat(peso),
      color,
      notas || null,
      vacunado === "true" ? 1 : 0,
      esterilizado === "true" ? 1 : 0,
      1, // activo por defecto
      parseInt(id_pro),
      fotoMascota,
    ];

    const [result] = await connection.query(insertQuery, values);
    await connection.commit();

    res.json({
      success: true,
      message: "Mascota registrada correctamente",
      mascota: {
        id: result.insertId,
        nombre: nom_mas,
        especie,
        raza,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("❌ Error registrando mascota:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al registrar la mascota",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});



// PATCH /api/mascotas/:id/estado - Cambiar estado de mascota
// PATCH /api/mascotas/:id/estado
app.patch("/api/mascotas/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    // Validación básica
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ 
        error: "El campo 'activo' debe ser un valor booleano (true/false)" 
      });
    }

    console.log(`Actualizando estado de mascota ${id} a ${activo}`);

    // Ejecutar la actualización
    const query = "UPDATE mascotas SET activo = ? WHERE cod_mas = ?";
    const [result] = await db.execute(query, [activo, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    // Obtener el estado actualizado para confirmación
    const [updated] = await db.execute("SELECT activo FROM mascotas WHERE cod_mas = ?", [id]);
    
    res.status(200).json({
      success: true,
      message: "Estado actualizado correctamente",
      mascota: { id, activo: updated[0].activo }
    });

  } catch (error) {
    console.error("Error en PATCH /mascotas/estado:", error);
    res.status(500).json({ 
      error: "Error al actualizar el estado",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get("/api/mascotas-totales", async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM mascotas
      WHERE activo = 1
    `);
    
    res.json({ total: result[0].total });
  } catch (error) {
    console.error("Error al contar mascotas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/citas-hoy", async (req, res) => {
  try {
    const hoy = new Date().toISOString().split("T")[0];
    
    const [result] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM citas 
      WHERE DATE(fecha) = ?
    `, [hoy]);
    
    res.json({ total: result[0].total });
  } catch (error) {
    console.error("Error al contar citas de hoy:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/consultas-pendientes", async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM consultas
      WHERE estado = 'pendiente'
    `);
    
    res.json({ total: result[0].total });
  } catch (error) {
    console.error("Error al contar consultas pendientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Middleware de manejo de errores para multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "El archivo es demasiado grande. Máximo 5MB permitido.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Campo de archivo inesperado.",
      });
    }
  }
  if (error.message === "Solo se permiten archivos de imagen") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
});
app.get('/api/historiales', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM historiales_medicos');
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historiales:", error);
    res.status(500).json({ error: "Error al obtener historiales" });
  }
});

// Endpoint para obtener la foto de una mascota
// Endpoint para obtener la foto de una mascota por su ID
app.get("/api/mascotas/:id/foto", async (req, res) => {
  try {
    const { id } = req.params;
    // Obtener la mascota por su ID
    const [mascota] = await pool.query("SELECT * FROM mascotas WHERE cod_mas = ?", [id]);
    if (mascota.length === 0) {
      return res.status(404).json({ success: false, message: "Mascota no encontrada" });
    }
    const foto = mascota[0].foto || "default.jpg";
    const filePath = path.join(__dirname, "..", "uploads", "mascotas", foto); // CORREGIDO
    console.log("[FOTO] Mascota id:", id, "| Nombre archivo:", foto, "| Ruta esperada:", filePath);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    // Si no existe la foto, intentar servir el default
    const defaultPath = path.join(__dirname, "..", "uploads", "mascotas", "default.jpg"); // CORREGIDO
    if (fs.existsSync(defaultPath)) {
      console.warn(`[FOTO] Archivo no encontrado (${filePath}), devolviendo default.jpg (${defaultPath})`);
      return res.sendFile(defaultPath);
    } else {
      console.error(`[FOTO] Ni la foto ni default.jpg existen. Ruta buscada: ${filePath} | Default: ${defaultPath}`);
      return res.status(404).json({ success: false, message: `Foto no encontrada (${filePath}) y tampoco default.jpg` });
    }
  } catch (error) {
    console.error("Error al obtener la foto de la mascota:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});


