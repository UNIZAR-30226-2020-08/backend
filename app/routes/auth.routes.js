/*Proyecto:     NeoB
//Fecha:        noviembre-2020
//Autores:      Aarón Ibáñez Espés 779088, Pablo García García 781020, Arturo Calvera Tonin 776303
//Módulo:       Back-end del sistema de información del proyecto NeoB
//Fichero:      auth.routes.js
//Descripción:  Archivo para la definición de rutas para el acceso a las funciones del 
                controlador de autenticación desde el front-end mediante operaciones del protocolo http*/

const { authJwt } = require("../middleware");
module.exports = app => {
  const controller = require("../controllers/auth.controller");
  
  var router = require("express").Router();

  router.post("/signup", controller.signup);

  router.post("/signin", controller.signin);

  app.use('/api/auth', router);
};