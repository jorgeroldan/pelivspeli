//paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const controlador = require('./controladores/controlador');

const app = express();

//habilitar permisos para hacer peticiones sin tantas restricciones de seguridad
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Consultas archivos desde el servidor
app.use('/', express.static(path.join(__dirname, '/../cliente')));
app.use('/', express.static(path.join(__dirname, '/../cliente/html')))

//rutas
app.get('/actores', controlador.buscarActor)
app.get('/directores', controlador.buscarDirector)
app.get('/generos', controlador.buscarGenero)
app.get('/competencias', controlador.listarCompetencias);
app.post('/competencias/:id/voto', controlador.guardarVotos)
app.get('/competencias/:id/peliculas', controlador.obtenerDosPelisRandom);
app.get('/competencias/:id/resultados', controlador.buscarResultados)


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
const puerto = '8080';

app.listen(puerto, function () {
  console.log( "Yeahhh! Escuchando en el puerto " + puerto );
});

