DELIMITER $$

CREATE PROCEDURE VerificarSiEsPropietario(
  IN p_id_pro INT
)
BEGIN
  DECLARE es_propietario INT DEFAULT 0;

  SELECT COUNT(*) INTO es_propietario
  FROM usuarios
  WHERE id_usuario = p_id_pro
    AND id_rol = 3;

  IF es_propietario > 0 THEN
    SELECT 'ES_PROPIETARIO' AS resultado;
  ELSE
    SELECT 'NO_ES_PROPIETARIO' AS resultado;
  END IF;
END$$

CREATE PROCEDURE VerificarSiEsAdministrador(
  IN p_id_admin INT
)
BEGIN
  DECLARE es_administrador INT DEFAULT 0;

  SELECT COUNT(*) INTO es_administrador
  FROM usuarios
  WHERE id_usuario = p_id_admin
    AND id_rol = 1;

  IF es_administrador > 0 THEN
    SELECT 'ES_ADMINISTRADOR' AS resultado;
  ELSE
    SELECT 'NO_ES_ADMINISTRADOR' AS resultado;
  END IF;
END$$

DELIMITER ;
