DELIMITER $$

-- TRIGGER DE CREACIÓN (INSERT)
CREATE TRIGGER trg_after_servicios_insert
AFTER INSERT ON servicios
FOR EACH ROW
BEGIN
    DECLARE modifier_name VARCHAR(255);
    -- Busca el nombre del usuario que realiza la acción
    SELECT CONCAT(nombre, ' ', apellido) INTO modifier_name FROM usuarios WHERE id_usuario = @app_user_id;

    INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_nuevo, usuario_db)
    VALUES (NEW.cod_ser, 'INSERT', 'Servicio Creado', CONCAT(
        'Nombre: ', NEW.nom_ser,
        ', Precio: ', FORMAT(NEW.precio, 0, 'es_CO'),
        ', Descripción: ', COALESCE(NEW.descrip_ser, 'N/A')
    ), IFNULL(modifier_name, 'Sistema'));
END$$

-- TRIGGER DE ACTUALIZACIÓN (UPDATE)
CREATE TRIGGER trg_after_servicios_update
AFTER UPDATE ON servicios
FOR EACH ROW
BEGIN
    DECLARE modifier_name VARCHAR(255);
    -- Busca el nombre del usuario que realiza la acción
    SELECT CONCAT(nombre, ' ', apellido) INTO modifier_name FROM usuarios WHERE id_usuario = @app_user_id;

    IF OLD.nom_ser <> NEW.nom_ser THEN
        INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_ser, 'UPDATE', 'Nombre Servicio', OLD.nom_ser, NEW.nom_ser, IFNULL(modifier_name, 'Sistema'));
    END IF;

    IF COALESCE(OLD.descrip_ser, '') <> COALESCE(NEW.descrip_ser, '') THEN
        INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_ser, 'UPDATE', 'Descripción', OLD.descrip_ser, NEW.descrip_ser, IFNULL(modifier_name, 'Sistema'));
    END IF;

    IF OLD.precio <> NEW.precio THEN
        INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_ser, 'UPDATE', 'Precio', FORMAT(OLD.precio, 0, 'es_CO'), FORMAT(NEW.precio, 0, 'es_CO'), IFNULL(modifier_name, 'Sistema'));
    END IF;
END$$

-- TRIGGER DE ELIMINACIÓN (DELETE)
CREATE TRIGGER trg_before_servicios_delete
BEFORE DELETE ON servicios
FOR EACH ROW
BEGIN
    DECLARE modifier_name VARCHAR(255);
    -- Busca el nombre del usuario que realiza la acción
    SELECT CONCAT(nombre, ' ', apellido) INTO modifier_name FROM usuarios WHERE id_usuario = @app_user_id;

    INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, usuario_db)
    VALUES (OLD.cod_ser, 'DELETE', 'Servicio Eliminado', CONCAT(
        'Nombre: ', OLD.nom_ser,
        ', Precio: ', FORMAT(OLD.precio, 0, 'es_CO')
    ), IFNULL(modifier_name, 'Sistema'));
END$$

DELIMITER ;