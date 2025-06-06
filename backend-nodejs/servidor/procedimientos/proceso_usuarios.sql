DELIMITER $$

-- Obtener todos los usuarios
CREATE PROCEDURE ObtenerUsuarios()
BEGIN
    SELECT * FROM usuarios;
END$$

-- Obtener un usuario por ID
CREATE PROCEDURE ObtenerUsuarioPorId(
    IN p_id_usuario INT
)
BEGIN
    SELECT * FROM usuarios WHERE id_usuario = p_id_usuario;
END$$

-- Obtener un usuario por email
CREATE PROCEDURE ObtenerUsuarioPorEmail(
    IN p_email VARCHAR(100)
)
BEGIN
    SELECT * FROM usuarios WHERE email = p_email;
END$$

-- Actualizar usuario
CREATE PROCEDURE ActualizarUsuario(
    IN p_id_usuario INT,
    IN p_tipo_documento ENUM('CC','CE','PP'),
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(30),
    IN p_ciudad VARCHAR(50),
    IN p_direccion VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_email VARCHAR(100),
    IN p_id_tipo INT,
    IN p_id_rol INT
)
BEGIN
    UPDATE usuarios SET
        tipo_documento = p_tipo_documento,
        nombre = p_nombre,
        apellido = p_apellido,
        ciudad = p_ciudad,
        direccion = p_direccion,
        telefono = p_telefono,
        fecha_nacimiento = p_fecha_nacimiento,
        email = p_email,
        id_tipo = p_id_tipo,
        id_rol = p_id_rol
    WHERE id_usuario = p_id_usuario;
END$$

-- Actualizar contraseña
CREATE PROCEDURE ActualizarContrasena(
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    UPDATE usuarios SET
        password_hash = p_password_hash
    WHERE email = p_email;
    
    SELECT ROW_COUNT() AS affected_rows;
END$$

-- Eliminar usuario
CREATE PROCEDURE EliminarUsuario(
    IN p_id_usuario INT
)
BEGIN
    DELETE FROM usuarios WHERE id_usuario = p_id_usuario;
END$$

DELIMITER ;
