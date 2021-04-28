module.exports = app => {
  const jugada = require("../controllers/jugada.controller.js");

  var router = require("express").Router();

  router.post("/", jugada.create);

  router.get("/findPlay/:nronda/:partida", jugada.find);

  router.get("/findAllPlays", jugada.findAll);

  router.delete("/dropPlay", jugada.delete);

  router.delete("/dropAllPlays", jugada.deleteAll);

  router.put("/updatePlay", jugada.update);
  
  router.put("/getRoundWinner/:nronda/:partida", jugada.getRoundWinner);

  app.use('/api/jugada', router);
};