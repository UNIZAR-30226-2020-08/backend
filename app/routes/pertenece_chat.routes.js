module.exports = app => {
    const pertenece_chat = require("../controllers/pertenece_chat.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", pertenece_chat.create);

    router.get("/findBelongChat", pertenece_chat.find);

    router.delete("/dropBelongChat", pertenece_chat.delete);
  
    router.put("/updateBelongChat", pertenece_chat.update);
  
    app.use('/api/pertenece_chat', router);
  };