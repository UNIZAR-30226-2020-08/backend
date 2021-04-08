module.exports = app => {
    const jugada = require("../controllers/jugada.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", jugada.create);

    router.get("/findPlay", jugada.find);

    router.delete("/dropPlay", jugada.delete);
  
    router.put("/updatePlay", jugada.update);
  
    app.use('/api/jugada', router);
  };