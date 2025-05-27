DROP DATABASE mascotas_db;
CREATE DATABASE IF NOT EXISTS mascotas_db;
USE mascotas_db;

CREATE TABLE rol (
id_rol INT(11) PRIMARY KEY NOT NULL ,
rol VARCHAR (50) NOT NULL
);

CREATE TABLE tipo_persona (
id_tipo INT(11) PRIMARY KEY NOT NULL ,
tipo VARCHAR (50) NOT NULL
);

CREATE TABLE usuarios (
id_usuario INT PRIMARY KEY NOT NULL,
tipo_doc ENUM('C.C','C.E','PP') ,
numeroid VARCHAR(20)NOT NULL UNIQUE,
genero ENUM('FEMENINO','MASCULINO','NO IDENTIFICADO'),
fecha_nacimiento DATE NOT NULL,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(30) NOT NULL,
ciudad VARCHAR(50) NOT NULL,
direccion VARCHAR(100) NOT NULL,
telefono VARCHAR(20) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
fecha_registri TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
acivo BOOLEAN DEFAULT TRUE,
id_tipo INT(11) NOT NULL,
id_rol INT(11) NOT NULL,
FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
FOREIGN KEY (id_tipo) REFERENCES tipo_persona(id_tipo)
);

CREATE TABLE administradores (
id_admin INT PRIMARY KEY NOT NULL,
cargo VARCHAR(100) NOT NULL,
fecha_ing DATE NOT NULL,
FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

CREATE TABLE propietarios (
id_prop INT PRIMARY KEY NOT NULL,
FOREIGN KEY (id_prop) REFERENCES usuarios(id_usuario)
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
imagen VARCHAR(255),
nom_mas VARCHAR (100) NOT NULL,
especie VARCHAR (100) NOT NULL,
raza VARCHAR (100) NOT NULL,
edad DECIMAL (10,2) NOT NULL,
genero ENUM('Hembra', 'Macho')NOT NULL,
peso DECIMAL (10,2) NOT NULL,
id_prop INT NOT NULL,
FOREIGN KEY (id_prop) references propietarios(id_prop)
ON DELETE NO ACTION
ON UPDATE NO ACTION,
foto VARCHAR(255) NOT NULL
);

CREATE TABLE historiales_medicos(
cod_his INT NOT NULL AUTO_INCREMENT,
fecha DATE NOT NULL,
descripcion TEXT,
tratamiento TEXT,
cod_mas INT NOT NULL,
PRIMARY KEY(cod_his,cod_mas),
FOREIGN KEY (cod_mas) REFERENCES mascotas(cod_mas)
);

CREATE TABLE servicios(
cod_ser INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nom_ser VARCHAR(100)NOT NULL,
descripcion TEXT,
precio DECIMAL (20,2)NOT NULL
);

CREATE TABLE citas (
  cod_cit INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  mascota VARCHAR(30)NOT NULL,
  fecha DATE NOT NULL,
  hora TIME,
  cod_ser INT,
  id_vet INT,
  cod_mas INT,
  id_prop INT NOT NULL,
  notas_adicionales TEXT,
  FOREIGN KEY (cod_ser) REFERENCES servicios(cod_ser),
  FOREIGN KEY (id_prop) REFERENCES propietarios(id_prop),
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
