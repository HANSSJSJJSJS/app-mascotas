DELIMITER $$

-- OBTENER TODAS LAS CITAS
CREATE PROCEDURE Admin_MostrarTodasCitas()
BEGIN
    SELECT 
        c.*,
        m.nom_mas,
        CONCAT(u_pro.nombre, ' ', u_pro.apellido) as nom_pro,
        CONCAT(u_vet.nombre, ' ', u_vet.apellido) as nom_vet,
        s.nom_ser
    FROM citas c
    JOIN mascotas m ON c.cod_mas = m.cod_mas
    JOIN usuarios u_pro ON c.id_pro = u_pro.id_usuario
    JOIN servicios s ON c.cod_ser = s.cod_ser
    LEFT JOIN usuarios u_vet ON c.id_vet = u_vet.id_usuario
    ORDER BY c.fech_cit DESC, c.hora DESC;
END$$

-- OBTENER DATOS PARA FORMULARIOS
CREATE PROCEDURE Admin_ObtenerDatosFormularioCitas()
BEGIN
    SELECT id_usuario, nombre, apellido FROM usuarios WHERE id_rol = 3 ORDER BY nombre, apellido;
    SELECT cod_mas, nom_mas, id_pro FROM mascotas WHERE activo = true ORDER BY nom_mas;
    SELECT id_usuario, nombre, apellido FROM usuarios WHERE id_rol = 2 ORDER BY nombre, apellido;
    SELECT cod_ser, nom_ser FROM servicios ORDER BY nom_ser;
END$$

-- CREAR UNA NUEVA CITA (Modificado)
CREATE PROCEDURE Admin_InsertarCita (
    IN p_fech_cit DATE,
    IN p_hora TIME,
    IN p_cod_ser INT,
    IN p_id_vet INT,
    IN p_cod_mas INT,
    IN p_id_pro INT,
    IN p_estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA'),
    IN p_notas TEXT,
    IN p_modifying_user_id INT -- <-- PARÁMETRO NUEVO
)
BEGIN
    -- Establece la variable de sesión para el trigger
    SET @app_user_id = p_modifying_user_id; -- <-- LÍNEA NUEVA

    INSERT INTO citas (fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas)
    VALUES (p_fech_cit, p_hora, p_cod_ser, p_id_vet, p_cod_mas, p_id_pro, p_estado, p_notas);
    
    SELECT LAST_INSERT_ID() as cod_cit;
END$$

-- ACTUALIZAR UNA CITA EXISTENTE (Modificado)
CREATE PROCEDURE Admin_ActualizarCita (
    IN p_cod_cit INT,
    IN p_fech_cit DATE,
    IN p_hora TIME,
    IN p_cod_ser INT,
    IN p_id_vet INT,
    IN p_cod_mas INT,
    IN p_id_pro INT,
    IN p_estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA'),
    IN p_notas TEXT,
    IN p_modifying_user_id INT -- <-- PARÁMETRO NUEVO
)
BEGIN
    -- Establece la variable de sesión para el trigger
    SET @app_user_id = p_modifying_user_id; -- <-- LÍNEA NUEVA

    UPDATE citas
    SET fech_cit = p_fech_cit, hora = p_hora, cod_ser = p_cod_ser, id_vet = p_id_vet, 
        cod_mas = p_cod_mas, id_pro = p_id_pro, estado = p_estado, notas = p_notas
    WHERE cod_cit = p_cod_cit;
END$$

-- ELIMINAR UNA CITA (Modificado)
CREATE PROCEDURE Admin_EliminarCita (
    IN p_cod_cit INT,
    IN p_modifying_user_id INT -- <-- PARÁMETRO NUEVO
)
BEGIN
    -- Establece la variable de sesión para el trigger
    SET @app_user_id = p_modifying_user_id; -- <-- LÍNEA NUEVA

    DELETE FROM citas WHERE cod_cit = p_cod_cit;
END$$

-- OBTENER ESTADÍSTICAS (KPIs)
CREATE PROCEDURE Admin_ObtenerEstadisticasCitas()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM citas WHERE fech_cit = CURDATE()) as totalHoy,
        (SELECT COUNT(*) FROM citas WHERE estado = 'PENDIENTE') as pendientes,
        (SELECT COUNT(*) FROM citas WHERE estado = 'CONFIRMADA') as confirmadas,
        (SELECT COUNT(*) FROM citas WHERE estado = 'REALIZADA') as realizadas;
END$$

-- OBTENER EL HISTORIAL DE AUDITORÍA DE UNA CITA
CREATE PROCEDURE Admin_MostrarAuditoriaCita(IN p_cod_cit INT)
BEGIN
    SELECT
        accion,
        campo_modificado,
        valor_anterior,
        valor_nuevo,
        usuario_db,
        fecha_modificacion
    FROM citas_audit
    WHERE cod_cit = p_cod_cit
    ORDER BY fecha_modificacion DESC;
END$$

DELIMITER ;