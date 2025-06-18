USE mascotas_db;
DELIMITER $$

-- =================================================================
-- ==          TRIGGERS DE AUDITORÍA DE LA TABLA CITAS            ==
-- =================================================================

-- ------ TRIGGER 1: Se activa DESPUÉS de ACTUALIZAR una cita  ------
DROP TRIGGER IF EXISTS trg_after_citas_update$$

CREATE TRIGGER trg_after_citas_update
AFTER UPDATE ON citas
FOR EACH ROW
BEGIN
    DECLARE old_val TEXT;
    DECLARE new_val TEXT;

    -- Compara cada campo importante. Si ha cambiado, busca los nombres y los inserta.

    IF OLD.fech_cit <> NEW.fech_cit THEN
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Fecha de la Cita', OLD.fech_cit, NEW.fech_cit, CURRENT_USER());
    END IF;

    IF OLD.hora <> NEW.hora THEN
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Hora de la Cita', OLD.hora, NEW.hora, CURRENT_USER());
    END IF;

    IF OLD.id_vet <> NEW.id_vet THEN
        -- Busca el nombre del veterinario anterior y el nuevo
        SELECT CONCAT(nombre, ' ', apellido) INTO old_val FROM usuarios WHERE id_usuario = OLD.id_vet;
        SELECT CONCAT(nombre, ' ', apellido) INTO new_val FROM usuarios WHERE id_usuario = NEW.id_vet;
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Veterinario', old_val, new_val, CURRENT_USER());
    END IF;

    IF OLD.cod_ser <> NEW.cod_ser THEN
        -- Busca el nombre del servicio anterior y el nuevo
        SELECT nom_ser INTO old_val FROM servicios WHERE cod_ser = OLD.cod_ser;
        SELECT nom_ser INTO new_val FROM servicios WHERE cod_ser = NEW.cod_ser;
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Servicio', old_val, new_val, CURRENT_USER());
    END IF;

    IF OLD.cod_mas <> NEW.cod_mas THEN
        -- Busca el nombre de la mascota anterior y la nueva
        SELECT nom_mas INTO old_val FROM mascotas WHERE cod_mas = OLD.cod_mas;
        SELECT nom_mas INTO new_val FROM mascotas WHERE cod_mas = NEW.cod_mas;
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Mascota', old_val, new_val, CURRENT_USER());
    END IF;

    IF OLD.estado <> NEW.estado THEN
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Estado de la Cita', OLD.estado, NEW.estado, CURRENT_USER());
    END IF;

    IF COALESCE(OLD.notas, '') <> COALESCE(NEW.notas, '') THEN
        INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, valor_nuevo, usuario_db)
        VALUES (OLD.cod_cit, 'UPDATE', 'Notas', OLD.notas, NEW.notas, CURRENT_USER());
    END IF;
END$$


-- ------ TRIGGER 2: Se activa DESPUÉS de INSERTAR una nueva cita  ------
DROP TRIGGER IF EXISTS trg_after_citas_insert$$

CREATE TRIGGER trg_after_citas_insert
AFTER INSERT ON citas
FOR EACH ROW
BEGIN
    DECLARE mascota_n TEXT;
    DECLARE pro_n TEXT;
    DECLARE vet_n TEXT;
    DECLARE ser_n TEXT;
    
    -- Busca los nombres correspondientes a los IDs insertados
    SELECT nom_mas INTO mascota_n FROM mascotas WHERE cod_mas = NEW.cod_mas;
    SELECT CONCAT(nombre, ' ', apellido) INTO pro_n FROM usuarios WHERE id_usuario = NEW.id_pro;
    SELECT CONCAT(nombre, ' ', apellido) INTO vet_n FROM usuarios WHERE id_usuario = NEW.id_vet;
    SELECT nom_ser INTO ser_n FROM servicios WHERE cod_ser = NEW.cod_ser;

    INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_nuevo, usuario_db)
    VALUES (NEW.cod_cit, 'INSERT', 'Cita Creada', CONCAT(
        'Fecha: ', DATE_FORMAT(NEW.fech_cit, '%d/%m/%Y'), ', Hora: ', TIME_FORMAT(NEW.hora, '%h:%i %p'),
        ', Mascota: ', mascota_n, ', Propietario: ', pro_n, ', Veterinario: ', vet_n,
        ', Servicio: ', ser_n, ', Estado: ', NEW.estado
    ), CURRENT_USER());
END$$


-- ------ TRIGGER 3: Se activa ANTES de ELIMINAR una cita  ------
DROP TRIGGER IF EXISTS trg_before_citas_delete$$

CREATE TRIGGER trg_before_citas_delete
BEFORE DELETE ON citas
FOR EACH ROW
BEGIN
    DECLARE mascota_n TEXT;
    DECLARE pro_n TEXT;
    DECLARE vet_n TEXT;
    DECLARE ser_n TEXT;
    
    -- Busca los nombres correspondientes a los IDs de la fila que se va a eliminar
    SELECT nom_mas INTO mascota_n FROM mascotas WHERE cod_mas = OLD.cod_mas;
    SELECT CONCAT(nombre, ' ', apellido) INTO pro_n FROM usuarios WHERE id_usuario = OLD.id_pro;
    SELECT CONCAT(nombre, ' ', apellido) INTO vet_n FROM usuarios WHERE id_usuario = OLD.id_vet;
    SELECT nom_ser INTO ser_n FROM servicios WHERE cod_ser = OLD.cod_ser;

    INSERT INTO citas_audit (cod_cit, accion, campo_modificado, valor_anterior, usuario_db)
    VALUES (OLD.cod_cit, 'DELETE', 'Cita Eliminada', CONCAT(
        'Fecha: ', DATE_FORMAT(OLD.fech_cit, '%d/%m/%Y'), ', Hora: ', TIME_FORMAT(OLD.hora, '%h:%i %p'),
        ', Mascota: ', mascota_n, ', Propietario: ', pro_n, ', Veterinario: ', vet_n,
        ', Servicio: ', ser_n, ', Estado: ', OLD.estado
    ), CURRENT_USER());
END$$

DELIMITER ;