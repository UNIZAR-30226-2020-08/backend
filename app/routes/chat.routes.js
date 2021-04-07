module.exports = app => {
    const chat = require("../controllers/chat.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", chat.create);

    router.get("/findChat", chat.find);

    router.delete("/dropChat", chat.delete);
  
    router.put("/updateChat", chat.update);
  
    app.use('/api/chat', router);
  };