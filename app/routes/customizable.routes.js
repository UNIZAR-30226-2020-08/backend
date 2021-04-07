module.exports = app => {
    const customizable = require("../controllers/customizable.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", customizable.create);

    router.get("/findCustomizable", customizable.find);

    router.delete("/dropCustomizable", customizable.delete);
  
    router.put("/updateCustomizable", customizable.update);
  
    app.use('/api/customizable', router);
  };