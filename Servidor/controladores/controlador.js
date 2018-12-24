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
    nuevaCompetencia: (req,res)=>{
        const nombreCompetencia = req.body.nombre,
        genero_id = req.body.genero,
        director_id = req.body.director,
        actor_id = req.body.actor,
        anio = parseInt(req.body.anio);

        if (!nombreCompetencia) {
            console.log("Debe completar el nombre de la competencia");
            return res.status(422).send("Debe completar el nombre de la competencia");    
        }
    
        let sql = "SELECT * FROM competencia WHERE nombre = '" + nombreCompetencia + "'";
    
        con_db.query(sql, (error, resultado)=> {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
    
            if (resultado.length === 1) {
                console.log("Ya hay una competencia con este nomnbre");
                return res.status(422).send("Ya hay una competencia con este nomnbre");
            }
    
            let sql = "SELECT count(pelicula.id) As cantidad FROM pelicula", join = "", where = "", campos = "nombre", valores = ") VALUES ('" + nombreCompetencia + "'";
    
            if (genero_id > 0) {
                if (where.length > 0){
                    where += " and ";
                } else {
                    where += " WHERE ";
                }
    
                where += "pelicula.genero_id = " + genero_id;
                campos += ",genero_id";
                valores += "," + genero_id;
            }
        
            if (director_id > 0) {
                join += " INNER JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id" ;
    
                if (where.length > 0){
                    where += " and ";
                } else {
                    where += " WHERE ";
                }
    
                where +=  "director_pelicula.director_id = " + director_id;
                campos += ",director_id";
                valores += "," + director_id;
            }
        
            if (actor_id > 0) {
                join += " INNER JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id" ;
    
                if (where.length > 0){
                    where += " and ";
                } else {
                    where += " WHERE ";
                }
    
                where += "actor_pelicula.actor_id = " + actor_id;
                campos += ",actor_id";
                valores += "," + actor_id;
            }
    
            if (anio > 0) {
                if (where.length > 0){
                    where += " and ";
                } else {
                    where += " WHERE ";
                }
    
                where += "pelicula.anio = " + anio;
                campos += ",anio";
                valores += "," + anio;
            }
    
            sql += join + where;
            
            con_db.query(sql, (error, resultado)=> {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                
                if (resultado.length === 0 || resultado[0].cantidad <= 1) {
                    console.log("Con este criterio no hay 2 peliculas como minimo");
                    return res.status(422).send("Con este criterio no hay 2 peliculas como minimo");
                }
        
                sql = "INSERT INTO competencia ("+ campos + valores + ")";
    
                con_db.query(sql, (error, resultado)=> {
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(404).send("Hubo un error en la consulta");
                    }
        
                    res.status(200).send();    
                });                
            });        
        });
    }, 
    eliminarCompetencias: (req, res)=>{
        console.log(`falta construir`)
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
                let sql = `INSERT INTO voto (competencia_id, pelicula_id) VALUES (${idCompetencia}, ${idPelicula});`;
                con_db.query(sql, (error, resultado) => {
                    console.log(`resultado: `, resultado)
                    res.send(JSON.stringify(resultado));
                });
            } else {
                return res.status(404).send("Upss la competencia que intenta obtener no existe");
            }
        })
    },
    eliminarVotos: (req,res)=>{
        const idCompetencia = req.params.id; 
        console.log(idCompetencia)
        let sql = "SELECT * FROM competencia WHERE id = " + idCompetencia;
        
        con_db.query(sql, (error, resultado)=> {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            if (resultado.length === 0) {
                console.log("No se encontro ninguna competencia con este id");
                return res.status(404).send("No se encontro ninguna competencia con este id");
            }
    
            let sql = "DELETE FROM voto WHERE voto.competencia_id = " + idCompetencia;
    
            con_db.query(sql, (error, resultado)=> {
                if (error) {
                    console.log("Hubo un error en la eliminacion de los votos", error.message);
                    return res.status(500).send("Hubo un error en la eliminacion de los votos");
                }
                res.status(200).send();    
            });             
        });
    },
    buscarResultados: (req, res) => {
        const idCompetencia = req.params.id; 
        let sql = "SELECT * FROM competencia WHERE id = " + idCompetencia;
        con_db.query(sql, (error, resultado) =>{
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            if (resultado.length === 0) {
                console.log("No se encontro ninguna competencia con este id");
                return res.status(404).send("No se encontro ninguna competencia con este id");
            }
            const competencia = resultado[0].nombre;
            let sql = "SELECT voto.pelicula_id, pelicula.poster, pelicula.titulo, COUNT(pelicula_id) As votos FROM voto INNER JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE voto.competencia_id = " + idCompetencia + " GROUP BY voto.pelicula_id ORDER BY COUNT(pelicula_id) DESC LIMIT 3";
    
            con_db.query(sql, (error, resultado) =>{
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                const response = {
                    'competencia': competencia,
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