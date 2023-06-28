const inicioDebug = require('debug')('app.inicio');
const dbDebug = require('debug')('app:db');
const estudiantes = require('./routes/estudiantes');
const eventos = require('./routes/eventos');
const eventoEstudiante = require('./routes/eventoEstudiante');
const express = require('express'); //Importa el paquete express
const app = express(); //Crea una instancia de express
const config = require('config');//Importa el modulo config
const joi = require('joi'); //Importa el paquete joi
const logger = require('./logger');
const morgan = require('morgan');


app.use(express.json()); //Le decimos a express que use este middleware
app.use(express.urlencoded({extended:true}));

app.use('/api/estudiantes', estudiantes.estRuta); //Middleware que importamos  
app.use('/api/eventos', eventos.eventRuta); //Middleware que importamos  
app.use('/api/eventoEstudiante', eventoEstudiante);

console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`BD server: ${config.get('configDB.host')}`);

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    inicioDebug('Morgan está habilitado...');
}

dbDebug('Conectando con la base de datos...');
app.get('/',(req,res)=>{
    res.send('Hola mundo desde Express!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});
