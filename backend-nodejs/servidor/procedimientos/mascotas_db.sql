ALTER TABLE usuarios ADD COLUMN foto_perfil VARCHAR(255) NULL;

-- Eliminar la base de datos si existe
DROP DATABASE IF EXISTS mascotas_db;

-- Crear la base de datos
CREATE DATABASE  mascotas_db;

-- Usar la base de datos
USE mascotas_db;

-- Tabla de roles de usuarios
CREATE TABLE rol (
    id_rol INT PRIMARY KEY NOT NULL COMMENT 'Identificador único del rol',
    rol VARCHAR(50) NOT NULL COMMENT 'Nombre del rol (Administrador, Veterinario, Propietario)'
) COMMENT 'Tabla de roles de usuarios en el sistema';

-- Tabla de tipos de persona
CREATE TABLE tipo_persona (
    id_tipo INT PRIMARY KEY NOT NULL COMMENT 'Identificador único del tipo de persona',
    tipo VARCHAR(50) NOT NULL COMMENT 'Tipo de persona (Natural, Jurídica)'
) COMMENT 'Tabla de tipos de persona (natural o jurídica)';

-- Tabla principal de usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del usuario',
    tipo_documento ENUM('CC','CE','PP') COMMENT 'Tipo de documento (Cédula, Cédula extranjería, Pasaporte)',
    numeroid VARCHAR(50) NOT NULL COMMENT 'Número de identificación del usuario',
    genero ENUM('Mujer','Hombre','No identificado') COMMENT 'Género del usuario',
    fecha_nacimiento DATE NOT NULL COMMENT 'Fecha de nacimiento del usuario',
    nombre VARCHAR(50) NOT NULL COMMENT 'Primer nombre del usuario',
    apellido VARCHAR(30) NOT NULL COMMENT 'Apellido(s) del usuario',
    telefono VARCHAR(20) NOT NULL COMMENT 'Número de teléfono del usuario',
    ciudad VARCHAR(50) NOT NULL COMMENT 'Ciudad de residencia del usuario',
    barrio VARCHAR(50) NOT NULL COMMENT 'Barrio de residencia del usuario',
    direccion VARCHAR(100) NOT NULL COMMENT 'Dirección completa del usuario',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Correo electrónico del usuario (único)',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada del usuario',
    id_tipo INT NOT NULL COMMENT 'Referencia al tipo de persona',
    id_rol INT NOT NULL COMMENT 'Referencia al rol del usuario',
    estado TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Estado del usuario (1=activo, 0=inactivo)',
    foto_perfil VARCHAR(255) NULL COMMENT 'URL o ruta de la foto de perfil del usuario',
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    FOREIGN KEY (id_tipo) REFERENCES tipo_persona(id_tipo)
) COMMENT 'Tabla maestra de usuarios del sistema';

-- Tabla de administradores
CREATE TABLE administradores (
    id_admin INT PRIMARY KEY NOT NULL COMMENT 'Identificador del administrador (FK a usuarios)',
    cargo VARCHAR(100) NOT NULL COMMENT 'Cargo o posición del administrador',
    fecha_ingreso DATE NOT NULL COMMENT 'Fecha de ingreso del administrador',
    FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) COMMENT 'Tabla de información específica de administradores';

-- Tabla de propietarios
CREATE TABLE propietarios (
    id_pro INT PRIMARY KEY NOT NULL COMMENT 'Identificador del propietario (FK a usuarios)',
    FOREIGN KEY (id_pro) REFERENCES usuarios(id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) COMMENT 'Tabla de propietarios de mascotas';

-- Tabla de veterinarios
CREATE TABLE veterinarios (
    id_vet INT PRIMARY KEY NOT NULL COMMENT 'Identificador del veterinario (FK a usuarios)',
    especialidad VARCHAR(100) NOT NULL COMMENT 'Especialidad del veterinario',
    horario VARCHAR(255) NOT NULL COMMENT 'Horario de trabajo del veterinario',
    FOREIGN KEY (id_vet) REFERENCES usuarios(id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) COMMENT 'Tabla de información específica de veterinarios';

-- Tabla de mascotas
CREATE TABLE mascotas (
    cod_mas INT PRIMARY KEY NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la mascota',
    nom_mas VARCHAR(100) NOT NULL COMMENT 'Nombre de la mascota',
    especie VARCHAR(100) NOT NULL COMMENT 'Especie (perro, gato, etc.)',
    raza VARCHAR(100) NOT NULL COMMENT 'Raza de la mascota',
    edad DECIMAL(10,2) NOT NULL COMMENT 'Edad en años',
    genero VARCHAR(25) NOT NULL COMMENT 'Género de la mascota',
    peso DECIMAL(10,2) NOT NULL COMMENT 'Peso en kilogramos',
    color VARCHAR(50) COMMENT 'Color principal',
    notas TEXT COMMENT 'Notas adicionales',
    ultima_visita DATE COMMENT 'Fecha última visita',
    proxima_cita DATE COMMENT 'Fecha próxima cita',
    vacunado BOOLEAN DEFAULT false COMMENT '¿Está vacunada?',
    esterilizado BOOLEAN DEFAULT false COMMENT '¿Está esterilizada?',
    activo BOOLEAN DEFAULT true COMMENT '¿Registro activo?',
    fecha DATE COMMENT 'Fecha de registro',
    hora TIME COMMENT 'Hora de registro',
    id_pro INT NOT NULL COMMENT 'Referencia al propietario',
    foto VARCHAR(255) NOT NULL COMMENT 'URL/ruta de la foto',
    FOREIGN KEY (id_pro) REFERENCES propietarios(id_pro)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) COMMENT 'Tabla de registro de mascotas';

-- Tabla de historiales médicos
CREATE TABLE historiales_medicos (
    cod_his INT NOT NULL AUTO_INCREMENT COMMENT 'ID único del registro médico',
    fech_his DATE NOT NULL COMMENT 'Fecha del registro',
    descrip_his TEXT COMMENT 'Descripción del problema/diagnóstico',
    tratamiento TEXT COMMENT 'Tratamiento aplicado/recomendado',
    cod_mas INT NOT NULL COMMENT 'Referencia a la mascota',
    PRIMARY KEY(cod_his, cod_mas),
    FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
) COMMENT 'Tabla de historiales médicos de mascotas';

-- Tabla de servicios
CREATE TABLE servicios (
    cod_ser INT NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'ID único del servicio',
    nom_ser VARCHAR(100) NOT NULL COMMENT 'Nombre del servicio',
    descrip_ser TEXT COMMENT 'Descripción detallada',
    precio DECIMAL(20,2) NOT NULL COMMENT 'Precio del servicio'
) COMMENT 'Tabla de servicios ofrecidos';

-- Tabla de citas
CREATE TABLE citas (
    cod_cit INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'ID único de la cita',
    fech_cit DATE NOT NULL COMMENT 'Fecha programada',
    hora TIME COMMENT 'Hora programada',
    cod_ser INT COMMENT 'Servicio solicitado',
    id_vet INT COMMENT 'Veterinario asignado',
    cod_mas INT COMMENT 'Mascota asociada',
    id_pro INT NOT NULL COMMENT 'Propietario que solicita',
    estado ENUM('PENDIENTE','CONFIRMADA','CANCELADA','REALIZADA','NO_ASISTIDA') 
        NOT NULL DEFAULT 'PENDIENTE' COMMENT 'Estado de la cita',
    notas TEXT COMMENT 'Notas adicionales',
    FOREIGN KEY (cod_ser) REFERENCES servicios(cod_ser),
    FOREIGN KEY (id_pro) REFERENCES propietarios(id_pro),
    FOREIGN KEY (id_vet) REFERENCES veterinarios(id_vet),
    FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
) COMMENT 'Tabla de programación de citas';

-- Tabla de auditoría para citas
CREATE TABLE citas_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de auditoría',
    cod_cit INT COMMENT 'Cita auditada',
    accion VARCHAR(10) NOT NULL COMMENT 'Acción (INSERT, UPDATE, DELETE)',
    campo_modificado VARCHAR(100) COMMENT 'Campo modificado',
    valor_anterior TEXT COMMENT 'Valor anterior',
    valor_nuevo TEXT COMMENT 'Valor nuevo',
    usuario_db VARCHAR(100) COMMENT 'Usuario que realizó el cambio',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha/hora del cambio'
) COMMENT 'Auditoría para cambios en citas';

-- Tabla de auditoría para servicios
CREATE TABLE servicios_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de auditoría',
    cod_ser INT COMMENT 'Servicio auditado',
    accion VARCHAR(10) NOT NULL COMMENT 'Acción realizada',
    campo_modificado VARCHAR(100) COMMENT 'Campo modificado',
    valor_anterior TEXT COMMENT 'Valor anterior',
    valor_nuevo TEXT COMMENT 'Valor nuevo',
    usuario_db VARCHAR(100) COMMENT 'Usuario del cambio',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha/hora'
) COMMENT 'Auditoría para cambios en servicios';

-- Tabla de auditoría para usuarios
CREATE TABLE audit_usuarios (
    audit_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único de auditoría',
    id_usuario INT NOT NULL COMMENT 'Usuario auditado',
    campo_modificado VARCHAR(255) NOT NULL COMMENT 'Campo modificado',
    valor_anterior TEXT COMMENT 'Valor anterior',
    valor_nuevo TEXT COMMENT 'Valor nuevo',
    accion ENUM('INSERT','UPDATE','DELETE') NOT NULL COMMENT 'Tipo de acción',
    usuario_db VARCHAR(255) NOT NULL COMMENT 'Usuario que realizó el cambio',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha/hora'
) COMMENT 'Auditoría para cambios en usuarios';


INSERT INTO tipo_persona (id_tipo, tipo) VALUES
(1, 'Invitado/Tutor'),
(2, 'Medico'),
(3, 'Auxiliar Veterinario'),
(4, 'Administrativo');

INSERT INTO Rol (id_rol, rol) VALUES
(1, 'Administrador'),
(2, 'Veterinario'),
(3, 'Propietario');

INSERT INTO usuarios (tipo_documento, numeroid, genero, fecha_nacimiento, nombre, apellido, telefono, ciudad, barrio, direccion, email, password_hash, id_tipo, id_rol)
VALUES
('CC', '1234567890', 'Hombre', '1990-01-01', 'Carlos', 'Ramírez', '3101234567', 'Bogotá', 'Chapinero', 'Calle 1 #1-1', 'carlos@example.com', 'Hans1986@', 1, 3),
('CE', '2345678901', 'Mujer', '1985-02-02', 'Ana', 'López', '3112345678', 'Medellín', 'El Poblado', 'Carrera 2 #2-2', 'ana@example.com', 'Hans1986@', 2, 2),
('PP', '3456789012', 'Hombre', '1978-03-03', 'Luis', 'García', '3123456789', 'Cali', 'San Fernando', 'Avenida 3 #3-3', 'luis@example.com', 'Hans1986@', 2, 2),
('CC', '4567890123', 'Mujer', '1992-04-04', 'María', 'Fernández', '3134567890', 'Barranquilla', 'Alameda', 'Calle 4 #4-4', 'maria@example.com', 'Hans1986@', 1, 3),
('CE', '5678901234', 'No identificado', '1988-05-05', 'Alex', 'Torres', '3145678901', 'Cartagena', 'Bocagrande', 'Carrera 5 #5-5', 'alex@example.com', 'Hans1986@', 4, 1);


INSERT INTO administradores (id_admin, cargo, fecha_ingreso)
VALUES
(5, 'Gerente General', '2022-01-01');


INSERT INTO propietarios (id_pro) VALUES
(1),
(4);

INSERT INTO veterinarios (id_vet, especialidad, horario)
VALUES
(2, 'Cirugía general', 'Lunes a Viernes 08:00 - 16:00'),
(3, 'Dermatología animal', 'Martes y Jueves 09:00 - 17:00');

INSERT INTO mascotas (nom_mas, especie, raza, edad, genero, peso, id_pro, foto) VALUES
('Luna', 'Perro', 'Labrador', 4.0, 'Hembra', 25.5, 1, 'luna.jpg'),
('Max', 'Gato', 'Siamés', 2.5, 'Macho', 4.2, 4, 'max.jpg'),
('Toby', 'Conejo', 'Mini Lop', 1.0, 'Macho', 2.1, 1, 'toby.jpg'),
('Nina', 'Perro', 'Poodle', 3.0, 'Hembra', 8.5, 1, 'nina.jpg'),
('Milo', 'Gato', 'Persa', 1.5, 'Macho', 3.9, 4, 'milo.jpg');

INSERT INTO historiales_medicos (fech_his, descrip_his, tratamiento, cod_mas) VALUES
('2024-01-10', 'Chequeo general', 'Vacunación y desparasitación', 1),
('2024-02-15', 'Problemas digestivos', 'Dieta especial', 2),
('2024-03-01', 'Herida leve en pata', 'Antibióticos y curación', 3),
('2024-03-20', 'Vacunación anual', 'Vacuna triple', 4),
('2024-04-05', 'Infección ocular', 'Colirio y seguimiento', 5);



INSERT INTO servicios (nom_ser, descrip_ser, precio) VALUES 
("Consulta veterinaria", "Revisión de cola a cabeza:", 87599.00),
("Baño y peluquería", "Siempre limpio, nunca inlimpio: Servicio de baño y peluquería para todos los tamaños y todos los tipos de pelo. También puede realizarse un baño medicado de ser necesario para el paciente.", 45000.00),
("SERVICIO VACUNACION", "¡Mascota vacunada vale por 2! La vacunación en cachorros ayuda a generar anticuerpos contra las principales enfermedades. Para las mascotas mayores de 1 año de edad se realiza un refuerzo anual. Incluye valoración inicial.", 27600.00),
("Otro servicio", "Otros servicios veterinarios disponibles.", 35000.00),
("Telemedicina (Virtual)", "Consulta veterinaria virtual desde la comodidad de tu hogar.", 50000.00);


INSERT INTO citas (fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas) VALUES
('2025-06-10', '09:00:00', 1, 2, 1, 1, 'CONFIRMADA', 'Chequeo inicial'),
('2025-06-12', '10:30:00', 2, 3, 2, 4, 'PENDIENTE', ''),
('2025-06-15', '08:00:00', 5, 2, 3, 1, 'PENDIENTE', 'Requiere cirugía'),
('2025-06-18', '11:00:00', 3, 3, 4, 1, 'REALIZADA', ''),
('2025-06-20', '13:00:00', 4, 2, 5, 4, 'CANCELADA', 'No asistió');


select * from citas_audit;
select * from citas;

select * from servicios_audit;
SELECT cod_mas, nom_mas, foto FROM mascotas WHERE cod_mas = 1;