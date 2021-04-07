module.exports = app => {
    const fondo_carta = require("../controllers/fondo_carta.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", fondo_carta.create);

    router.get("/findCardBack", fondo_carta.find);

    router.delete("/dropCardBack", fondo_carta.delete);
  
    router.put("/updateCardBack", fondo_carta.update);
  
    app.use('/api/fondo_carta', router);
  };