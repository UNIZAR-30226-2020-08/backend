module.exports = app => {
  const partida = require("../controllers/partida.controller.js");

  var router = require("express").Router();

  router.post("/", partida.create);

  router.get("/findGame", partida.find);

  router.get("/findAllGames/:tipo", partida.findAll);

  router.delete("/dropGame", partida.delete);

  router.put("/updateGame/:nombre", partida.update);

  router.put("/cantar/:nombre/:jugador", partida.cantar);

  router.put("/cambiar7/:nombre/:jugador", partida.cambiar7);

  app.use('/api/partida', router);
};