const con_db = require('../lib/conexion_bd');

const controlador = {


    listarCompetencias: (req,res) => {

    const sql = "select * from competencia"
    console.log('aca')
    console.log(sql)

    con_db.query(sql, (error, resultado) => {
        if (error) {
            console.log("Chann hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        res.send(JSON.stringify(resultado));
    });

    }, 

    obtenerDosPelisRandom: (req,res)=>{
    
    const sqlCompetencia = `select id from competencia where id = ${req.params.id}`


    console.log(sqlCompetencia)

    con_db.query(sqlCompetencia, (error, resultado) => {
        if(error){
            console.log("Chann hubo un error en la consulta", error.message);
            return res.status(500).send("Ocurrio un error al procesar la petición");
        }
        if (resultado.length > 0){
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
            return res.status(404).send("La competencia que intenta obtener no existe");
        }

    })

    
    }
}

module.exports = controlador;