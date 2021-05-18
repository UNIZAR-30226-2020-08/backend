module.exports = app => {
  const partida = require("../controllers/partida.controller.js");

  var router = require("express").Router();

  router.post("/", partida.create);

  router.get("/findGame/:nombre", partida.find);

  router.get("/findAllGames/:tipo", partida.findAll);

  router.delete("/dropGame", partida.delete);

  router.put("/updateGame/:nombre", partida.update);

  router.put("/cantar/:nombre/:jugador", partida.cantar);

  router.put("/cambiar7/:nombre/:jugador", partida.cambiar7);

  router.put("/partidaVueltas/:partida", partida.partidaVueltas);

  router.put("/recuento/:partida", partida.recuento);

  router.put("/juegaIA/:partida/:carta", partida.IArti);

  router.get("/listarHistorial/:jugador", partida.historial);

  router.get("/listarPausadas/:jugador", partida.listarPausadas);

  app.use('/api/partida', router);
};