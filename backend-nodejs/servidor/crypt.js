const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function encryptPasswords() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345679',
        database: 'mascotas_db'
    });

    const [users] = await db.query('SELECT id_usuario, contrasena FROM usuarios');

    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.contrasena, 10);
        await db.query('UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?', [hashedPassword, user.id_usuario]);
    }

    console.log('Contraseñas actualizadas correctamente');
    db.end();
}

encryptPasswords();