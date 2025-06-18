-- 1. OBTENER TODAS LAS MASCOTAS (con información del propietario)
SELECT 
    m.cod_mas,
    m.nom_mas,
    m.especie,
    m.raza,
    m.edad,
    m.genero,
    m.peso,
    m.color,
    m.notas,
    m.ultima_visita,
    m.proxima_cita,
    m.vacunado,
    m.esterilizado,
    m.activo,
    m.id_pro,
    m.foto,
    p.nombre AS nombre_propietario,
    p.apellido AS apellido_propietario,
    p.telefono AS telefono_propietario,
    p.email AS email_propietario,
    p.direccion AS direccion_propietario
FROM mascotas m
LEFT JOIN propietarios p ON m.id_pro = p.id_pro
WHERE m.activo = true
ORDER BY m.nom_mas;

-- 2. OBTENER UNA MASCOTA POR ID
SELECT 
    m.*,
    p.nombre AS nombre_propietario,
    p.apellido AS apellido_propietario,
    p.telefono AS telefono_propietario,
    p.email AS email_propietario,
    p.direccion AS direccion_propietario
FROM mascotas m
LEFT JOIN propietarios p ON m.id_pro = p.id_pro
WHERE m.cod_mas = ?;

-- 3. INSERTAR NUEVA MASCOTA
INSERT INTO mascotas (
    nom_mas, especie, raza, edad, genero, peso, color, 
    notas, ultima_visita, proxima_cita, vacunado, 
    esterilizado, activo, id_pro, foto
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- 4. ACTUALIZAR MASCOTA
UPDATE mascotas SET 
    nom_mas = ?,
    especie = ?,
    raza = ?,
    edad = ?,
    genero = ?,
    peso = ?,
    color = ?,
    notas = ?,
    ultima_visita = ?,
    proxima_cita = ?,
    vacunado = ?,
    esterilizado = ?,
    activo = ?,
    id_pro = ?,
    foto = ?
WHERE cod_mas = ?;

-- 5. ELIMINAR MASCOTA (soft delete)
UPDATE mascotas SET activo = false WHERE cod_mas = ?;

-- 6. ELIMINAR MASCOTA (hard delete)
DELETE FROM mascotas WHERE cod_mas = ?;

-- 7. CAMBIAR ESTADO DE MASCOTA
UPDATE mascotas SET activo = ? WHERE cod_mas = ?;
