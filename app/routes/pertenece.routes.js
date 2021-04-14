module.exports = app => {
    const pertenece = require("../controllers/pertenece.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", pertenece.create);

    //router.get("/findBelong", pertenece.find);

    router.get("/findAllBelong", pertenece.findAll);

    router.delete("/dropBelong", pertenece.delete);

    router.delete("/dropGameBelong", pertenece.deleteAll);
  
    router.put("/updateBelong", pertenece.update);

    router.put("/repartir", pertenece.repartir);
  
    app.use('/api/pertenece', router);
  };