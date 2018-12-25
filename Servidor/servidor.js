//paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const controlador = require('./controladores/controlador');

const app = express();

//Habilitar permisos para hacer peticiones sin tantas restricciones de seguridad
app.use(cors());

//Instala un middleware para extraer los request y verlos a traves de req.body
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Consultas archivos desde el servidor con path
app.use('/', express.static(path.join(__dirname, '/../cliente')));
app.use('/', express.static(path.join(__dirname, '/../cliente/html')))
app.use('/', express.static(path.join(__dirname, '/../cliente/html/administrar')))

//rutas get
app.get('/generos', controlador.buscarGenero)
app.get('/actores', controlador.buscarActor)
app.get('/directores', controlador.buscarDirector)
app.get('/competencias', controlador.listarCompetencias);
app.get('/competencias/:id', controlador.listarCompetenciaId);
app.get('/competencias/:id/peliculas', controlador.buscarOpciones);
app.get('/competencias/:id/peliculas', controlador.obtenerDosPelisRandom);
app.get('/competencias/:id/resultados', controlador.buscarResultados);
//rutas post
app.post('/competencias', controlador.nuevaCompetencia);
app.post('/competencias/:id/voto', controlador.guardarVotos);
//rutas put
app.put('/competencias/:id', controlador.editarCompetencias);
//rutas delete
app.delete('/competencias/:id', controlador.eliminarCompetencias);
app.delete('/competencias/:id/votos', controlador.reiniciarCompetenciasSinVotos);


//Seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '8080';

app.listen(puerto, function () {
  console.log( "Yeahhh! Escuchando en el puerto " + puerto );
});

