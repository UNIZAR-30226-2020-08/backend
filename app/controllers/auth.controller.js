/*Proyecto:     NeoB
//Fecha:        noviembre-2020
//Autores:      Aarón Ibáñez Espés 779088, Pablo García García 781020, Arturo Calvera Tonin 776303
//Módulo:       Back-end del sistema de información del proyecto NeoB
//Fichero:      auth.controller.js
//Descripción:  Archivo con funciones para el control de las acciones de sign-up y sign-in
                para los administradores del sistema NeoB*/

const db = require("../models");
const config = require("../config/auth.config");
const Usuario = db.usuario;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Crear usuario
  const usuario = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password,8),
    email: req.body.email,
    copas: req.body.copas ? req.body.copas: 0,
    f_perfil: req.body.f_perfil ? req.body.f_perfil: 'userlogo1',
    f_tapete: req.body.f_tapete ? req.body.f_tapete: 'tapete1',
    f_carta: req.body.f_carta ? req.body.f_carta: 'baraja1',
  };
  Usuario.create(usuario)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Error creando usuario" });
  });
};

//Iniciar sesion
exports.signin = (req, res) => {
  Usuario.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(data => {
      if (data === null) {
        return res.status(404).send({ message: "No existe el usuario" });
      }
      var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Contrasenya incorrecta"
        });
      }

      var token = jwt.sign({ usuario: data.usuario, copas: data.copas, f_carta: data.f_carta,
      f_tapete: data.f_tapete}, config.secret, {
        //expiresIn: '12h' // 1 hours
      });

      res.status(200).send({
        data,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};