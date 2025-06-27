const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors()) // Permitir peticiones desde el frontend
app.use(express.json()) // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })) // Parsear form data

// Importar rutas
const serviciosRoutes = require("./routes/servicios")
const veterinariosRoutes = require("./routes/veterinarios")
const mascotasRoutes = require("./routes/mascotas")
const citasRoutes = require("./routes/citas")

// Usar rutas
app.use("/api/servicios", serviciosRoutes)
app.use("/api/veterinarios", veterinariosRoutes)
app.use("/api/mascotas", mascotasRoutes)
app.use("/api/citas", citasRoutes)

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API Veterinaria funcionando correctamente" })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Algo salió mal en el servidor" })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

module.exports = app
