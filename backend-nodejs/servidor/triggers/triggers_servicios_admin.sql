DELIMITER $$

-- =================================================================
-- ==        TRIGGERS DE AUDITORÍA DE LA TABLA SERVICIOS        ==
-- =================================================================

-- ------ TRIGGER 1: Se activa DESPUÉS de INSERTAR un nuevo servicio ------
DROP TRIGGER IF EXISTS trg_after_servicios_insert$$

CREATE TRIGGER trg_after_servicios_insert
AFTER INSERT ON servicios
FOR EACH ROW
BEGIN
    INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_nuevo, usuario_db)
    VALUES (NEW.cod_ser, 'INSERT', 'Servicio Creado', CONCAT(
        'Nombre: ', NEW.nom_ser,
        ', Precio: ', FORMAT(NEW.precio, 0, 'es_CO'),
        ', Descripción: ', COALESCE(NEW.descrip_ser, 'N/A')
    ), CURRENT_USER());
END$$

-- ------ TRIGGER 2: Se activa DESPUÉS de ACTUALIZAR un servicio ------
DROP TRIGGER IF EXISTS trg_after_servicios_update$$

CREATE TRIGGER trg_after_servicios_update
AFTER UPDATE ON servicios
FOR EACH ROW
BEGIN
    -- Compara cada campo. Si ha cambiado, inserta un registro en la auditoría.
    
    IF OLD.nom_ser <> NEW.nom_ser THEN
        INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_ser, 'UPDATE', 'Nombre Servicio', OLD.nom_ser, NEW.nom_ser, CURRENT_USER());
    END IF;

    IF COALESCE(OLD.descrip_ser, '') <> COALESCE(NEW.descrip_ser, '') THEN
        INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_ser, 'UPDATE', 'Descripción', OLD.descrip_ser, NEW.descrip_ser, CURRENT_USER());
    END IF;

    IF OLD.precio <> NEW.precio THEN
        INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_ser, 'UPDATE', 'Precio', FORMAT(OLD.precio, 0, 'es_CO'), FORMAT(NEW.precio, 0, 'es_CO'), CURRENT_USER());
    END IF;
END$$

-- ------ TRIGGER 3: Se activa ANTES de ELIMINAR un servicio ------
DROP TRIGGER IF EXISTS trg_before_servicios_delete$$

CREATE TRIGGER trg_before_servicios_delete
BEFORE DELETE ON servicios
FOR EACH ROW
BEGIN
    INSERT INTO servicios_audit (cod_ser, accion, campo_modificado, valor_anterior, usuario_db)
    VALUES (OLD.cod_ser, 'DELETE', 'Servicio Eliminado', CONCAT(
        'Nombre: ', OLD.nom_ser,
        ', Precio: ', FORMAT(OLD.precio, 0, 'es_CO')
    ), CURRENT_USER());
END$$

DELIMITER ;