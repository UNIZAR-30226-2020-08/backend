/*Proyecto:     NeoB
//Fecha:        noviembre-2020
//Autores:      Aarón Ibáñez Espés 779088, Pablo García García 781020, Arturo Calvera Tonin 776303
//Módulo:       Back-end del sistema de información del proyecto NeoB
//Fichero:      authJWT.js
//Descripción:  Archivo con funciones para el control y manejo de tokens de sesión y roles de los administradores
                para el sistema de NeoB */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require("../models");
const Admin = db.admin;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

isAdmin = (req, res, next) => {
    Admin.findByPk(req.usuario).then(user => {
    if (user.rol === "ROLE_ADMIN") {
          next();
          return;
    }
    res.status(403).send({
        message: "Require Admin Role!"
    });
      return;
    });
};

isModerator = (req, res, next) => {
    Admin.findByPk(req.usuario).then(user => {
    if (user.rol === "ROLE_MODERATOR") {
        next();
        return;
    }
    res.status(403).send({
        message: "Require Moderator Role!"
    });
        return;
    });
};

verifyGeneralToken = (req, res, next) => {
  const token = req.headers['general-auth'];
  if(typeof token !== 'undefined'){
      jwt.verify(token,config.secret,(err,data) => {
          if(err){
              console.log("cant_verify")
              return res.status(403).send({
                  message: "Unauthorized!"
              }) 
          }else{
              const a = data.secretstr.split(' ')[0];
              const b = data.secretstr.split(' ')[1];
              const c = data.secretstr.split(' ')[2];
              if(typeof a !== 'undefined' && typeof b !== 'undefined' && typeof c !== 'undefined' ){
                  var ok = bcrypt.compareSync(config.secretTokenStr,a.toString());
                  if(!ok || (b < Date.now()) || (c>=1000000 || c<100000)){
                      return res.status(403).send({
                          message: "Unauthorized!"
                      })
                  }
                  next();
              }else{
                  return res.status(403).send({
                      message: "Unauthorized!"
                  })   
              }
          }
      })
  }else{
      return res.status(403).send({
          message: "No token provided!"
      })
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  verifyGeneralToken: verifyGeneralToken,
};

module.exports = authJwt;