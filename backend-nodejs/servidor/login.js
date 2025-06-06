// Ruta de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const [users] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email])

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" })
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (passwordMatch) {
      res.json({ success: true, message: "Inicio de sesión exitoso", user })
    } else {
      res.status(401).json({ success: false, message: "Credenciales incorrectas" })
    }
  } catch (error) {
    console.error("Error en el login:", error)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  }
})