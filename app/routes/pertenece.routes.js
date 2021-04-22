module.exports = app => {
  const pertenece = require("../controllers/pertenece.controller.js");

  var router = require("express").Router();

  router.post("/", pertenece.create);

  router.post("/joinPrivate", pertenece.joinPrivate);

  router.get("/findBelong", pertenece.find);

  router.get("/findAllBelong/:partida", pertenece.findAll);

  router.delete("/dropBelong", pertenece.delete);

  router.delete("/dropGameBelong", pertenece.deleteAll);

  router.put("/updateBelong", pertenece.update);

  router.put("/repartir/:partida/:jugador", pertenece.repartir);

  router.put("/robar/:partida/:jugador/:carta", pertenece.robar);

  app.use('/api/pertenece', router);
};