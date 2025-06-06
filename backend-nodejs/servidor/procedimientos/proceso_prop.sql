DELIMITER $$

CREATE PROCEDURE ObtenerPropietarios()
BEGIN
    SELECT p.id_pro, u.nombre, u.apellido, u.email, u.telefono
    FROM propietarios p
    JOIN usuarios u ON p.id_pro = u.id_usuario;
END$$

CREATE PROCEDURE ObtenerPropietarioPorId(
    IN p_id_pro INT
)
BEGIN
    SELECT p.id_pro, u.nombre, u.apellido, u.email, u.telefono, u.ciudad, u.direccion
    FROM propietarios p
    JOIN usuarios u ON p.id_pro = u.id_usuario
    WHERE p.id_pro = p_id_pro;
END$$

CREATE PROCEDURE EliminarPropietario(
    IN p_id_pro INT
)
BEGIN
    DELETE FROM propietarios WHERE id_pro = p_id_pro;
END$$

DELIMITER ;
