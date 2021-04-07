module.exports = app => {
    const pertenece = require("../controllers/pertenece.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", pertenece.create);

    router.get("/findBelong", pertenece.find);

    router.delete("/dropBelong", pertenece.delete);
  
    router.put("/updateBelong", pertenece.update);
  
    app.use('/api/pertenece', router);
  };