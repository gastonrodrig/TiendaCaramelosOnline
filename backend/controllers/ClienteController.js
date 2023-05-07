'use strict'

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async function(req, res){
    //crear una variable para que reciba toda la data que esta en el cuerpo de toda la data (request)
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});
    if(cliente_arr.length ==0){
        //crea

        if(data.password){
            //crea
            bcrypt.hash(data.password, null, null, async function(error, hash){
                if(hash){
                    data.password = hash;
                    //registrando
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg})
                } else {
                    res.status(200).send({message:'Error server',data:undefined}); 
                }
            })
        }else{
            res.status(200).send({message:'No hay una contraseña',data:undefined}); 
        }
        // res.status(200).send({data:reg});
    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined}); 
    }
}

const login_cliente = async function(req,res){
    var data = req.body;
    // Creando arreglo de cliente
    var cliente_arr = []
    // Buscando email con la bd
    cliente_arr = await Cliente.find({email:data.email});
    if(cliente_arr == 0) {
        // El correo no esta registrado
        res.status(200).send({message: 'No se encontró el correo', data:undefined});
    } else {
        // Login
        let user = cliente_arr[0];
        // Desencriptar password
        bcrypt.compare(data.password, user.password, async function(err, check) {
            if(check) {
                // Login
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({message: 'La contraseña no conicide', data:undefined});
            }
        });
    }
}

module.exports = {
    registro_cliente,
    login_cliente
}