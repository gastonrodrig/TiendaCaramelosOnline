'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'gaston';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        // iat Trabaja con la fecha, hora y dia
        // moment crea el dia y la fecha actual
        // unix: formato numero
        role: user.rol,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }
    return jwt.encode(payload, secret);
}