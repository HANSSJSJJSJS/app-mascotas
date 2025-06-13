const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const bcrypt = require("bcrypt")

const app = express()
app.use(express.json())
app.use(cors())

// Configuración de la conexión a MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "mascotas_db",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

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
      const [propietario] = await pool.query("SELECT * FROM propietarios WHERE id_usuario = ?", [id])

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

// Endpoint para obtener mascotas del propietario
app.get("/api/propietario/:id/mascotas", async (req, res) => {
  try {
    const { id } = req.params
    const [mascotas] = await pool.query("SELECT * FROM mascotas WHERE id_pro = ?", [id])

    res.json(mascotas)
  } catch (error) {
    console.error("Error al obtener mascotas:", error)
    res.status(500).json({ success: false, message: "Error en el servidor mascotas" })
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

// --- Endpoint para crear un nuevo usuario (gestión de usuarios) ---
app.post("/api/admin/users", async (req, res) => {
    console.log('Recibida petición para crear usuario:', req.body);
    const connection = await pool.getConnection();
    try {
        const {
            nombre, apellido, email, tipo_documento, numeroid, genero, 
            fecha_nacimiento, telefono, ciudad, barrio, direccion, 
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
            telefono, ciudad, direccion, barrio, password_hash, id_rol, id_tipo, estado
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        
        const values = [
            nombre, apellido, email, tipo_documento, numeroid, genero,
            fecha_nacimiento, telefono || null, ciudad, direccion,
            barrio || null, 
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

// --- Endpoint para actualizar un usuario existente (gestión de usuarios) ---
app.put("/api/admin/users/:id", async (req, res) => {
    const { id } = req.params;
    const {
        nombre, apellido, email, tipo_documento, numeroid, genero, 
        fecha_nacimiento, telefono, ciudad, direccion, barrio,
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
                barrio = ?, id_rol = ?, id_tipo = ?, estado = ?
                ${hashedPassword ? ', password_hash = ?' : ''}
            WHERE id_usuario = ?`;
        
        const values = [
            nombre, apellido, email, tipo_documento, numeroid, genero,
            fecha_nacimiento, telefono || null, ciudad, direccion,
            barrio || null,
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

// --- Endpoint para eliminar un usuario (gestión de usuarios) ---
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

// --- Endpoint para obtener la lista de roles (para formularios) ---
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

// --- Endpoint para obtener los tipos de persona (para formularios) ---
app.get("/api/admin/person-types", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT id_tipo, tipo FROM tipo_persona ORDER BY id_tipo");
        res.json(results);
    } catch (error) {
        console.error("Error en GET /api/admin/person-types:", error);
        res.status(500).json({ message: "Error al obtener los tipos de persona." });
    }
});

// --- Endpoint para obtener todos los roles (gestión de roles) ---
app.get("/api/admin/gestion-roles", async (req, res) => {
    try {
        const [users] = await pool.query("SELECT id_rol FROM usuarios");
        const [rolesFromDB] = await pool.query("SELECT id_rol, rol FROM rol ORDER BY id_rol ASC");

        const userCounts = users.reduce((acc, user) => {
            acc[user.id_rol] = (acc[user.id_rol] || 0) + 1;
            return acc;
        }, {});

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

// --- Endpoint para crear un nuevo rol (gestión de roles) ---
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

// --- Endpoint para actualizar un rol (gestión de roles) ---
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

// --- Endpoint para eliminar un rol (gestión de roles) ---
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

// --- Endpoint para obtener todos los servicios (gestión de servicios) ---
app.get("/api/admin/servicios", async (req, res) => {
  try {
    const [servicios] = await pool.query("SELECT * FROM servicios");
    console.log(servicios); // Inspeccionar los datos
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ success: false, message: "Error en el servidor al obtener servicios" });
  }
});

// --- Endpoint para crear un nuevo servicio (gestión de servicios) ---
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

// --- Endpoint para actualizar un servicio (gestión de servicios) ---
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

// --- Endpoint para eliminar un servicio (gestión de servicios) ---
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
// ==           FIN DE RUTAS DEL PANEL DE ADMINISTRADOR           ==
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