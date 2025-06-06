CREATE PROCEDURE CrearMascota(
    IN p_nom_mas VARCHAR(100),
    IN p_especie VARCHAR(100),
    IN p_raza VARCHAR(100),
    IN p_edad DECIMAL(10,2),
    IN p_genero VARCHAR(25),
    IN p_peso DECIMAL(10,2),
    IN p_id_pro INT,
    IN p_foto VARCHAR(255),
    OUT p_cod_mas INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO mascotas (nom_mas, especie, raza, edad, genero, peso, id_pro, foto)
    VALUES (p_nom_mas, p_especie, p_raza, p_edad, p_genero, p_peso, p_id_pro, p_foto);
    
    SET p_cod_mas = LAST_INSERT_ID();
    
    COMMIT;
END


CREATE PROCEDURE ObtenerMascotas()
BEGIN
    SELECT m.*, u.nom_mas AS nombre_propietario, u.apellido AS apellido_propietario
    FROM mascotas m
    JOIN propietarios p ON m.id_pro = p.id_pro
    JOIN usuarios u ON p.id_pro = u.id_usuario;
END

CREATE PROCEDURE ObtenerMascotasPorPropietario(
    IN p_id_pro INT
)
BEGIN
    SELECT * FROM mascotas WHERE id_pro= p_id_pro;
END


CREATE PROCEDURE ObtenerMascotaPorCodigo(
    IN p_cod_mas  INT
)
BEGIN
    SELECT m.*, u.nom_mas AS nombre_propietario, u.apellido AS apellido_propietario
    FROM mascotas m
    JOIN propietarios p ON m.id_pro = p.id_pro
    JOIN usuarios u ON p.id_pro = u.id_usuario
    WHERE m.cod_mas  = p_cod_mas ;
END

CREATE PROCEDURE ActualizarMascota(
    IN p_cod_mas  INT,
    IN p_nom_mas VARCHAR(100),
    IN p_especie VARCHAR(100),
    IN p_raza VARCHAR(100),
    IN p_edad DECIMAL(10,2),
    IN p_genero VARCHAR(25),
    IN p_peso DECIMAL(10,2),
    IN p_id_pro INT,
    IN p_foto VARCHAR(255)
)
BEGIN
    UPDATE mascotas SET
        nom_mas = p_nom_mas,
        especie = p_especie,
        raza = p_raza,
        edad = p_edad,
        genero = p_genero,
        peso = p_peso,
        id_pro = p_id_pro,
        foto = p_foto
    WHERE cod_mas  = p_cod_mas ;
END

CREATE PROCEDURE EliminarMascota(
    IN p_cod_mas INT
)
BEGIN
    DELETE FROM mascotas WHERE cod_mas = p_cod_mas;
END
