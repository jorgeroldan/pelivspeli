CREATE TABLE `competencia` (
  `id` int(11) unsigned AUTO_INCREMENT NOT NULL ,
  `nombre` varchar(70) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO competencia (nombre) value ('mejor pelicula');


-- Obtener 2 peliculas random
select * from pelicula  order by rand() limit 2;