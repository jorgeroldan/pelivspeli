const con_db = require('../lib/conexion_bd');

const controlador = {
    listarCompetencias: (req, res) => {
        const sql = "select * from competencia"
        con_db.query(sql, (error, resultado) => {
            if (error) {
                console.log("Chann hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado));
        });
    },
    listarCompetenciaId: (req, res) => {
        let idCompetencia = req.params.id
        const sql = `select * from competencia where ${idCompetencia}`
        con_db.query(sql, (error, resultado) => {
            if (error) {
                console.log("Chann hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            const response = {
                id: resultado[0].id
            }
            res.send(JSON.stringify(response.id));
        });
    },
    nuevaCompetencia: (req, res) => {
        let nombreCompetencia = req.body.nombre;
        if (!nombreCompetencia) {
            console.log("Debe completar el nombre de la competencia");
            return res.status(422).send("Debe completar el nombre de la competencia");
        }
        let generoCompetencia = req.body.genero;
        let directorCompetencia = req.body.director;
        let actorCompetencia = req.body.actor;
        let nombreRepetido = false;
        let sql = `INSERT INTO competencia (nombre) VALUES ('${nombreCompetencia}');`;
        let sqlCompetencia = `SELECT * FROM competencia WHERE nombre = "${nombreCompetencia}"`;

        con_db.query(sqlCompetencia, (error, resultado, fields) => {
            if (error) {
                return res.status(500).send("Hubo un error en el servidor");
            }

            if (resultado.length === 1) {
                nombreRepetido = true;
                console.log("Ya hay una competencia con este nombre");
                return res.status(422).send("Ya hay una competencia con este nombre");
            }

            if (!nombreRepetido) {
                con_db.query(sql, (error, resultado) => {
                    if (error) {
                        console.log("Hubo un error en el servidor")
                        return res.status(500).send("Hubo un error en el servidor");
                    }
                    if (generoCompetencia > 0) {
                        let sqlGenero = `UPDATE competencia SET genero_id = ${generoCompetencia} WHERE nombre = '${nombreCompetencia}';`;
                        console.log(`sqlGenero`, sqlGenero)
                        con_db.query(sqlGenero, (errorGenero, resultadoGenero) => {
                            if (errorGenero) {
                                console.log("Hubo un error en el servidor // genero")
                                return res.status(500).send("Hubo un error en el servidor");
                            }
                        });
                    }
                    if (directorCompetencia > 0) {
                        let sqlDirector = `UPDATE competencia SET director_id = ${directorCompetencia} WHERE nombre = '${nombreCompetencia}';`;
                        con_db.query(sqlDirector, (errorDirector, resultadoDirector) => {
                            if (errorDirector) {
                                console.log("Hubo un error en el servidor // director")
                                return res.status(500).send("Hubo un error en el servidor");
                            }
                        });
                    }
                    if (actorCompetencia > 0) {
                        let sqlActor = `UPDATE competencia SET actor_id = ${actorCompetencia} WHERE nombre = '${nombreCompetencia}';`;
                        con_db.query(sqlActor, (errorActor, resultadoActor) => {
                            if (errorActor) {
                                console.log("Hubo un error en el servidor // actor")
                                return res.status(500).send("Hubo un error en el servidor");
                            }
                        });
                    }
                    if (generoCompetencia > 0 && directorCompetencia > 0 && actorCompetencia > 0){
                        let minimoPeliculas = true
                        if (minimoPeliculas){
                            console.log("No hay suficientes peliculas para crear esta competencia")
                            return res.status(422).send("No hay suficientes peliculas para crear esta competencia");
                        } 
                    }
                    res.sendStatus(200);
                });
            }
        });
    },
    editarCompetencias: (req, res) => {
        let idCompetencia = req.params.id;
        let nombreCompetencia = req.body.nombre;
        let sql = `UPDATE competencia SET nombre = '${nombreCompetencia}' WHERE id = ${idCompetencia};`;
        let sql_ = `SELECT nombre FROM competencia;`
        let nombreRepetido = false;

        con_db.query(sql_, (error_, resultado_, fields_) => {
            if (error_) {
                return res.status(500).send("Hubo un error en el servidor");
            }
            resultado_.forEach(competencia => {
                if (competencia.nombre == nombreCompetencia) {
                    nombreRepetido = true;
                    return res.status(422).send("Ya existe una competencia con el nombre ingresado.");
                }
            });
            if (!nombreRepetido) {
                con_db.query(sql, (error, resultado, fields) => {
                    if (error) {
                        return res.status(500).send("Hubo un error en el servidor");
                    }
                    res.status(200).send(`La competencia se editó correctamente.`)
                });
            }
        });
    },
    eliminarCompetencias: (req, res) => {
        let idCompetencia = req.params.id;
        let sql = `DELETE FROM voto_pelicula WHERE competencia_id = ${idCompetencia};`;
        let sql_ = `DELETE FROM competencia WHERE id = ${idCompetencia};`;

        con_db.query(sql, (error, resultado, fields) => {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            con_db.query(sql_, (error_, resultado_, fields_) => {
                if (error_) {
                    console.log("Hubo un error en la consulta", error_.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
            });
            res.status(200).send(`La competencia se eliminó correctamente.`)
        });
    },
    buscarOpciones: (req, res) => {
        let idCompetencia = req.params.id;
        let sql = `SELECT nombre, genero_id, director_id, actor_id FROM competencia WHERE id=${idCompetencia};`;
        let tablas = '';
        let condiciones = '';
        let nombreCompetencia, filtros, sqlRandom;

        con_db.query(sql, (error, resultado) => {
            if (error) {
                return res.status(404).send("No se encontró la competencia");
            }
            filtros = resultado[0];
            nombreCompetencia = resultado[0].nombre;

            sqlRandom = `SELECT * FROM pelicula ORDER BY RAND() limit 2;`;

            if (filtros.genero_id != undefined) {
                tablas = `JOIN genero g ON p.genero_id = g.id`;
                condiciones = `WHERE g.id = ${filtros.genero_id}`
                if (filtros.director_id != undefined) {
                    tablas += ` JOIN director d ON p.director = d.nombre`;
                    condiciones += ` AND d.id = ${filtros.director_id}`;
                }
                if (filtros.actor_id != undefined) {
                    tablas += ` JOIN actor_pelicula ap ON p.id = ap.pelicula_id`;
                    condiciones += ` AND ap.actor_id = ${filtros.actor_id}`;
                }
            }
            if (filtros.director_id != undefined && filtros.genero_id == undefined) {
                tablas = `JOIN director d ON p.director = d.nombre`;
                condiciones = `WHERE d.id = ${filtros.director_id}`;
                if (filtros.actor_id != undefined) {
                    tablas += ` JOIN actor_pelicula ap ON p.id = ap.pelicula_id`;
                    condiciones += ` AND ap.actor_id = ${filtros.actor_id}`;
                }
            }
            if (filtros.actor_id != undefined && filtros.genero_id == undefined && filtros.director_id == undefined) {
                tablas = `JOIN actor_pelicula ap ON p.id = ap.pelicula_id`;
                condiciones = `WHERE ap.actor_id = ${filtros.actor_id}`;
            }
            sqlRandom = `SELECT p.* FROM pelicula p ${tablas} ${condiciones} ORDER BY RAND() limit 2;`;
            con_db.query(sqlRandom, (error, resultado) => {
                if (error) {
                    return res.status(404).send("No se encontró la competencia");
                }
                if (resultado == undefined || resultado.length < 2) {
                    return res.status(422).send("No hay resultados suficientes para realizar la competencia.");
                } else {
                    let responseConFiltros = {
                        'competencia': nombreCompetencia,
                        'peliculas': resultado
                    };
                    res.send(JSON.stringify(responseConFiltros));
                }
            });
        });
    },
    obtenerDosPelisRandom: (req, res) => {
        let idCompetencia = req.params.id
        const sqlCompetencia = `select id from competencia where id = ${idCompetencia}`
        con_db.query(sqlCompetencia, (error, resultado) => {
            if (error) {
                console.log("Chann hubo un error en la consulta", error.message);
                return res.status(500).send("Ocurrio un error al procesar la petición");
            }
            if (resultado.length > 0) {
                const sql = "select id,poster,titulo from pelicula order by rand() limit 2"
                console.log('salir a buscar 2 peliculas random en la base de datos')
                con_db.query(sql, (error, resultado) => {
                    if (error) {
                        console.log("Chann hubo un error en la consulta", error.message);
                        return res.status(404).send("Hubo un error en la consulta");
                    }
                    const response = {
                        peliculas: resultado
                    }
                    res.send(JSON.stringify(response));
                });
            } else {
                return res.status(404).send("Upss la competencia que intenta obtener no existe");
            }
        })
    },
    guardarVotos: (req, res) => {
        let idCompetencia = req.params.id;
        let idPelicula = parseInt(req.body.idPelicula);
        let sql = `INSERT INTO voto_pelicula (competencia_id, pelicula_id) VALUES (${idCompetencia}, ${idPelicula});`;
        con_db.query(sql, (error, resultado) => {
            res.json(resultado);
        });
    },
    reiniciarCompetenciasSinVotos: (req, res)=>{
        let idCompetencia = req.params.id;
        let sql = `DELETE FROM voto_pelicula WHERE competencia_id = ${idCompetencia};`;
        let sqlCompetencia = `SELECT * FROM competencia WHERE id = ${idCompetencia};`
      
        con_db.query(sqlCompetencia, (error, resultado,)=> {
          if (resultado == 0) {
            return res.status(404).send("No existe la competencia seleccionada.");
          }else{
            con_db.query(sql, (error, resultado, fields)=> {
              if (error) {
                return res.status(500).send("Hubo un error en el servidor");
              }
            res.status(200).send(`La competencia se reinició correctamente.`)
            });
          }
        });
    }, 
    buscarResultados: (req, res) => {
        let idCompetencia = req.params.id;
        let sql = `SELECT cp.pelicula_id, p.poster, p.titulo, COUNT(*) AS votos FROM voto_pelicula cp JOIN pelicula p ON pelicula_id = p.id WHERE cp.competencia_id = ${idCompetencia} GROUP BY cp.pelicula_id, p.poster ORDER BY votos DESC LIMIT 3;`;
        let sql_ = `SELECT c.nombre as nombre FROM voto_pelicula cp JOIN competencia c ON competencia_id = c.id WHERE cp.competencia_id = ${idCompetencia};`;

        con_db.query(sql_, (error_, resultado_, fields_) => {
            if (error_) {
                console.log("Hubo un error en la consulta", error_.message);
                return res.status(404).send("Hubo un error en la consulta");
            } else if (resultado_.length == 0) {
                return res.status(404).send("No hay películas votadas para esta competencia.");
            }

            let nombreCompetencia = resultado_[0].nombre;

            con_db.query(sql, (error, resultado, fields) => {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                let response = {
                    'competencia': nombreCompetencia,
                    'resultados': resultado
                };
                res.send(JSON.stringify(response));
            });
        });
    },
    buscarGenero: (req, res) => {
        let sql = `SELECT nombre, id FROM genero`;
        con_db.query(sql, (error, resultado) => {
            if (error) {
                return res.status(404).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado));
        });
    },
    buscarDirector: (req, res) => {
        let sql = `SELECT nombre, id FROM director`;
        con_db.query(sql, (error, resultado) => {
            if (error) {
                return res.status(404).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado));
        });
    },
    buscarActor: (req, res) => {
        let sql = `SELECT nombre, id FROM actor`;
        con_db.query(sql, (error, resultado) => {
            if (error) {
                return res.status(404).send("Hubo un error en la consulta");
            }
            res.send(JSON.stringify(resultado));
        });
    }
}

module.exports = controlador;