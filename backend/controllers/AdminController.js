'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_admin = async function(req, res){
    //crear una variable para que reciba toda la data que esta en el cuerpo de toda la data (request)
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email:data.email});
    if(admin_arr.length ==0){
        //crea
        // COMENTARIO
        if(data.password){
            //crea
            bcrypt.hash(data.password, null, null, async function(error, hash){
                if(hash){
                    data.password = hash;
                    //registrando
                    var reg = await Admin.create(data);
                    res.status(200).send({data:reg})
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

const login_admin = async function(req,res){
    var data = req.body;
    // Creando arreglo de cliente
    var admin_arr = []
    // Buscando email con la bd
    admin_arr = await Admin.find({email:data.email});
    if(admin_arr == 0) {
        // El correo no esta registrado
        res.status(200).send({message: 'No se encontró el correo', data:undefined});
    } else {
        // Login
        let user = admin_arr[0];
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
    registro_admin,
    login_admin
}