DELIMITER $$

-- Trigger para INSERT
CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    DECLARE modifier_name VARCHAR(255);
    -- Busca el nombre del usuario que modifica a partir de la variable de sesión
    SELECT CONCAT(nombre, ' ', apellido) INTO modifier_name FROM usuarios WHERE id_usuario = @app_user_id;
    
    INSERT INTO audit_usuarios (id_usuario, campo_modificado, valor_nuevo, accion, usuario_db)
    VALUES (NEW.id_usuario, 'Creación de Usuario', CONCAT('Usuario creado: ', NEW.nombre, ' ', NEW.apellido), 'INSERT', IFNULL(modifier_name, 'Sistema'));
END$$

-- Trigger para UPDATE
CREATE TRIGGER before_usuario_update
BEFORE UPDATE ON usuarios
FOR EACH ROW
BEGIN
    DECLARE modifier_name VARCHAR(255);
    -- Busca el nombre del usuario que modifica a partir de la variable de sesión
    SELECT CONCAT(nombre, ' ', apellido) INTO modifier_name FROM usuarios WHERE id_usuario = @app_user_id;

    -- Comprobamos cada campo para registrar el cambio
    IF OLD.nombre <> NEW.nombre THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'nombre', OLD.nombre, NEW.nombre, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.apellido <> NEW.apellido THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'apellido', OLD.apellido, NEW.apellido, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.email <> NEW.email THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'email', OLD.email, NEW.email, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.telefono <> NEW.telefono THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'telefono', OLD.telefono, NEW.telefono, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.direccion <> NEW.direccion THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'direccion', OLD.direccion, NEW.direccion, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
     IF OLD.barrio <> NEW.barrio THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'barrio', OLD.barrio, NEW.barrio, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.id_rol <> NEW.id_rol THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'id_rol', OLD.id_rol, NEW.id_rol, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.estado <> NEW.estado THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'estado', IF(OLD.estado = 1, 'Activo', 'Inactivo'), IF(NEW.estado = 1, 'Activo', 'Inactivo'), 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
END$$

-- Trigger para DELETE
CREATE TRIGGER after_usuario_delete
AFTER DELETE ON usuarios
FOR EACH ROW
BEGIN
    DECLARE modifier_name VARCHAR(255);
    -- Busca el nombre del usuario que modifica a partir de la variable de sesión
    SELECT CONCAT(nombre, ' ', apellido) INTO modifier_name FROM usuarios WHERE id_usuario = @app_user_id;

    INSERT INTO audit_usuarios (id_usuario, campo_modificado, valor_anterior, accion, usuario_db)
    VALUES (OLD.id_usuario, 'Eliminación de Usuario', CONCAT('Usuario eliminado: ', OLD.nombre, ' ', OLD.apellido), 'DELETE', IFNULL(modifier_name, 'Sistema'));
END$$

DELIMITER ;