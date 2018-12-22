CREATE TABLE `competencia` (
  `id` int(11) unsigned AUTO_INCREMENT NOT NULL ,
  `nombre` varchar(70) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO competencia (nombre) value ('mejor pelicula');


-- Obtener 2 peliculas random
select * from pelicula  order by rand() limit 2;


--Crear tabla para acumular votos

CREATE TABLE `voto_pelicula` (
  `id` int(11) unsigned AUTO_INCREMENT NOT NULL ,
  `competencia_id` int NOT NULL, 
  `pelicula_id` int NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

select count (*) from voto where competencia_id = tuVariable group by pelicula_id order by 1 desc