module.exports = app => {
    const juega = require("../controllers/juega.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", juega.create);

    router.get("/findPlay", juega.find);

    router.delete("/dropPlay", juega.delete);
  
    router.put("/updatePlay", juega.update);
  
    app.use('/api/juega', router);
  };