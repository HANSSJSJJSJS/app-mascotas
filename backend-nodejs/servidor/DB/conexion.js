const mysql = require("mysql2/promise")

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mascotas_db",
  port: Number.parseInt(process.env.DB_PORT) || 3306,
}

async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw error
  }
}

async function executeQuery(query, params = []) {
  const connection = await getConnection()
  try {
    const [results] = await connection.execute(query, params)
    return results
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  } finally {
    await connection.end()
  }
}
// Prueba de conexión si ejecutas el archivo directamente
if (require.main === module) {
  (async () => {
    try {
      const connection = await getConnection();
      console.log("✅ Conexión a la base de datos exitosa.");
      await connection.end();
    } catch (err) {
      console.error("❌ Error al conectar con la base de datos:", err.message);
    }
  })();
}

module.exports = { getConnection, executeQuery }
