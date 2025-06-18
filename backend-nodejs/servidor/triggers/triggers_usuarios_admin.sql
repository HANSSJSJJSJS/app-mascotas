DELIMITER $$
CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO audit_usuarios (id_usuario, campo_modificado, valor_nuevo, accion)
    VALUES (NEW.id_usuario, 'Creación de Usuario', CONCAT('Usuario creado: ', NEW.nombre, ' ', NEW.apellido, ' (', NEW.email, ')'), 'INSERT');
END$$
DELIMITER ;

-- 3. Trigger para registrar actualizaciones de usuarios
DELIMITER $$
CREATE TRIGGER before_usuario_update
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF OLD.nombre <> NEW.nombre THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'nombre', OLD.nombre, NEW.nombre, 'UPDATE');
    END IF;
    IF OLD.apellido <> NEW.apellido THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'apellido', OLD.apellido, NEW.apellido, 'UPDATE');
    END IF;
    IF OLD.email <> NEW.email THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'email', OLD.email, NEW.email, 'UPDATE');
    END IF;
    IF OLD.telefono <> NEW.telefono THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'telefono', OLD.telefono, NEW.telefono, 'UPDATE');
    END IF;
    IF OLD.direccion <> NEW.direccion THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'direccion', OLD.direccion, NEW.direccion, 'UPDATE');
    END IF;
    IF OLD.id_rol <> NEW.id_rol THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'id_rol', OLD.id_rol, NEW.id_rol, 'UPDATE');
    END IF;
    IF OLD.estado <> NEW.estado THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion) 
        VALUES(OLD.id_usuario, 'estado', IF(OLD.estado = 1, 'Activo', 'Inactivo'), IF(NEW.estado = 1, 'Activo', 'Inactivo'), 'UPDATE');
    END IF;
    -- Puedes agregar más campos aquí si lo necesitas
END$$
DELIMITER ;

-- 4. Trigger para registrar eliminaciones de usuarios
DELIMITER $$
CREATE TRIGGER after_usuario_delete
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO audit_usuarios (id_usuario, campo_modificado, valor_anterior, accion)
    VALUES (OLD.id_usuario, 'Eliminación de Usuario', CONCAT('Usuario eliminado: ', OLD.nombre, ' ', OLD.apellido, ' (ID: ', OLD.id_usuario, ')'), 'DELETE');
END$$
DELIMITER ;