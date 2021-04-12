module.exports = app => {
  const torneo_publico = require("../controllers/torneo_publico.controller.js");

  var router = require("express").Router();

  router.post("/", torneo_publico.create);

  router.get("/findPublicTournament", torneo_publico.find);

  router.get("/findAllPublicTournament", torneo_publico.findAll);

  router.delete("/dropPublicTournament", torneo_publico.delete);

  router.put("/updatePublicTournament", torneo_publico.update);

  app.use('/api/torneo_publico', router);
};