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
id_us
uario INT PRIMARY KEY NOT NULL,
cargo VARCHAR(100) NOT NULL,
fecha_ingreso DATE NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE propietarios (
id_usuario INT PRIMARY KEY NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE veterinarios (
id_usuario INT PRIMARY KEY NOT NULL,
especialidad VARCHAR(100)NOT NULL,
horario VARCHAR(255)NOT NULL,
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE mascotas (
codigo INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
nombre VARCHAR (100) NOT NULL,
especie VARCHAR (100) NOT NULL,
raza VARCHAR (100) NOT NULL,
edad DECIMAL (10,2) NOT NULL,
peso DECIMAL (10,2) NOT NULL,
id_usuario INT NOT NULL,
FOREIGN KEY (id_usuario) references propietarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
foto VARCHAR(255) NOT NULL
);

CREATE TABLE historiales_medicos(
codigo INT NOT NULL AUTO_INCREMENT,
fecha DATE NOT NULL,
descripcion TEXT,
tratamiento TEXT,
codigo_mascota INT NOT NULL,
PRIMARY KEY(codigo,codigo_mascota),
FOREIGN KEY (codigo_mascota) REFERENCES mascotas(codigo)
);

CREATE TABLE servicios(
codigo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100)NOT NULL,
descripcion TEXT,
precio DECIMAL (20,2)NOT NULL
);

CREATE TABLE citas (
  codigo INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  fecha DATE NOT NULL,
  hora TIME,
  id_servicio INT,
  id_veterinario INT,
  codigo_mascota INT,
  id_usuario INT NOT NULL,
  estado ENUM('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'REALIZADA', 'NO_ASISTIDA') NOT NULL DEFAULT 'PENDIENTE',
  notas TEXT,
  FOREIGN KEY (id_servicio) REFERENCES servicios(codigo),
  FOREIGN KEY (id_usuario) REFERENCES propietarios(id_usuario),
  FOREIGN KEY (id_veterinario) REFERENCES veterinarios(id_usuario),
  FOREIGN KEY (codigo_mascota) REFERENCES mascotas(codigo)
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
