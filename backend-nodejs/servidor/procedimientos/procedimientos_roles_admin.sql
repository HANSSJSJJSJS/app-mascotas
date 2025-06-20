DELIMITER $$

-- 1. SP para obtener roles para formularios (dropdowns)
CREATE PROCEDURE sp_get_roles_for_dropdown()
BEGIN
    SELECT id_rol, rol AS nombre_rol FROM rol ORDER BY id_rol;
END$$

-- 2. SP para obtener tipos de persona para formularios
CREATE PROCEDURE sp_get_person_types()
BEGIN
    SELECT id_tipo, tipo FROM tipo_persona ORDER BY id_tipo;
END$$

-- 3. SP para obtener la lista de roles con su conteo de usuarios
CREATE PROCEDURE sp_get_roles_with_user_count()
BEGIN
    SELECT 
        r.id_rol, 
        r.rol, 
        COUNT(u.id_usuario) AS usuariosCount
    FROM 
        rol r
    LEFT JOIN 
        usuarios u ON r.id_rol = u.id_rol
    GROUP BY 
        r.id_rol, r.rol
    ORDER BY 
        r.id_rol ASC;
END$$

-- 4. SP para crear un nuevo rol
CREATE PROCEDURE sp_create_role(
    IN p_rol_nombre VARCHAR(255),
    OUT p_inserted_id INT
)
BEGIN
    -- Validar si ya existe un rol con ese nombre
    IF EXISTS (SELECT 1 FROM rol WHERE rol = p_rol_nombre) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya existe un rol con ese nombre.';
    ELSE
        INSERT INTO rol (rol) VALUES (p_rol_nombre);
        SET p_inserted_id = LAST_INSERT_ID();
    END IF;
END$$

-- 5. SP para actualizar un rol
CREATE PROCEDURE sp_update_role(
    IN p_id_rol INT,
    IN p_rol_nombre VARCHAR(255)
)
BEGIN
    -- Validar si el nuevo nombre ya está en uso por OTRO rol
    IF EXISTS (SELECT 1 FROM rol WHERE rol = p_rol_nombre AND id_rol != p_id_rol) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya existe otro rol con ese nombre.';
    ELSE
        UPDATE rol SET rol = p_rol_nombre WHERE id_rol = p_id_rol;
    END IF;
END$$

-- 6. SP para eliminar un rol
CREATE PROCEDURE sp_delete_role(
    IN p_id_rol INT
)
BEGIN
    DECLARE user_count INT DEFAULT 0;

    -- Verificar si el rol está asignado a algún usuario
    SELECT COUNT(*) INTO user_count FROM usuarios WHERE id_rol = p_id_rol;
    
    IF user_count > 0 THEN
        -- Si está asignado, lanzar un error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede eliminar el rol porque está asignado a uno o más usuarios.';
    ELSE
        -- Si no está asignado, eliminarlo
        DELETE FROM rol WHERE id_rol = p_id_rol;
    END IF;
END$$

DELIMITER ;