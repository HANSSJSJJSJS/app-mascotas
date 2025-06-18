USE mascotas_db;
DELIMITER $$

-- =================================================================
-- ==     PROCEDIMIENTOS ALMACENADOS PARA GESTIÓN DE SERVICIOS    ==
-- =================================================================

-- 1. OBTENER TODOS LOS SERVICIOS
DROP PROCEDURE IF EXISTS Admin_MostrarServicios$$
CREATE PROCEDURE Admin_MostrarServicios()
BEGIN
    SELECT * FROM servicios ORDER BY nom_ser;
END$$

-- 2. CREAR UN NUEVO SERVICIO
DROP PROCEDURE IF EXISTS Admin_CrearServicio$$
CREATE PROCEDURE Admin_CrearServicio(
    IN p_nom_ser VARCHAR(100),
    IN p_descrip_ser TEXT,
    IN p_precio DECIMAL(20, 2)
)
BEGIN
    INSERT INTO servicios (nom_ser, descrip_ser, precio)
    VALUES (p_nom_ser, p_descrip_ser, p_precio);
    SELECT LAST_INSERT_ID() AS cod_ser;
END$$

-- 3. ACTUALIZAR UN SERVICIO EXISTENTE
DROP PROCEDURE IF EXISTS Admin_ActualizarServicio$$
CREATE PROCEDURE Admin_ActualizarServicio(
    IN p_cod_ser INT,
    IN p_nom_ser VARCHAR(100),
    IN p_descrip_ser TEXT,
    IN p_precio DECIMAL(20, 2)
)
BEGIN
    UPDATE servicios
    SET
        nom_ser = p_nom_ser,
        descrip_ser = p_descrip_ser,
        precio = p_precio
    WHERE cod_ser = p_cod_ser;
END$$

-- 4. ELIMINAR UN SERVICIO (con validación)
DROP PROCEDURE IF EXISTS Admin_EliminarServicio$$
CREATE PROCEDURE Admin_EliminarServicio(
    IN p_cod_ser INT
)
BEGIN
    DECLARE cita_count INT;

    -- Primero, contamos cuántas citas están usando este servicio
    SELECT COUNT(*) INTO cita_count FROM citas WHERE cod_ser = p_cod_ser;

    -- Si el contador es mayor que 0, lanzamos un error personalizado.
    -- SQLSTATE '45000' es un estado genérico para errores definidos por el usuario.
    IF cita_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede eliminar el servicio porque está asignado a una o más citas.';
    ELSE
        -- Si no está en uso, procedemos a eliminarlo.
        DELETE FROM servicios WHERE cod_ser = p_cod_ser;
        SELECT ROW_COUNT() as affectedRows;
    END IF;
END$$

-- Procedimiento para obtener el historial de auditoría de un servicio específico
DROP PROCEDURE IF EXISTS Admin_MostrarAuditoriaServicio$$
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