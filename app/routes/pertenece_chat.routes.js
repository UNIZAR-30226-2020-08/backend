module.exports = app => {
    const pertenece_chat = require("../controllers/pertenece_chat.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", pertenece_chat.create);

    router.get("/findBelongChat", pertenece_chat.find);

    router.get("/findAllBelongChat", pertenece_chat.findAll);

    router.delete("/dropBelongChat", pertenece_chat.delete);

    router.delete("/dropAllBelongChat", pertenece_chat.deleteAll);
  
    router.put("/updateBelongChat", pertenece_chat.update);
  
    app.use('/api/pertenece_chat', router);
  };