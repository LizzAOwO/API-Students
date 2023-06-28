const express = require('express');
const eventos = require('./eventos');
const joi = require('joi');
const estRuta = express.Router();


const estudiantes = [
    {
        id: 1,
        nombre: 'Fernando Vargas',
        email: 'f.vargasrdz@gmail',
        carrera: 'LISC',
        semestre: 6,
    },
    {
        id: 2,
        nombre: 'Gael Morales',
        email: 'g.morales@gmail',
        carrera: 'LISC',
        semestre: 6,
    },
    {
        id: 3,
        nombre: 'Raul Silva',
        email: 'r.silva@gmail',
        carrera: 'LISC',
        semestre: 3,
    }
];


estRuta.get('/', (req,res)=>{
    res.send(estudiantes);
});

estRuta.get('/:id', (req, res) => {
    const id = req.params.id;
    let estudiante = existeEstudiante(id);
    if(!estudiante){
        res.status(404).send(`El usuario ${id} no se encuentra!`);//Devuelve el estado HTTP 404
        return;
        }
    res.send(estudiante);
    return;
});


//agregar estudiantes
estRuta.post('/', (req,res) => {
    const {error, value} = validarEstudiante(req.body.nombre, req.body.email, req.body.carrera, req.body.semestre);
    if(!error){
        const estudiante = {
            id: estudiantes.length + 1, //ID automatico del nuevo usuario
            nombre: req.body.nombre, //para pedir el nombre
            email: req.body.email, //para pedir el email
            carrera: req.body.carrera, //para pedir la carrera
            semestre: req.body.semestre //para pedir el semestre

            };
            if(validacionEmail(req.body.email))
                {return res.status(404).send("El email ya existe!")}
            estudiantes.push(estudiante);
            res.send(estudiante);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return;
});


//Actualizacion de datos
//--nombre
estRuta.put('/:id',(req, res)=>{
    //Encontrar si existe el usuario a modificar
   let estudiante = existeEstudiante(req.params.id);
    if(!estudiante){
        res.status(404).send('El Estudiante no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Validar si el dato recibido es correcto
    const {value, error} = validarEstudiante(req.body.nombre, req.body.email, req.body.carrera, req.body.semestre);
    if(error){
        //Actualiza el nombre
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        
    }
    if(validacionEmail(req.body.email))
        {return res.status(404).send(`El email ya existe!`);}
    estudiante.nombre = value.nombre;
    estudiante.email = value.email;
    estudiante.carrera = value.carrera;
    estudiante.semestre = value.semestre;
    res.send(estudiante);
    return;
});


//Eliminacion de datos
estRuta.delete('/:id', (req, res) =>{
    let estudiante = existeEstudiante(req.params.id);
    if(!estudiante){
        res.status(404).send('El estudiante no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Encontrar el indice del usuario demtro del arreglo
    const index = estudiantes.indexOf(estudiante);
    validarEstudianteEventoDelete(estudiante.id);
    estudiantes.splice(index, 1);//Elimina el usuario del indice
    res.send(estudiante); //responde con el usuario eliminad
});

function existeEstudiante(id){
    return (estudiantes.find(estudiante => estudiante.id === parseInt(id)));
}

function validarEstudiante(nom, correo, carr, sem){
    const schema = joi.object({
        nombre: joi.string().min(3).required(),
        email: joi.string().min(10).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'mx']}}),
        carrera: joi.string().max(5),
        semestre: joi.number()
    });
    return (schema.validate({nombre:nom, email:correo, carrera:carr, semestre:sem}));
}

function validacionEmail(correo){
    for(let i=1; i<estudiantes.length;i++)
        if(estudiantes[i].email === correo)
            var flag = true;
    return flag;
}

function validarEstudianteEventoDelete(id){
    eventos.data.forEach( course => {
        course.estudiantes.forEach(estudiante => {
            if(estudiante.id === parseInt(id)){
                const index = course.estudiantes.indexOf(student);
                course.estudiantes.splice(index, 1);
            }
        });
    })
}

module.exports = {
    estRuta,
    data: estudiantes
}; 
//Se exposta el objeto ruta y los datos del evento