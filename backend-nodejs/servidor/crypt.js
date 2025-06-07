const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function encryptPasswords() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mascotas_db'
    });

    const [users] = await db.query('SELECT id_usuario, password_hash FROM usuarios');

    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password_hash, 10);
        await db.query('UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?', [hashedPassword, user.id_usuario]);
    }

    console.log('Contraseñas actualizadas correctamente');
    db.end();
}

encryptPasswords();