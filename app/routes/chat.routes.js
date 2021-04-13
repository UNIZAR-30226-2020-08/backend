module.exports = app => {
    const chat = require("../controllers/chat.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", chat.create);

    router.get("/findChat", chat.find);

    router.get("/findAllChats", chat.findAll);

    router.delete("/dropChat", chat.delete);

    router.delete("/dropAllChats", chat.deleteAll);
  
    router.put("/updateChat", chat.update);
  
    app.use('/api/chat', router);
  };