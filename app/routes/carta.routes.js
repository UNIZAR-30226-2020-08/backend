module.exports = app => {
    const carta = require("../controllers/carta.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", carta.create);

    router.get("/findCard", carta.find);

    router.delete("/dropCard", carta.delete);
  
    router.put("/updateCard", carta.update);
  
    app.use('/api/carta', router);
  };