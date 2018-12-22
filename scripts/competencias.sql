CREATE TABLE competencia (id int NOT NULL AUTO_INCREMENT, nombre varchar(200), PRIMARY KEY(id));

INSERT INTO competencia (nombre) VALUES ("La más divertida");
INSERT INTO competencia (nombre) VALUES ("La más aburrida");
INSERT INTO competencia (nombre) VALUES ("Para ver con amigos");
INSERT INTO competencia (nombre) VALUES ("Para ver con tu pareja");
INSERT INTO competencia (nombre) VALUES ("Tu lista");

SELECT * FROM competencia;
