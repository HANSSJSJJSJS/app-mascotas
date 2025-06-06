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
    const { tipo_documento, numeroid, genero, fecha_nacimiento, nombre, apellido, telefono, ciudad, direccion, email } =
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
        direccion = ?,
        email = ?
      WHERE id_usuario = ?
    `,
      [tipo_documento, numeroid, genero, fecha_nacimiento, nombre, apellido, telefono, ciudad, direccion, email, id],
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
          direccion, 
          email, 
          password_hash,
          id_rol,
          id_tipo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        direccion,
        email,
        hashedPassword,
        3, // id_rol = 3 (Propietario)
        1, // id_tipo = 1 (propietario)
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
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)

  // Probar la conexión a la base de datos al iniciar
  await testDatabaseConnection()
})

// Ejecutar este script para ver si funciona
console.log("Servidor iniciado correctamente")


