const express = require('express');
const student = require('./estudiantes');
const event = require('./eventos');
const joi = require('joi');
const regRuta = express.Router();

const estudiantes = student.data;
const eventos = event.data;

regRuta.get('/:id', (req, res) =>{
    let evento = existeEvento(req.params.id);
    if(!evento){
        res.status(404).send('El evento no existe');
        return;
    }
    res.send(evento.estudiantes);
});

regRuta.get('/:idEvent/:idEst', (req, res) =>{
    let evento = existeEvento(req.params.idEvent);
    if(!evento){
        res.status(404).send('El evento no existe');
        return;
    }
    let estudiante = existeEstudianteCurso(evento, req.params.idEst);
    if(!estudiante){
        res.status(404).send('El estudiante no esta registrado en el evento');
        return;
    }
    res.send(estudiante);
})


regRuta.delete('/:idEvent/:idEst', (req, res) =>{
    let evento = existeEvento(req.params.idEvent);
    if(!evento){
        res.status(404).send('El evento no existe');
        return;
    }
    let estudiante = existeEstudianteCurso(evento, req.params.idEst);
    if(!estudiante){
        res.status(404).send('El estudiante no está registrado en ell curso');
        return;
    }
    const index = evento.estudiantes.indexOf(estudiante);
    evento.estudiantes.splice(index,1);
    res.send(estudiante);
});

regRuta.post('/:idEvent/', (req,res) =>{
    let evento = existeEvento(req.params.idEvent);
    if(!evento){
        res.status(404).send('El evento no existe');
        return;
    }
    const {value,error} = validarEstudianteid(req.body.id); 
    if(!error){
        let estudiante = existeEstudiante(req.body.id);
        if(!estudiante){
            res.status(404).send('El estudiante no existe');
            return;
        }
        if(EstudianteRepetido(estudiante.id, evento.estudiantes)){
            res.status(404).send('El estudiante ya está registrado en el evento');
            return;
        }
        else{
            const registrarEstudiante = {
                id: estudiante.id,
                nombre: estudiante.nombre
            }
            evento.estudiantes.push(registrarEstudiante);
            res.send(registrarEstudiante);
        }
    }
    else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
});

function existeEvento(id){
    return ((eventos.find(evento => evento.id === parseInt(id))));
}

function existeEstudiante(id){
    return ((estudiantes.find(estudiante => estudiante.id === parseInt(id))));
}

function existeEstudianteCurso(evento, idEst){
    return ((evento.estudiantes.find(estudiante => estudiante.id === parseInt(idEst))));
}

function validarEstudianteid(_id){
    const schema = joi.object({
        id: joi.number().integer().required()
    });
    return (schema.validate({
        id: _id
    }));
}

function EstudianteRepetido(estudianteID, estudiantes){
    return (estudiantes.find(estudiante => estudiante.id === estudianteID));
}

module.exports = regRuta; //Se exposta el objeto ruta
