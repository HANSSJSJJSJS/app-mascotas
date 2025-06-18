DELIMITER $$
CREATE PROCEDURE `sp_leer_usuarios`()
BEGIN
    SELECT 
        u.id_usuario, 
        -- CORRECCIÓN: Se usa CONCAT para unir 'nombre' y 'apellido' que sí existen en tu tabla.
        CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo, 
        -- CORRECCIÓN: La columna en tu tabla es 'email'.
        u.email, 
        -- CORRECCIÓN: La columna en tu tabla 'rol' se llama 'rol'.
        r.rol AS nombre_rol,
        u.ciudad,
        u.tipo_documento,
        u.numeroid,
        -- CORRECCIÓN: Tu tabla usuarios NO tiene 'fecha_registro'. Se elimina.
        -- Si quieres la fecha de creación, podrías añadir un campo DATETIME/TIMESTAMP a tu tabla.
        -- Por ahora, lo quitamos para que no dé error.
        'N/A' as fecha_registro -- Devolvemos un valor por defecto para no romper el frontend
    FROM usuarios u
    LEFT JOIN rol r ON u.id_rol = r.id_rol
    ORDER BY u.id_usuario DESC;
END$$
DELIMITER ;

-- PASO 3: Crear el procedimiento para LEER ROLES con los nombres de columna CORRECTOS.
DELIMITER $$
CREATE PROCEDURE `sp_leer_roles`()
BEGIN
    -- CORRECCIÓN: La columna en tu tabla es 'rol'.
    SELECT id_rol, rol AS nombre_rol FROM rol;
END$$
DELIMITER ;

-- PASO 4: Re-crear los otros procedimientos para asegurar consistencia.
DELIMITER $$
CREATE PROCEDURE `sp_eliminar_usuario`(IN `_id_usuario` INT)
BEGIN
    DELETE FROM propietarios WHERE id_usuario = _id_usuario;
    DELETE FROM veterinario WHERE id_usuario = _id_usuario;
    DELETE FROM usuarios WHERE id_usuario = _id_usuario;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_actualizar_usuario`(
    IN `p_id_usuario` INT,
    IN `p_nombre` VARCHAR(255),
    IN `p_apellido` VARCHAR(255),
    IN `p_email` VARCHAR(255),
    IN `p_id_rol` INT
)
BEGIN
    UPDATE usuarios
    SET
        nombre = p_nombre,
        apellido = p_apellido,
        email = p_email,
        id_rol = p_id_rol
    WHERE id_usuario = p_id_usuario;
END$$
DELIMITER ;
