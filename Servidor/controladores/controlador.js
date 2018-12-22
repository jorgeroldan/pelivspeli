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
        const sqlCompetencia = `select id from competencia where id = ${idCompetencia}`
        con_db.query(sqlCompetencia, (error, resultado) => {
            if (error) {
                console.log("Chann hubo un error en la consulta", error.message);
                return res.status(500).send("Ocurrio un error al procesar la petición");
            }
            if (resultado.length > 0) {
                let sql = `INSERT INTO voto_pelicula (competencia_id, pelicula_id) VALUES (${idCompetencia}, ${idPelicula});`;
                con_db.query(sql, (error, resultado) => {
                    console.log(`resultado: `, resultado)
                    res.send(JSON.stringify(resultado));
                });
            } else {
                return res.status(404).send("Upss la competencia que intenta obtener no existe");
            }
        })
    },
    mostrarResultados: (req, res) => {
        let idCompetencia = req.params.id;
        let sql = `select count (*) from voto where competencia_id = ${idCompetencia} group by pelicula_id order by 1 desc`;
        con_db.query(sql, (error, resultado) => {
            console.log(`resultado: `, resultado)
            res.send(JSON.stringify(resultado));
        });
    },
    buscarResultados: (req, res) => {
        let idCompetencia = req.params.idCompetencia;
        let sql = `SELECT  id, poster,titulo, COUNT(*) AS votos FROM pelicula cp JOIN pelicula ON pelicula_id = id WHERE competencia_id = ${idCompetencia} GROUP BY id, poster ORDER BY votos DESC LIMIT 3;`;
        let sql_ = `SELECT nombre as nombre FROM voto_pelicula cp JOIN competencia c ON competencia_id = id WHERE competencia_id = ${idCompetencia};`;

        con_db.query(sql_, (error_, resultado_,)=> {
            if (error_) {
                console.log("Hubo un error en la consulta", error_.message);
                return res.status(404).send("Hubo un error en la consulta");
            } else if (resultado_.length == 0) {
                return res.status(404).send("No hay películas votadas para esta competencia.");
            }

            let nombreCompetencia = resultado_[0].nombre;

            con_db.query(sql, (error, resultado) => {
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