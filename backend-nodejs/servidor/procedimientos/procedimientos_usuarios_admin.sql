USE mascotas_db;

DELIMITER $$

-- 1. Procedimiento para OBTENER todos los usuarios
CREATE PROCEDURE sp_get_all_users()
BEGIN
    SELECT 
        u.*,
        r.rol AS nombre_rol, 
        tp.tipo AS tipo_persona
    FROM usuarios u
    LEFT JOIN rol r ON u.id_rol = r.id_rol
    LEFT JOIN tipo_persona tp ON u.id_tipo = tp.id_tipo
    ORDER BY u.id_usuario DESC;
END$$

-- 2. Procedimiento para CREAR un nuevo usuario
CREATE PROCEDURE sp_create_user(
    IN p_nombre VARCHAR(255),
    IN p_apellido VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_tipo_documento VARCHAR(10),
    IN p_numeroid VARCHAR(20),
    IN p_genero VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_telefono VARCHAR(20),
    IN p_ciudad VARCHAR(255),
    IN p_barrio VARCHAR(255),
    IN p_direccion VARCHAR(255),
    IN p_id_rol INT,
    IN p_id_tipo INT,
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE existing_email INT DEFAULT 0;
    DECLARE new_user_id INT;

    -- Verificar si el email ya existe
    SELECT COUNT(*) INTO existing_email FROM usuarios WHERE email = p_email;

    IF existing_email = 0 THEN
        -- Insertar el nuevo usuario
        INSERT INTO usuarios (
            nombre, apellido, email, tipo_documento, numeroid, genero, fecha_nacimiento, 
            telefono, ciudad, direccion, barrio, password_hash, id_rol, id_tipo, estado
        ) VALUES (
            p_nombre, p_apellido, p_email, p_tipo_documento, p_numeroid, p_genero, p_fecha_nacimiento,
            p_telefono, p_ciudad, p_direccion, p_barrio, p_password, p_id_rol, p_id_tipo, 1
        );
        
        SET new_user_id = LAST_INSERT_ID();
        
        -- Insertar en la tabla correspondiente al tipo de persona
        IF p_id_tipo = 1 THEN
            INSERT IGNORE INTO propietarios (id_pro) VALUES (new_user_id);
        ELSEIF p_id_tipo = 2 OR p_id_tipo = 3 THEN
            INSERT IGNORE INTO veterinarios (id_vet, especialidad, horario) VALUES (new_user_id, 'General', 'N/A');
        ELSEIF p_id_tipo = 4 THEN
            INSERT IGNORE INTO administradores (id_admin, cargo, fecha_ingreso) VALUES (new_user_id, 'Cargo por definir', CURDATE());
        END IF;

        SELECT new_user_id AS id_usuario;
    ELSE
        -- Devolver un error si el email ya existe
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo electrónico ya está registrado.';
    END IF;
END$$

-- 3. Procedimiento para ACTUALIZAR un usuario
CREATE PROCEDURE sp_update_user(
    IN p_id_usuario INT,
    IN p_nombre VARCHAR(255),
    IN p_apellido VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_tipo_documento VARCHAR(10),
    IN p_numeroid VARCHAR(20),
    IN p_genero VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_telefono VARCHAR(20),
    IN p_ciudad VARCHAR(255),
    IN p_barrio VARCHAR(255),
    IN p_direccion VARCHAR(255),
    IN p_id_rol INT,
    IN p_id_tipo INT,
    IN p_estado TINYINT,
    IN p_password VARCHAR(255)
)
BEGIN
    UPDATE usuarios SET
        nombre = p_nombre,
        apellido = p_apellido,
        email = p_email,
        tipo_documento = p_tipo_documento,
        numeroid = p_numeroid,
        genero = p_genero,
        fecha_nacimiento = p_fecha_nacimiento,
        telefono = p_telefono,
        ciudad = p_ciudad,
        direccion = p_direccion,
        barrio = p_barrio,
        id_rol = p_id_rol,
        id_tipo = p_id_tipo,
        estado = p_estado,
        password_hash = IF(p_password IS NOT NULL AND p_password != '', p_password, password_hash)
    WHERE id_usuario = p_id_usuario;
END$$

-- 4. Procedimiento para ELIMINAR un usuario
CREATE PROCEDURE sp_delete_user(
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_tipo INT;

    -- Iniciar transacción
    START TRANSACTION;

    -- Obtener el tipo de usuario
    SELECT id_tipo INTO v_id_tipo FROM usuarios WHERE id_usuario = p_id_usuario;

    -- Eliminar de la tabla específica del rol
    IF v_id_tipo IS NOT NULL THEN
        IF v_id_tipo = 1 THEN
            DELETE FROM propietarios WHERE id_pro = p_id_usuario;
        ELSEIF v_id_tipo = 2 OR v_id_tipo = 3 THEN
            DELETE FROM veterinarios WHERE id_vet = p_id_usuario;
        ELSEIF v_id_tipo = 4 THEN
            DELETE FROM administradores WHERE id_admin = p_id_usuario;
        END IF;
    END IF;

    -- Eliminar de la tabla principal de usuarios
    DELETE FROM usuarios WHERE id_usuario = p_id_usuario;
    
    -- Confirmar transacción
    COMMIT;
END$$

DELIMITER ;