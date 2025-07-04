USE mascotas_db;

DELIMITER $$

-- 1. OBTENER TODOS LOS SERVICIOS (Sin cambios)
CREATE PROCEDURE Admin_MostrarServicios()
BEGIN
    SELECT * FROM servicios ORDER BY nom_ser;
END$$

-- 2. CREAR UN NUEVO SERVICIO (Modificado)
CREATE PROCEDURE Admin_CrearServicio(
    IN p_nom_ser VARCHAR(100),
    IN p_descrip_ser TEXT,
    IN p_precio DECIMAL(20, 2),
    IN p_modifying_user_id INT -- <-- PARÁMETRO NUEVO
)
BEGIN
    -- Establece la variable de sesión para el trigger
    SET @app_user_id = p_modifying_user_id; -- <-- LÍNEA NUEVA

    INSERT INTO servicios (nom_ser, descrip_ser, precio)
    VALUES (p_nom_ser, p_descrip_ser, p_precio);
    SELECT LAST_INSERT_ID() AS cod_ser;
END$$

-- 3. ACTUALIZAR UN SERVICIO EXISTENTE (Modificado)
CREATE PROCEDURE Admin_ActualizarServicio(
    IN p_cod_ser INT,
    IN p_nom_ser VARCHAR(100),
    IN p_descrip_ser TEXT,
    IN p_precio DECIMAL(20, 2),
    IN p_modifying_user_id INT -- <-- PARÁMETRO NUEVO
)
BEGIN
    -- Establece la variable de sesión para el trigger
    SET @app_user_id = p_modifying_user_id; -- <-- LÍNEA NUEVA

    UPDATE servicios
    SET
        nom_ser = p_nom_ser,
        descrip_ser = p_descrip_ser,
        precio = p_precio
    WHERE cod_ser = p_cod_ser;
END$$

-- 4. ELIMINAR UN SERVICIO (Modificado)
CREATE PROCEDURE Admin_EliminarServicio(
    IN p_cod_ser INT,
    IN p_modifying_user_id INT -- <-- PARÁMETRO NUEVO
)
BEGIN
    DECLARE cita_count INT;
    
    -- Establece la variable de sesión para el trigger
    SET @app_user_id = p_modifying_user_id; -- <-- LÍNEA NUEVA

    SELECT COUNT(*) INTO cita_count FROM citas WHERE cod_ser = p_cod_ser;

    IF cita_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el servicio porque está asignado a una o más citas.';
    ELSE
        DELETE FROM servicios WHERE cod_ser = p_cod_ser;
        SELECT ROW_COUNT() as affectedRows;
    END IF;
END$$

-- 5. OBTENER HISTORIAL DE AUDITORÍA (Sin cambios)
CREATE PROCEDURE Admin_MostrarAuditoriaServicio(IN p_cod_ser INT)
BEGIN
    SELECT
        audit_id,
        accion,
        campo_modificado,
        valor_anterior,
        valor_nuevo,
        usuario_db,
        fecha_modificacion
    FROM servicios_audit
    WHERE cod_ser = p_cod_ser
    ORDER BY fecha_modificacion DESC;
END$$

DELIMITER ;