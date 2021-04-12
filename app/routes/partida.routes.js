module.exports = app => {
    const partida = require("../controllers/partida.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", partida.create);

    router.get("/findGame", partida.find);

    //router.get("/findAllGames", partida.findAll);

    router.delete("/dropGame", partida.delete);
  
    router.put("/updateGame", partida.update);
  
    app.use('/api/partida', router);
  };