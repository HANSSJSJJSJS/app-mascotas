
DROP DATABASE mascotas_db;
CREATE DATABASE IF NOT EXISTS mascotas_db;
USE mascotas_db;

CREATE TABLE rol (
id_rol INT PRIMARY KEY NOT NULL ,
rol VARCHAR (50) NOT NULL
);

CREATE TABLE tipo_persona (
id_tipo INT PRIMARY KEY NOT NULL ,
tipo VARCHAR (50) NOT NULL
);

CREATE TABLE usuarios (
id_usuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
tipo_documento ENUM('CC','CE', 'PP') ,
numeroid VARCHAR(50) NOT NULL,
genero ENUM('Mujer','Hombre','No identificado'),
fecha_nacimiento DATE NOT NULL,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(30) NOT NULL,
telefono VARCHAR(20) NOT NULL,
ciudad VARCHAR(50) NOT NULL,
direccion VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
id_tipo INT NOT NULL,
id_rol INT NOT NULL,
FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
FOREIGN KEY (id_tipo) REFERENCES tipo_persona(id_tipo)
);

CREATE TABLE administradores (
id_admin INT PRIMARY KEY NOT NULL,
cargo VARCHAR(100) NOT NULL,
fecha_ingreso DATE NOT NULL,
FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE propietarios (
id_pro INT PRIMARY KEY NOT NULL,
FOREIGN KEY (id_pro) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE veterinarios (
id_vet INT PRIMARY KEY NOT NULL,
especialidad VARCHAR(100)NOT NULL,
horario VARCHAR(255)NOT NULL,
FOREIGN KEY (id_vet) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE mascotas (
cod_mas INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
nom_mas VARCHAR (100) NOT NULL,
especie VARCHAR (100) NOT NULL,
raza VARCHAR (100) NOT NULL,
edad DECIMAL (10,2) NOT NULL,
genero VARCHAR(25)NOT NULL,
peso DECIMAL (10,2) NOT NULL,
id_pro INT NOT NULL,
FOREIGN KEY (id_pro) references propietarios(id_pro)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
foto VARCHAR(255) NOT NULL
);

CREATE TABLE historiales_medicos(
cod_his INT NOT NULL AUTO_INCREMENT,
fech_his DATE NOT NULL,
descrip_his TEXT,
tratamiento TEXT,
cod_mas INT NOT NULL,
PRIMARY KEY(cod_his,cod_mas),
FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
);

CREATE TABLE servicios(
cod_ser INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nom_ser VARCHAR(100)NOT NULL,
descrip_ser TEXT,
precio DECIMAL (20,2)NOT NULL
);

CREATE TABLE citas (
  cod_cit INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  fech_cit DATE NOT NULL,
  hora TIME,
  cod_ser INT,
  id_vet INT,
  cod_mas INT,
  id_pro INT NOT NULL,
  estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA') NOT NULL DEFAULT 'PENDIENTE',
  notas TEXT,
  FOREIGN KEY (cod_ser) REFERENCES servicios(cod_ser),
  FOREIGN KEY (id_pro) REFERENCES propietarios(id_pro),
  FOREIGN KEY (id_vet) REFERENCES veterinarios(id_vet),
  FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
);


INSERT INTO tipo_persona (id_tipo, tipo) VALUES
(1, 'Invitado/Tutor'),
(2, 'Medico'),
(3, 'Auxiliar Veterinario'),
(4, 'Administrativo');

INSERT INTO Rol (id_rol, rol) VALUES
(1, 'Administrador'),
(2, 'Veterinario'),
(3, 'Propietario');

INSERT INTO usuarios (tipo_documento, numeroid, genero, fecha_nacimiento, nombre, apellido, telefono, ciudad, direccion, email, password_hash, id_tipo, id_rol)
VALUES
('CC', '1234567890', 'Hombre', '1990-01-01', 'Carlos', 'Ramírez', '3101234567', 'Bogotá', 'Calle 1 #1-1', 'carlos@example.com', 'hash1', 1, 3),
('CE', '2345678901', 'Mujer', '1985-02-02', 'Ana', 'López', '3112345678', 'Medellín', 'Carrera 2 #2-2', 'ana@example.com', 'hash2', 2, 2),
('PP', '3456789012', 'Hombre', '1978-03-03', 'Luis', 'García', '3123456789', 'Cali', 'Avenida 3 #3-3', 'luis@example.com', 'hash3', 2, 2),
('CC', '4567890123', 'Mujer', '1992-04-04', 'María', 'Fernández', '3134567890', 'Barranquilla', 'Calle 4 #4-4', 'maria@example.com', 'hash4', 1, 3),
('CE', '5678901234', 'No identificado', '1988-05-05', 'Alex', 'Torres', '3145678901', 'Cartagena', 'Carrera 5 #5-5', 'alex@example.com', 'hash5', 4, 1);


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
('Consulta General', 'Revisión médica general de la mascota', 40000.00),
('Vacunación', 'Aplicación de vacunas esenciales', 50000.00),
('Desparasitación', 'Tratamiento contra parásitos', 35000.00),
('Baño Médico', 'Baño con productos terapéuticos', 45000.00),
('Cirugía', 'Intervenciones quirúrgicas menores', 150000.00);

INSERT INTO citas (fech_cit, hora, cod_ser, id_vet, cod_mas, id_pro, estado, notas) VALUES
('2025-06-10', '09:00:00', 1, 2, 1, 1, 'CONFIRMADA', 'Chequeo inicial'),
('2025-06-12', '10:30:00', 2, 3, 2, 4, 'PENDIENTE', ''),
('2025-06-15', '08:00:00', 5, 2, 3, 1, 'PENDIENTE', 'Requiere cirugía'),
('2025-06-18', '11:00:00', 3, 3, 4, 1, 'REALIZADA', ''),
('2025-06-20', '13:00:00', 4, 2, 5, 4, 'CANCELADA', 'No asistió');
