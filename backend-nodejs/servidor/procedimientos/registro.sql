DELIMITER $$

CREATE PROCEDURE InsertarUsuarioYPropietario (
  IN p_tipo_documento ENUM('CC','CE','PP'),
  IN p_nombre VARCHAR(50),
  IN p_apellido VARCHAR(30),
  IN p_ciudad VARCHAR(50),
  IN p_direccion VARCHAR(100),
  IN p_telefono VARCHAR(20),
  IN p_fecha_nacimiento DATE,
  IN p_email VARCHAR(100),
  IN p_password_hash VARCHAR(255),
  IN p_id_tipo INT,
  IN p_id_rol INT
)
BEGIN
  -- Insertar en la tabla usuarios sin id_usuario (AUTO_INCREMENT)
  INSERT INTO usuarios (
    tipo_documento, nombre, apellido, ciudad, direccion, telefono, 
    fecha_nacimiento, email, password_hash, id_tipo, id_rol
  ) VALUES (
    p_tipo_documento, p_nombre, p_apellido, p_ciudad, p_direccion,
    p_telefono, p_fecha_nacimiento, p_email, p_password_hash, p_id_tipo, p_id_rol
  );

  -- Obtener el id_usuario generado
  DECLARE v_id_usuario INT;
  SET v_id_usuario = LAST_INSERT_ID();

  -- Insertar en propietarios solo si el rol es 3 (propietario)
  IF p_id_rol = 3 THEN
    INSERT INTO propietarios (id_pro) VALUES (v_id_usuario);
  END IF;
  
END$$

DELIMITER ;
