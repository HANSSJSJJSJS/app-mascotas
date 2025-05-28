const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();

// Configuración de seguridad y middleware
require('dotenv').config();

// Verificar variables de entorno críticas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'PORT'];
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`❌ Falta la variable de entorno requerida: ${env}`);
    process.exit(1);
  }
});

// Configuración de conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Limitar peticiones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de peticiones
});
app.use('/login', limiter);
app.use('/registro', limiter);

// Pool de conexiones MySQL
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión a la base de datos
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("✅ Conexión a la base de datos establecida correctamente");

    const [tables] = await connection.query("SHOW TABLES");
    console.log("📊 Tablas disponibles:", tables.map(t => Object.values(t)[0]).join(", "));

    return true;
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

// Validadores para las rutas
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

const validateRegister = [
  body('tipoDocumento').isIn(['CC', 'CE', 'PP']),
  body('numeroId').isNumeric().isLength({ min: 6, max: 10 }),
  body('genero').isIn(['Mujer', 'Hombre', 'No identificado']),
  body('fechaNacimiento').isISO8601(),
  body('nombre').isString().isLength({ min: 3, max: 30 }),
  body('apellido').isString().isLength({ min: 3, max: 30 }),
  body('telefono').isMobilePhone(),
  body('ciudad').isString().isLength({ min: 3, max: 30 }),
  body('direccion').isString().isLength({ min: 3, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
];

// Ruta de login
app.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "Credenciales incorrectas" 
      });
    }

    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Credenciales incorrectas" 
      });
    }

    // Eliminar información sensible antes de responder
    delete user.password_hash;
    
    res.json({ 
      success: true, 
      message: "Inicio de sesión exitoso", 
      user 
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error en el servidor" 
    });
  }
});

// Ruta de registro de propietarios
app.post("/registro", validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

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
    } = req.body;

    // Verificar email y documento único
    const [emailExists] = await connection.query(
      "SELECT 1 FROM usuarios WHERE email = ?", 
      [email]
    );
    
    if (emailExists.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: "El email ya está registrado" 
      });
    }

    const [docExists] = await connection.query(
      "SELECT 1 FROM usuarios WHERE numeroid = ?", 
      [numeroId]
    );
    
    if (docExists.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: "El número de documento ya está registrado" 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [userResult] = await connection.query(
      `INSERT INTO usuarios (
        tipo_documento, numeroid, genero, fecha_nacimiento, 
        nombre, apellido, telefono, ciudad, direccion, 
        email, password_hash, id_rol, id_tipo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tipoDocumento, numeroId, genero, fechaNacimiento,
        nombre, apellido, telefono, ciudad, direccion,
        email, hashedPassword, 3, 1 // 3 = Propietario, 1 = tipo propietario
      ]
    );

    // Insertar propietario
    await connection.query(
      "INSERT INTO propietarios (id_usuario) VALUES (?)",
      [userResult.insertId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: "Propietario registrado exitosamente",
      userId: userResult.insertId
    });

  } catch (error) {
    if (connection) await connection.rollback();
    
    console.error("Error en el registro:", error);

    let message = "Error en el servidor al registrar el propietario";
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      message = "Error: Falta una referencia en otra tabla";
    } else if (error.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
      message = "Error: Valor no cumple con las restricciones";
    }

    res.status(500).json({ 
      success: false, 
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });

  } finally {
    if (connection) connection.release();
  }
});

// Ruta de estado del servidor
app.get("/health", async (req, res) => {
  try {
    const dbConnected = await testDatabaseConnection();
    res.json({
      status: "running",
      database: dbConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      error: "Health check failed" 
    });
  }
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    const dbOk = await testDatabaseConnection();
    if (!dbOk) throw new Error('No se pudo conectar a la base de datos');

    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Base de datos: ${dbOk ? 'CONECTADA' : 'DESCONECTADA'}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();