module.exports = app => {
  const torneo = require("../controllers/torneo.controller.js");

  var router = require("express").Router();

  router.post("/", torneo.create);

  router.put("/matchRound/:torneo/:ronda", torneo.matchRound);

  router.get("/findTournament/:torneo", torneo.find);

  router.get("/findAllTournament/:tipo/:nEquipos", torneo.findAll);

  router.delete("/dropTournament", torneo.delete);

  router.put("/updateTournament", torneo.update);

  app.use('/api/torneo', router);
};