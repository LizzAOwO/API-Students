const express = require('express');
const joi = require('joi');
const eventRuta = express.Router();

const eventos = [
    {
        id: 1,
        nombre: 'Pintura plastica',
        fecha: '23 septiembre 2021',
        hora: '4 pm',
        lugar: 'DICIS',
        expositor: 'Elizabeth Cuellar',
        estudiantes: []
    },
    {
        id: 2,
        nombre: 'Programacion en c++',
        fecha: '19 septiembre 2021',
        hora: '2 pm',
        lugar: 'Universidad de guanajuato',
        expositor: 'Fernando Vargas',
        estudiantes: []
    }
];


eventRuta.get('/', (req,res)=>{
    res.send(eventos);
});

eventRuta.get('/:id', (req, res) => {
    const id = req.params.id;
    let evento = existeEvento(id);
    if(!evento){
        res.status(404).send(`El evento ${id} no se encuentra!`);//Devuelve el estado HTTP 404
        return;
        }
    res.send(evento);
    return;
});


//agregar eventos
eventRuta.post('/', (req,res) => {
    const {error, value} = validarEvento(req.body.nombre, req.body.fecha, req.body.hora, req.body.lugar, req.body.expositor);
    if(!error){
        const evento = {
            id: eventos.length + 1, //ID automatico del nuevo usuario
            nombre: req.body.nombre, //para pedir el nombre
            fecha: req.body.fecha, //para pedir el email
            hora: req.body.hora, //para pedir la carrera
            lugar: req.body.lugar,
            expositor: req.body.expositor, //para pedir el semestre
            estudiantes: []
            };
            if(validacionEvento(req.body.nombre, req.body.fecha, req.body.hora, req.body.lugar, req.body.expositor))
                {return res.status(404).send("El evento ya existe!")}
            eventos.push(evento);
            res.send(evento);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return;
});


//Actualizacion de datos
//--nombre
eventRuta.put('/:id',(req, res)=>{
    //Encontrar si existe el usuario a modificar
   let evento = existeEvento(req.params.id);
    if(!evento){
        res.status(404).send('El evento no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    const {value, error} = validarEvento(req.body.nombre, req.body.fecha, req.body.hora, req.body.lugar, req.body.expositor);
    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        
    }
    evento.nombre = value.nombre;
    evento.fecha = value.fecha;
    evento.hora = value.hora;
    evento.lugar = value.lugar;
    evento.expositor = value.expositor;
    res.send(evento);
    return;
});


//Eliminacion de datos
eventRuta.delete('/:id', (req, res) =>{
    let evento = existeEvento(req.params.id);
    if(!evento){
        res.status(404).send('El evento no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Encontrar el indice del usuario demtro del arreglo
    const index = eventos.indexOf(evento);
    eventos.splice(index, 1);//Elimina el usuario del indice
    res.send(evento); //responde con el usuario eliminad
});

function existeEvento(id){
    return (eventos.find(evento => evento.id === parseInt(id)));
}

function validarEvento(nom, fec, hor, lug, expo){
    const schema = joi.object({
        nombre: joi.string().min(3).required(),
        fecha: joi.string().min(6),
        hora: joi.string().max(8),
        lugar: joi.string().min(5),
        expositor: joi.string().min(7)
    });
    return (schema.validate({nombre:nom, fecha:fec, hora:hor, lugar:lug, expositor:expo}));
}

function validacionEvento(nom, fec, hor, lug, expo){
    for(let i=1; i<eventos.length;i++)
        if((eventos[i].nombre === nom)&&(eventos[i].fecha === fec)&&(eventos[i].hora === hor)&&(eventos[i].lugar === lug)&&(eventos[i].expositor === expo))
           { var flag = true;}
    return flag;
}
module.exports = {
    eventRuta,
    data: eventos
}; 
//Se exposta el objeto ruta y los datos del evento