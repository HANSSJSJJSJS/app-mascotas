DROP TRIGGER IF EXISTS after_usuario_insert;
DROP TRIGGER IF EXISTS before_usuario_update;
DROP TRIGGER IF EXISTS after_usuario_delete;

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
    IF OLD.tipo_documento <> NEW.tipo_documento THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'tipo_documento', OLD.tipo_documento, NEW.tipo_documento, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.numeroid <> NEW.numeroid THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'numeroid', OLD.numeroid, NEW.numeroid, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.genero <> NEW.genero THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'genero', OLD.genero, NEW.genero, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.fecha_nacimiento <> NEW.fecha_nacimiento THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'fecha_nacimiento', OLD.fecha_nacimiento, NEW.fecha_nacimiento, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.telefono <> NEW.telefono THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'telefono', OLD.telefono, NEW.telefono, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.ciudad <> NEW.ciudad THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'ciudad', OLD.ciudad, NEW.ciudad, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
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
    IF OLD.id_tipo <> NEW.id_tipo THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'id_tipo', OLD.id_tipo, NEW.id_tipo, 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF OLD.estado <> NEW.estado THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db) 
        VALUES(OLD.id_usuario, 'estado', IF(OLD.estado = 1, 'Activo', 'Inactivo'), IF(NEW.estado = 1, 'Activo', 'Inactivo'), 'UPDATE', IFNULL(modifier_name, 'Sistema'));
    END IF;
    IF NEW.password_hash IS NOT NULL AND NEW.password_hash != OLD.password_hash THEN
        INSERT INTO audit_usuarios(id_usuario, campo_modificado, valor_anterior, valor_nuevo, accion, usuario_db)
        VALUES(OLD.id_usuario, 'password_hash', '***', '***', 'UPDATE', IFNULL(modifier_name, 'Sistema'));
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