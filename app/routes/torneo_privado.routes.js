module.exports = app => {
  const torneo_privado = require("../controllers/torneo_privado.controller.js");

  var router = require("express").Router();

  router.post("/", torneo_privado.create);

  router.get("/findPrivateTournament", torneo_privado.find);

  router.get("/findAllPrivateTournament", torneo_privado.findAll);

  router.delete("/dropPrivateTournament", torneo_privado.delete);

  router.put("/updatePrivateTournament", torneo_privado.update);

  app.use('/api/torneo_privado', router);
};