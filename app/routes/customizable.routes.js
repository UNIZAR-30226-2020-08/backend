module.exports = app => {
    const customizable = require("../controllers/customizable.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", customizable.create);

    router.get("/findCustomizable", customizable.find);

    router.get("/findAllCustomizables", customizable.findAll);

    router.delete("/dropCustomizable", customizable.delete);

    router.delete("/dropAllCustomizables", customizable.deleteAll);

    //router.delete("/dropAllCards", carta.deleteAll);
  
    router.put("/updateCustomizable", customizable.update);
  
    app.use('/api/customizable', router);
  };